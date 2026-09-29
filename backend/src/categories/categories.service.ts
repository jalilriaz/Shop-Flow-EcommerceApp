import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll() {
    return this.categoryModel.find().exec();
  }

  async findBySlug(slug: string) {
    const category = await this.categoryModel.findOne({ slug }).exec();
    if (!category) {
      throw new NotFoundException(`Category with slug '${slug}' not found`);
    }
    return category;
  }

  async create(createCategoryDto: { name: string; description?: string; image?: string }) {
    const slug = createCategoryDto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const existing = await this.categoryModel.findOne({ slug });
    if (existing) {
      throw new ConflictException('Category with this name already exists');
    }
    return this.categoryModel.create({
      ...createCategoryDto,
      slug,
    });
  }
}
