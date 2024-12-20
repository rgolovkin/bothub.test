import {
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpvoteService } from './upvote.service';
import { CombinedAuthGuard } from '../auth/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('upvote')
@Controller({ path: 'upvote', version: '1' })
@ApiBearerAuth()
@UseGuards(CombinedAuthGuard)
export class UpvoteController {
  constructor(private readonly upvoteService: UpvoteService) {}

  @ApiOperation({ summary: 'Make upvote' })
  @ApiResponse({ status: 200, description: 'Successfully voted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiParam({ name: 'id', description: 'Post id' })
  @Post(':id')
  async vote(@Req() req, @Param('id') postId: string) {
    return await this.upvoteService.vote(req, postId);
  }

  @ApiOperation({ summary: 'Delete vote' })
  @ApiResponse({ status: 200, description: 'Successfully deleted vote' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 404, description: 'Vote not found' })
  @Delete(':id')
  async delete(@Req() req, @Param('id') id: string) {
    return await this.upvoteService.deleteVote(req, id);
  }
}
