import { Component, OnInit } from '@angular/core';
import { CheckoutService } from '../appServices/checkout.service';
import { AuthService } from '../appServices/auth.service';
import { ProductService } from '../appServices/product.service';
import { CheckoutItem } from '../appModels/checkoutItem.model';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  userId: any = '';
  loading: boolean = true;
  hasOrders: boolean = false;

  constructor(
    private _checkoutService: CheckoutService,
    private _authService: AuthService,
    private _productService: ProductService
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    console.log('User ID:', this.userId);
    this.fetchOrderHistory();
  }

  fetchOrderHistory() {
    this._checkoutService.getOrderHistory(this.userId).subscribe((res) => {
      console.log('Order-history response:=>', res)
        this.orders = Array.isArray(res.orders) ? res.orders.map((order: any) => ({
          _id: order._id,
          cartItems: order.cartItems,
          delivery: order.delivery,
          payment: order.payment,
          orderDate: order.createdAt,
        })):[];
      }, (err) => {
        console.error('Failed to fetch order history:', err);
      }, () => {
        this.loading = false;
      })
  }
}
