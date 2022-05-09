import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  public cart_items: Array<any> = [];
  public subtotal = 0;
  public total = 0;

  constructor(
    private customerService: CustomerService,
    private publicService: PublicService
  ) {}

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this.customerService.get_cart_customer(this.publicService.id).subscribe({
      next: (res) => {
        this.cart_items = res.data;
        this.calculate_cart();
      },
    });
  }

  calculate_cart() {
    this.cart_items.forEach((element) => {
      this.subtotal = this.subtotal + parseInt(element.product.price);
    });
    this.total = this.subtotal;
  }
}
