import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePostRequestDto,
  FilterPostsDto,
  UpdatePostRequestDto,
} from './dtos/request.dto';
import { plainToInstance } from 'class-transformer';
import { PostResponseDto } from './dtos/response.dto';
import {
  PaginationDto,
  PaginationResult,
} from '../../utils/pagination/dto/pagination.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategories() {
    const categories = await this.prisma.post.findMany({
      select: {
        category: true,
      },
    });

    if (!categories.length) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return categories.map((item) => item.category);
  }

  async getStatuses() {
    const statuses = await this.prisma.post.findMany({
      select: {
        status: true,
      },
    });

    if (!statuses.length) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return statuses.map((item) => item.status);
  }

  async getAll(pagination: PaginationDto, filters: FilterPostsDto) {
    const where: any = {};

    if (filters.status) {
      where.status = {
        contains: filters.status,
        mode: 'insensitive',
      };
    }
    if (filters.category) {
      where.category = {
        contains: filters.category,
        mode: 'insensitive',
      };
    }
    if (filters.date) {
      const date = new Date(filters.date);

      const startOfDayUTC = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
      );

      const endOfDayUTC = new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          23,
          59,
          59,
          999,
        ),
      );

      where.createdAt = {
        gte: startOfDayUTC,
        lt: endOfDayUTC,
      };
    }
    if (filters.votesCount && typeof filters.votesCount === 'number') {
      where.upvote = {
        some: {
          id: { gte: filters.votesCount },
        },
      };
    }

    const [posts, count] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: {
          upvote: true,
        },
        skip: (pagination.page - 1) * pagination.perPage,
        take: pagination.perPage,
      }),
      this.prisma.post.count(),
    ]);

    const mappedPosts = posts.map((post) => ({
      ...post,
      upvote: post.upvote.length,
    }));

    return new PaginationResult(
      plainToInstance(PostResponseDto, mappedPosts),
      count,
      pagination,
    );
  }

  async create(req, data: CreatePostRequestDto): Promise<PostResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { email: req.user.email },
    });
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    const post = await this.prisma.post.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        status: data.status,
        authorId: user.id,
      },
    });

    return plainToInstance(PostResponseDto, post);
  }

  async update(
    postId: number,
    req,
    data: UpdatePostRequestDto,
  ): Promise<PostResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { email: req.user.email },
    });
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    const post = await this.prisma.post.findFirst({
      where: { id: Number(postId) },
    });
    if (!post) {
      throw new HttpException('Post does not exist', HttpStatus.NOT_FOUND);
    } else if (post.authorId !== user.id) {
      throw new HttpException('Access denied', HttpStatus.BAD_REQUEST);
    }

    const updatedPost = await this.prisma.post.update({
      where: { id: post.id },
      data: { ...data },
    });

    return plainToInstance(PostResponseDto, updatedPost);
  }

  async delete(req, postId: string): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: { email: req.user.email },
    });
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    const post = await this.prisma.post.findFirst({
      where: { id: parseInt(postId) },
    });
    if (!post) {
      throw new HttpException('Post does not exist', HttpStatus.NOT_FOUND);
    } else if (post.authorId !== user.id) {
      throw new HttpException('Access denied', HttpStatus.BAD_REQUEST);
    }

    await this.prisma.post.delete({ where: { id: parseInt(postId) } });
    return 'Post successful deleted';
  }
}
