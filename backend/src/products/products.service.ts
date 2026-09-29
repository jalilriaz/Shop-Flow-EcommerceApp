import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(query: { search?: string; category?: string; featured?: boolean; sort?: string; page?: number; limit?: number }) {
    const filter: any = {};

    if (query.search) {
      filter.$text = { $search: query.search };
    }

    if (query.category) {
      filter.category = query.category;
    }

    if (query.featured !== undefined) {
      filter.isFeatured = String(query.featured) === 'true';
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const skip = (page - 1) * limit;

    let sortOption: any = { createdAt: -1 };
    if (query.sort === 'price-asc') sortOption = { price: 1 };
    if (query.sort === 'price-desc') sortOption = { price: -1 };
    if (query.sort === 'rating') sortOption = { rating: -1 };

    const [products, total] = await Promise.all([
      this.productModel.find(filter).populate('category', 'name slug').sort(sortOption).skip(skip).limit(limit).exec(),
      this.productModel.countDocuments(filter),
    ]);

    return {
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findBySlug(slug: string) {
    const product = await this.productModel.findOne({ slug }).populate('category', 'name slug').exec();
    if (!product) {
      throw new NotFoundException(`Product with slug '${slug}' not found`);
    }
    return product;
  }

  async findById(id: string) {
    const product = await this.productModel.findById(id).populate('category', 'name slug').exec();
    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const slug = createProductDto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const existing = await this.productModel.findOne({ slug });
    if (existing) {
      throw new ConflictException('Product with this name/slug already exists');
    }

    return this.productModel.create({
      ...createProductDto,
      slug,
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const slug = updateProductDto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      (updateProductDto as any).slug = slug;
    }

    return this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).populate('category', 'name slug').exec();
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }
    return { message: 'Product deleted successfully' };
  }
}
