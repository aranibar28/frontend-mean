import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { CustomerService } from 'src/app/services/customer.service';
import { PublicService } from 'src/app/services/public.service';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
var server = environment.server;

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
})
export class DetailProductComponent implements OnInit {
  public socket = io(server);
  public products_recomended: Array<any> = [];
  public product: any = {};
  public slug: any;

  public cart_data: any = { variety: '', quantity: 1 };
  public load_btn = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private productsService: ProductsService,
    private publicService: PublicService
  ) {}

  ngOnInit(): void {
    this.list_product_by_slug();
    setTimeout(() => {
      this.publicService.init_carousel_assets();
    }, 500);
  }

  list_product_by_slug() {
    this.activatedRoute.params.subscribe(({ slug }) => {
      this.slug = slug;
      this.productsService.list_product_by_slug(this.slug).subscribe({
        next: (res) => {
          this.product = res.data;
          this.productsService
            .list_product_recomended(this.product.category)
            .subscribe({
              next: (res) => {
                this.products_recomended = res.data;
              },
            });
        },
      });
    });
  }

  add_product() {
    if (this.cart_data.variety) {
      if (this.cart_data.quantity <= this.product.stock) {
        let data = {
          product: this.product._id,
          customer: localStorage.getItem('public_id'),
          quantity: this.cart_data.quantity,
          variety: this.cart_data.variety,
        };
        this.load_btn = true;
        this.customerService.add_cart_customer(data).subscribe({
          next: (res) => {
            if (res.data == undefined) {
              this.load_btn = false;
              this.publicService.danger('El producto ya existe en el carrito.');
            } else {
              this.load_btn = false;
              this.publicService.success('Se agegró el producto al carrito.');
              this.socket.emit('insert-item-cart', { data: true });
            }
          },
        });
      } else {
        const msg = 'La máxima cantidad disponible es ' + this.product.stock;
        this.publicService.danger(msg);
      }
    } else {
      const msg = 'Porfavor, seleccione una variedad del producto.';
      this.publicService.danger(msg);
    }
  }
}
