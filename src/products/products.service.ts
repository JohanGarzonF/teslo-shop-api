import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productsRepository.create(createProductDto);
      await this.productsRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit, offset } = paginationDto;
      return await this.productsRepository.find({
        take: limit,
        skip: offset,
      });
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findOne(term: string) {
    let product: Product | null;
    if (isUUID(term)) {
      product = await this.productsRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productsRepository.createQueryBuilder();
      product = await queryBuilder
        .where('LOWER(title) = LOWER(:title) or slug = LOWER(:slug)', {
          title: term,
          slug: term,
        })
        .getOne();
    }
    if (!product) throw new NotFoundException(`Product with ${term} not found`);
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException(
      'Unexpected error, check the server logs',
    );
  }
}
