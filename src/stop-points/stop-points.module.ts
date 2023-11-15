import { Module } from '@nestjs/common';
import { StopPointsService } from './stop-points.service';
import { StopPointsController } from './stop-points.controller';

@Module({
  controllers: [StopPointsController],
  providers: [StopPointsService],
})
export class StopPointsModule {}
