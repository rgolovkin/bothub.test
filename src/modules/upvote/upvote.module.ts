import { Module } from '@nestjs/common';
import { UpvoteService } from './upvote.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [UpvoteService, PrismaService],
  exports: [UpvoteService, PrismaService],
})
export class UpvoteModule {}
