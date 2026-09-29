import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from '../schemas/order.schema.js';
import { Product, ProductDocument } from '../schemas/product.schema.js';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { orderItems, shippingAddress, paymentMethod } = createOrderDto;

    if (!orderItems || orderItems.length === 0) {
      throw new BadRequestException('Order items cannot be empty');
    }

    // Verify stock and calculate total price on server side
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of orderItems) {
      const dbProduct = await this.productModel.findById(item.product);
      if (!dbProduct) {
        throw new NotFoundException(`Product ${item.name} not found`);
      }
      if (dbProduct.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product '${dbProduct.name}'`);
      }

      calculatedTotal += dbProduct.price * item.quantity;
      validatedItems.push({
        product: new Types.ObjectId(item.product),
        name: dbProduct.name,
        image: dbProduct.images[0] || item.image,
        quantity: item.quantity,
        price: dbProduct.price,
      });

      // Decrement product stock
      dbProduct.stock -= item.quantity;
      await dbProduct.save();
    }

    const order = await this.orderModel.create({
      user: new Types.ObjectId(userId),
      orderItems: validatedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      totalPrice: calculatedTotal,
      status: OrderStatus.PENDING,
    });

    return order;
  }

  async findMyOrders(userId: string) {
    return this.orderModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string, userId: string, isAdmin: boolean) {
    const order = await this.orderModel
      .findById(id)
      .populate('user', 'name email')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID '${id}' not found`);
    }

    if (!isAdmin && order.user._id.toString() !== userId) {
      throw new NotFoundException(`Order not accessible`);
    }

    return order;
  }

  async findAllAdmin(status?: OrderStatus) {
    const filter = status ? { status } : {};
    return this.orderModel
      .find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateStatus(id: string, updateDto: UpdateOrderStatusDto) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID '${id}' not found`);
    }

    order.status = updateDto.status;
    if (updateDto.status === OrderStatus.DELIVERED) {
      order.isPaid = true;
      order.paidAt = new Date();
    }

    await order.save();
    return order;
  }
}
