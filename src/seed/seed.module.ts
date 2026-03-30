import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsService } from 'src/products/products.service';
import { ProductsModule } from 'src/products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductsModule],
})
export class SeedModule {}
