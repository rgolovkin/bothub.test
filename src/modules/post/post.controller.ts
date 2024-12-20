import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  CreatePostRequestDto,
  FilterPostsDto,
  UpdatePostRequestDto,
} from './dtos/request.dto';
import { CombinedAuthGuard } from '../auth/guards/auth.guard';
import { PostResponseDto } from './dtos/response.dto';
import { Pagination } from '../../utils/pagination/decorators/pagination.decorator';
import {
  PaginationDto,
  PaginationResult,
} from '../../utils/pagination/dto/pagination.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('posts')
@ApiBearerAuth()
@Controller({ path: 'post', version: '1' })
@UseGuards(CombinedAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'Get all posts categories' })
  @ApiResponse({
    status: 200,
    description: 'Get all categories',
  })
  @ApiResponse({ status: 404, description: 'Categories not found' })
  @Get('categories')
  async getCategories() {
    return await this.postService.getCategories();
  }

  @ApiOperation({ summary: 'Get all posts statuses' })
  @ApiResponse({
    status: 200,
    description: 'Get all statuses',
  })
  @ApiResponse({ status: 404, description: 'Statuses not found' })
  @Get('statuses')
  async getStatuses() {
    return await this.postService.getStatuses();
  }

  @ApiOperation({ summary: 'Get all posts with filters' })
  @ApiResponse({
    status: 200,
    description: 'Get all posts',
    type: PaginationResult,
  })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'orderBy', type: String, required: false })
  @ApiQuery({ name: 'orderDirection', type: 'ASC', required: false })
  @Get('all')
  async getAllPosts(
    @Pagination() pagination: PaginationDto,
    @Query() filters: FilterPostsDto,
  ) {
    return await this.postService.getAll(pagination, filters);
  }

  @ApiOperation({ summary: 'Create post' })
  @ApiResponse({
    status: 201,
    description: 'Successfully create post',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiBody({ type: CreatePostRequestDto })
  @Post('create')
  async create(
    @Req() req,
    @Body() data: CreatePostRequestDto,
  ): Promise<PostResponseDto> {
    return await this.postService.create(req, data);
  }

  @ApiOperation({ summary: 'Update post' })
  @ApiResponse({
    status: 201,
    description: 'Successfully update post',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Access denied',
  })
  @ApiBody({ type: UpdatePostRequestDto })
  @Put('update/:postId')
  async update(
    @Param('postId') id: number,
    @Req() req,
    @Body() data: UpdatePostRequestDto,
  ): Promise<PostResponseDto> {
    return await this.postService.update(id, req, data);
  }

  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({ status: 200, description: 'Successfully deleted post' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 400, description: 'Access denied' })
  @Delete(':postId')
  async delete(@Req() req, @Param('postId') id: string): Promise<string> {
    return await this.postService.delete(req, id);
  }
}
