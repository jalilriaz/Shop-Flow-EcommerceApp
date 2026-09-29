import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole, UserDocument } from '../schemas/user.schema.js';
import { OrderStatus } from '../schemas/order.schema.js';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Request() req: { user: UserDocument }, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user._id.toString(), createOrderDto);
  }

  @Get('my-orders')
  async findMyOrders(@Request() req: { user: UserDocument }) {
    return this.ordersService.findMyOrders(req.user._id.toString());
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAllAdmin(@Query('status') status?: OrderStatus) {
    return this.ordersService.findAllAdmin(status);
  }

  @Get(':id')
  async findById(@Request() req: { user: UserDocument }, @Param('id') id: string) {
    const isAdmin = req.user.role === UserRole.ADMIN;
    return this.ordersService.findById(id, req.user._id.toString(), isAdmin);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateStatus(@Param('id') id: string, @Body() updateDto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, updateDto);
  }
}
