import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { PublicService } from 'src/app/services/public.service';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import { Router } from '@angular/router';
var server = environment.server;
declare var paypal: any;

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  @ViewChild('paypalButton', { static: true }) paypalElement!: ElementRef;

  public socket = io(server);
  public principal_address: any = {};
  public cart_items: Array<any> = [];
  public delivery: Array<any> = [];
  public price_delivery = 0;
  public quantity = 0;
  public subtotal = 0;
  public total = 0;

  public sale: any = {};
  public detail: any = [];
  public id = this.publicService.id; // <-- id cliente
  public user = JSON.parse(this.publicService.user); // <- data cliente

  public load_data = true;
  public load_btn = false;
  public card_data: any = {};
  public message = '';
  public discount = 0;
  public active: any = undefined;

  constructor(
    private customerService: CustomerService,
    private publicService: PublicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.get_discount();
    this.init_data();
    // this.init_paypal();
    this.init_delivery();
    this.init_principal_address();
    this.publicService.init_payment_assets();
    this.sale.customer = this.id;
  }

  init_data() {
    this.customerService.get_cart_customer(this.publicService.id).subscribe({
      next: (res) => {
        this.cart_items = res.data;
        this.cart_items.forEach((element) => {
          this.detail.push({
            customer: this.id,
            product: element.product._id,
            subtotal: element.product.price,
            quantity: element.quantity,
            variety: element.variety,
          });
        });
        this.load_data = false;
        this.calculate_cart();
        this.calculate_total('Envío Gratis');
      },
    });
  }

  get_discount() {
    this.publicService.get_discount_active().subscribe({
      next: (res) => (this.active = res ? res.data[0] : undefined),
    });
  }

  calculate_cart() {
    this.subtotal = 0;
    if (!this.active) {
      this.cart_items.forEach((e) => {
        this.quantity = e.quantity;
        this.subtotal = this.subtotal + e.product.price * e.quantity;
      });
    } else {
      this.cart_items.forEach((e) => {
        this.quantity = e.quantity;
        let new_price = e.product.price * (1 - this.active.discount / 100);
        this.subtotal = this.subtotal + new_price * e.quantity;
      });
    }
  }

  calculate_total(title_delivery: any) {
    this.total = this.subtotal + this.price_delivery;
    this.sale.subtotal = this.total;
    this.sale.title_delivery = title_delivery;
    this.sale.price_delivery = this.price_delivery;
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

  // !CODE FIJO: SEPTEMBER2022
  // !CODE PORCENTUAL: MAYO2029
  validate_coupon() {
    if (this.sale.coupon) {
      if (this.sale.coupon.toString().length <= 25) {
        this.message = '';
        this.customerService
          .validate_coupon_public(this.sale.coupon)
          .subscribe({
            next: (res) => {
              if (res.data) {
                this.message = '';
                if (res.data.type == 'Valor Fijo') {
                  this.discount = res.data.value;
                  this.total = this.total - this.discount;
                } else if (res.data.type == 'Porcentaje') {
                  this.discount = (this.total * res.data.value) / 100;
                  this.total = this.total - this.discount;
                }
              } else {
                this.message = 'El cupón no se pudo canjear.';
              }
            },
          });
      } else {
        this.message = 'El cupón debe tener menos de 25 carácteres.';
      }
    } else {
      this.message = 'El cupón no es válido.';
    }
  }

  init_delivery() {
    this.publicService.get_delivery().subscribe({
      next: (res) => {
        this.delivery = res;
      },
    });
  }

  init_principal_address() {
    this.customerService
      .principal_address_customer(this.customerService.id)
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.principal_address = res.data;
            this.sale.address = this.principal_address._id;
          } else {
            this.principal_address = undefined;
          }
        },
      });
  }

  init_paypal() {
    paypal
      .Buttons({
        style: { layout: 'horizontal' },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                description: 'Pago mi Tienda',
                amount: {
                  currency_code: 'USD',
                  value: this.subtotal,
                },
              },
            ],
          });
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();
          const order_id = order.purchase_units[0].payments.captures[0].id;
          this.sale.transaction = order_id;
          this.sale.details = this.detail;
          this.customerService.register_sale_customer(this.sale).subscribe({
            next: (res) => {
              this.customerService
                .send_email_sale_customer(res.sale._id)
                .subscribe({
                  next: (res) => {
                    this.router.navigateByUrl('/');
                    this.socket.emit('delete-item-cart', { data: res.data });
                    this.publicService.success('Compra Exitosa con Paypal');
                  },
                });
            },
            error: (err) => {
              console.log(err);
            },
          });
        },
        onError: (err: any) => {},
        onCancel: function (data: any, actions: any) {},
      })
      .render(this.paypalElement.nativeElement);
  }

  init_culqi() {
    let expiration = this.card_data.exp.toString().split('/');

    let data = {
      card_number: this.card_data.ncard.toString().replace(/ /g, ''),
      cvv: this.card_data.cvc,
      expiration_month: expiration[0],
      expiration_year: expiration[1].substr(0, 4),
      email: this.user.email,
    };

    this.load_btn = true;

    this.customerService.get_token_culqi(data).subscribe({
      next: (res) => {
        let charge = {
          amount: this.subtotal + '00',
          currency_code: 'PEN',
          email: this.user.email,
          source_id: res.id,
        };

        this.customerService.get_charge_culqi(charge).subscribe({
          next: (res) => {
            this.sale.transaction = res.id;
            this.sale.details = this.detail;
            this.customerService.register_sale_customer(this.sale).subscribe({
              next: (res) => {
                this.customerService
                  .send_email_sale_customer(res.sale._id)
                  .subscribe({
                    next: () => {
                      this.router.navigateByUrl('/');
                    },
                  });
                this.load_btn = false;
                this.socket.emit('delete-item-cart', { data: res.data });
                this.publicService.success('Compra Exitosa con Culqi');
              },
            });
          },
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
