import { Module } from '@nestjs/common';
import { AuthController } from '../../modules/auth/auth.controller';
import { AuthModule } from '../../modules/auth/auth.module';
import { PostModule } from '../../modules/post/post.module';
import { PostController } from '../../modules/post/post.controller';
import { UpvoteModule } from '../../modules/upvote/upvote.module';
import { UpvoteController } from '../../modules/upvote/upvote.controller';

@Module({
  imports: [AuthModule, PostModule, UpvoteModule],
  controllers: [AuthController, PostController, UpvoteController],
  providers: [],
})
export class RoutePublicModule {}
