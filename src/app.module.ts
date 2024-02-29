import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { StopPointsModule } from './stop-points/stop-points.module';
import { CityModule } from './city/city.module';
import { PostsModule } from './posts/posts.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    UserModule,
    StopPointsModule,
    CityModule,
    PostsModule,
    // CacheModule.register({
    //   isGlobal: true,
    // }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
