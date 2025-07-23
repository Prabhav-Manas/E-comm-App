import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/appModels/product-data.model';
import { AuthService } from 'src/app/appServices/auth.service';
import { CartService } from 'src/app/appServices/cart.service';
import { LoaderService } from 'src/app/appServices/loader.service';
import { ProductService } from 'src/app/appServices/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;
  quantity: number = 1;
  itemAlreadyInCart: boolean = false;
  cartItemId = '';

  constructor(private _authService:AuthService, private _productService: ProductService, private _cartService: CartService, private route: ActivatedRoute, private router: Router, private _loaderService:LoaderService) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this._authService.showLoader()
    if (productId) {
      this.fetchProductDetails(productId);
      this.checkIfItemInCart(productId);
      this._authService.hideLoader()
    }
    console.log('Product ID:=>', productId);
  }

  fetchProductDetails(id: string) {
    this._productService.getProductById(id).subscribe((data: any) => {
      this._authService.showLoader()
      this.product = data.product;
      console.log(this.product);
      this._authService.hideLoader()
    },(error) => {
      this._authService.hideLoader()
      console.log('Error fetching product details', error);
    });
  }

  onAddToCart() {
    this._cartService.addToCart(this.product._id, this.quantity).subscribe((res) => {
      if (res) {
        alert('Item added in cart');
        this.router.navigate(['/shopping-cart']);
        console.log(res);
      } else {
        alert('Product already exist in your cart.');
        this.itemAlreadyInCart = true;
      }
    },(error) => {
      console.log(error);
    });
  }

  onRemoveFromCart() {
    this._cartService.removeCartItem(this.cartItemId).subscribe((removeItem) => {
      console.log('Item removed!');
      this.itemAlreadyInCart = false;
    },(error) => {
      console.log('Error in removing cart item');
    });
  }

  checkIfItemInCart(productId: string) {
    this._cartService.getAllCartItems().subscribe((cartData) => {
      console.log('CartItems', cartData.cartItems);
      const cartItem = cartData.cartItems.find((item: any) => item.product._id === productId);

      if (cartItem) {
        this.itemAlreadyInCart = true;
        this.cartItemId = cartItem._id;
      }
    });
  }
}
