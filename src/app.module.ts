import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { StopPointsModule } from './stop-points/stop-points.module';

@Module({
  imports: [UserModule, StopPointsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
