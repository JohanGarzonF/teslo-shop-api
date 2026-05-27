import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './productImage.entity';
import { User } from 'src/auth/entities/auth.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Product title',
    example: 'Nike Air Max',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    description: 'Product price',
    example: 100,
    default: 0,
  })
  @Column('numeric', {
    default: 0,
  })
  price: number;

  @ApiProperty({
    description: 'Product description',
    example: 'Nike Air Max description',
    nullable: true,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    description: 'Product slug',
    example: 'nike-air-max',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  slug: string;

  @ApiProperty({
    description: 'Product stock',
    example: 10,
    default: 0,
  })
  @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty({
    description: 'Product sizes',
    example: ['S', 'M', 'L'],
    type: [String],
  })
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    description: 'Product gender',
    example: 'men',
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    description: 'Product tags',
    example: ['tag1', 'tag2'],
    type: [String],
    default: [],
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  // images
  @ApiProperty({
    description: 'Product images',
    example: ['image1.jpg', 'image2.jpg'],
    type: [String],
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true, // this load every relation
  })
  images?: ProductImage[];

  @ApiProperty({
    description: 'Product user',
    example: 'user123',
  })
  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replace("'", '')
      .replace('-', '_');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replace("'", '')
      .replace('-', '_');
  }
}
