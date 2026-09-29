import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Product, ProductDocument } from './schemas/product.schema';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
  const categoryModel = app.get<Model<CategoryDocument>>(getModelToken(Category.name));
  const productModel = app.get<Model<ProductDocument>>(getModelToken(Product.name));

  console.log('🧹 Clearing existing database data...');
  await userModel.deleteMany({});
  await categoryModel.deleteMany({});
  await productModel.deleteMany({});

  console.log('👤 Creating initial users (Admin & Customer)...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  await userModel.create({
    name: 'Admin User',
    email: 'admin@shopflow.com',
    password: adminPassword,
    role: UserRole.ADMIN,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  });

  await userModel.create({
    name: 'John Doe',
    email: 'user@shopflow.com',
    password: userPassword,
    role: UserRole.USER,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  });

  console.log('🏷️ Creating categories...');
  const catElectronics = await categoryModel.create({
    name: 'Electronics',
    slug: 'electronics',
    description: 'Gadgets, audio, and smart devices',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
  });

  const catFashion = await categoryModel.create({
    name: 'Fashion',
    slug: 'fashion',
    description: 'Modern apparel & accessories',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=600',
  });

  const catHome = await categoryModel.create({
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Furniture and aesthetic interior decors',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600',
  });

  console.log('📦 Creating sample products...');
  await productModel.create([
    {
      name: 'Wireless Noise-Canceling Headphones',
      slug: 'wireless-noise-canceling-headphones',
      description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio fidelity.',
      price: 249.99,
      compareAtPrice: 299.99,
      category: catElectronics._id,
      stock: 45,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800',
      ],
      tags: ['audio', 'wireless', 'headphones', 'featured'],
      isFeatured: true,
      rating: 4.8,
      numReviews: 124,
    },
    {
      name: 'Smart Minimalist Watch',
      slug: 'smart-minimalist-watch',
      description: 'Sleek smart watch with heart rate tracking, AMOLED display, GPS tracking, and 7-day battery endurance.',
      price: 189.0,
      compareAtPrice: 219.0,
      category: catElectronics._id,
      stock: 30,
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
      ],
      tags: ['watch', 'smart', 'fitness'],
      isFeatured: true,
      rating: 4.6,
      numReviews: 89,
    },
    {
      name: 'Organic Cotton Oxford Shirt',
      slug: 'organic-cotton-oxford-shirt',
      description: 'Tailored fit oxford shirt made from 100% certified organic cotton. Soft, breathable, and versatile for any occasion.',
      price: 69.5,
      compareAtPrice: 85.0,
      category: catFashion._id,
      stock: 60,
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
      ],
      tags: ['shirt', 'fashion', 'cotton'],
      isFeatured: false,
      rating: 4.7,
      numReviews: 45,
    },
    {
      name: 'Ergonomic Ceramic Table Lamp',
      slug: 'ergonomic-ceramic-table-lamp',
      description: 'Handcrafted ceramic table lamp with warm ambient LED lighting and touch dimmer control.',
      price: 110.0,
      category: catHome._id,
      stock: 15,
      images: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
      ],
      tags: ['decor', 'lamp', 'home'],
      isFeatured: true,
      rating: 4.9,
      numReviews: 32,
    },
  ]);

  console.log('🎉 MongoDB Atlas Database Seeded Successfully!');
  console.log('-----------------------------------');
  console.log(`🔑 Admin Email: admin@shopflow.com | Password: admin123`);
  console.log(`🔑 User Email:  user@shopflow.com  | Password: user123`);
  console.log('-----------------------------------');

  await app.close();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
