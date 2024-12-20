import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UpvoteService {
  constructor(private readonly prisma: PrismaService) {}

  async vote(req, postId: string) {
    const user = await this.prisma.user.findUnique({
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
    }

    await this.prisma.upvote.create({
      data: { postId: post.id, userId: user.id },
    });
  }

  async deleteVote(req, voteId: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: req.user.email },
    });
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    const vote = await this.prisma.upvote.findFirst({
      where: { id: parseInt(voteId) },
    });
    if (!vote) {
      throw new HttpException('Vote does not exist', HttpStatus.NOT_FOUND);
    } else if (vote.userId !== user.id) {
      throw new HttpException('Access denieds', HttpStatus.BAD_REQUEST);
    }

    await this.prisma.upvote.delete({ where: { id: vote.id } });
  }
}
