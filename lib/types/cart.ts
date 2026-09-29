export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  stock: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}
