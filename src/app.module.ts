import { Module } from '@nestjs/common';
import { RouterModule } from './router/router.module';

@Module({
  imports: [RouterModule.forRoot()],
})
export class AppModule {}
