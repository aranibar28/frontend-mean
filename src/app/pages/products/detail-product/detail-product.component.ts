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
  public reviews: Array<any> = [];
  public discount: any = undefined;
  public product: any = {};
  public slug: any;
  public p: number = 1;

  public five_percent = 0;
  public fourth_percent = 0;
  public three_percent = 0;
  public two_percent = 0;
  public one_percent = 0;

  public five_stars = 0;
  public fourth_stars = 0;
  public three_stars = 0;
  public two_stars = 0;
  public one_stars = 0;

  public total_points = 0;
  public max_points = 0;
  public porcent_rating = 0;
  public points_rating = 0;

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

    this.publicService.get_discount_active().subscribe({
      next: (res) => {
        if (res.data) {
          this.discount = res.data[0];
        } else {
          this.discount = undefined;
        }
      },
    });
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
          this.publicService.list_reviews_public(this.product._id).subscribe({
            next: (res) => {
              res.data.forEach((element: any) => {
                if (element.starts == 5) {
                  this.five_stars = this.five_stars + 1;
                } else if (element.starts == 4) {
                  this.fourth_stars = this.fourth_stars + 1;
                } else if (element.stars == 3) {
                  this.three_stars = this.three_stars + 1;
                } else if (element.starts == 2) {
                  this.two_stars = this.two_stars + 1;
                } else if (element.starts == 1) {
                  this.one_stars = this.one_stars + 1;
                }
                this.five_percent = (this.five_stars * 100) / res.data.length;
                this.fourth_percent = (this.fourth_stars * 100) / res.data.length;
                this.three_percent = (this.three_stars * 100) / res.data.length;
                this.two_percent = (this.two_stars * 100) / res.data.length;
                this.one_percent = (this.one_stars * 100) / res.data.length;

                let five_points = 0;
                let fourth_points = 0;
                let three_points = 0;
                let two_points = 0;
                let one_points = 0;

                five_points = this.five_stars * 5;
                fourth_points = this.fourth_stars * 4;
                three_points = this.three_stars * 3;
                two_points = this.two_stars * 2;
                one_points = this.one_stars * 1;

                this.total_points = five_points + fourth_points + three_points + two_points + one_points;
                this.max_points = res.data.length * 5;
                this.porcent_rating = (this.total_points * 100) / this.max_points;
                this.points_rating = (this.porcent_rating * 5) / 100;                
              });
              this.reviews = res.data;
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
