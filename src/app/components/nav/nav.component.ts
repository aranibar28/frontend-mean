import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { PublicService } from 'src/app/services/public.service';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';
var server = environment.server;
declare var $: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit {
  public socket = io(server);
  public id: any;
  public user: any = undefined;
  public public_user: any = undefined;
  public categories: any;
  public op_cart = false;
  public discount: any = undefined;

  public cart_items: Array<any> = [];
  public subtotal = 0;

  constructor(
    private publicService: PublicService,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.get_discount_active();
    this.list_categories();
    this.list_customer_by_id();
    this.socket.on('new-login', this.list_customer_by_id.bind(this)); // login
    this.socket.on('new-item-cart', this.get_cart_customer.bind(this)); // agregar
    this.socket.on('update-item-cart', this.get_cart_customer.bind(this)); // eliminar
  }

  list_customer_by_id() {
    this.id = this.customerService.id;
    if (this.id) {
      this.customerService.list_customer_by_id_invited(this.id).subscribe({
        next: (res) => {
          this.user = res.data;
          localStorage.setItem('public_user', JSON.stringify(this.user));
          if (this.publicService.user) {
            this.public_user = JSON.parse(localStorage.getItem('public_user')!);
            this.get_cart_customer();
          } else {
            this.public_user = undefined;
          }
        },
        error: (err) => {
          console.log(err);
          this.user = undefined;
        },
      });
    }
  }

  list_categories() {
    this.customerService
      .list_categories_public()
      .subscribe(({ data: { categories } }) => (this.categories = categories));
  }

  get_cart_customer() {
    this.customerService.get_cart_customer(this.public_user._id).subscribe({
      next: (res) => {
        this.cart_items = res.data;
        this.calculate_cart();
      },
    });
  }

  get_discount_active() {
    this.publicService.get_discount_active().subscribe({
      next: (res) => (this.discount = res ? res.data[0] : undefined),
    });
  }

  calculate_cart() {
    this.subtotal = 0;
    if (!this.discount) {
      this.cart_items.forEach((e) => {
        this.subtotal = this.subtotal + e.product.price;
      });
    } else {
      this.cart_items.forEach((e) => {
        let new_price = e.product.price * (1 - this.discount.discount / 100);
        this.subtotal = this.subtotal + new_price * e.quantity;
      });
    }
  }

  delete_item(id: any) {
    this.customerService.delete_item_cart(id).subscribe({
      next: (res) => {
        this.publicService.success('Se eliminó el producto del carrito.');
        this.socket.emit('delete-item-cart', { data: res.data });
      },
    });
  }

  show_modal_cart() {
    if (!this.op_cart) {
      this.op_cart = true;
      $('#cart').addClass('show');
    } else {
      this.op_cart = false;
      $('#cart').removeClass('show');
    }
  }

  logout() {
    Swal.fire({
      text: '¿Quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        this.router.navigateByUrl('/');
        window.location.reload();
      }
    });
  }
}
