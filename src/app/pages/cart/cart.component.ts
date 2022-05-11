import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { PublicService } from 'src/app/services/public.service';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
var server = environment.server;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  public socket = io(server);
  public cart_items: Array<any> = [];
  public principal_address: any = {};
  public delivery: Array<any> = [];
  public price_delivery = 0;
  public subtotal = 0;
  public total = 0;

  constructor(
    private customerService: CustomerService,
    private publicService: PublicService
  ) {}

  ngOnInit(): void {
    this.init_data();
    this.principal_address_customer();
    this.data_delivery();
    this.publicService.init_payment_assets();
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
    this.subtotal = 0;
    this.cart_items.forEach((element) => {
      this.subtotal = this.subtotal + parseInt(element.product.price);
    });
    this.total = this.subtotal + this.price_delivery;
  }

  delete_item(id: any) {
    this.customerService.delete_item_cart(id).subscribe({
      next: (res) => {
        this.publicService.success('Se eliminó el producto del carrito.');
        this.socket.emit('delete-item-cart', { data: res.data });
        this.init_data();
      },
    });
  }

  principal_address_customer() {
    this.customerService
      .principal_address_customer(this.customerService.id)
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.principal_address = res.data;
          } else {
            this.principal_address = undefined;
          }
        },
      });
  }

  data_delivery() {
    this.publicService.get_delivery().subscribe({
      next: (res) => {
        this.delivery = res;
      },
    });
  }

  calculate_total() {
    this.total = this.subtotal + this.price_delivery;
  }
}
