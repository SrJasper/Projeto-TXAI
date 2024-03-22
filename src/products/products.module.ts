import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthGuardMiddleware } from 'src/auth-guard/auth-guard.middleware';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthGuardMiddleware).forRoutes(ProductsController);
  }
}

