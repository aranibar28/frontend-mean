import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { PublicService } from 'src/app/services/public.service';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
var server = environment.server;
declare var $: any;

@Component({
  selector: 'app-index-product',
  templateUrl: './index-product.component.html',
})
export class IndexProductComponent implements OnInit {
  public categories: Array<any> = [];
  public products: Array<any> = [];
  public products_count: Array<any> = [];
  public params_category: any;
  public cart_data: any = { variety: '', quantity: 1 };
  public discount: any = undefined;

  public filter_category = '';
  public filter_product = '';
  public filter_cat_pro = 'all';

  public socket = io(server);
  public load_data = true;
  public load_btn = false;
  public sort_by = 'default';
  public size: number = 9;
  public p: number = 1;

  constructor(
    private customerService: CustomerService,
    private publicService: PublicService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.list_products_by_params();
    this.list_categories();
    this.publicService.slider();
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

  list_products_by_params() {
    this.activatedRoute.params.subscribe(({ category }) => {
      this.params_category = category;
      if (this.params_category) {
        this.customerService.list_products_public('').subscribe({
          next: (res) => {
            this.load_data = false;
            this.products = res.data;
            this.products = this.products.filter(
              (item) => item.category.toLowerCase() === this.params_category
            );
          },
        });
      } else {
        this.list_products();
      }
    });
  }

  list_categories() {
    this.customerService
      .list_categories_public()
      .subscribe(({ data: { categories } }) => (this.categories = categories));
  }

  list_products() {
    this.customerService.list_products_public(this.filter_product).subscribe({
      next: (res) => {
        this.products = res.data;
        this.load_data = false;
        this.filter_cat_pro = 'all';
        this.p = 1;
      },
      error: (err) => {
        console.log(err);
        this.load_data = true;
      },
    });
  }

  reset_products() {
    this.filter_product = '';
    this.filter_cat_pro = 'all';
    this.customerService.list_products_public('').subscribe({
      next: (res) => {
        this.products = res.data;
        this.load_data = false;
      },
    });
  }

  reset_page() {
    this.p = 1;
  }

  search_category() {
    if (this.filter_category) {
      var search = new RegExp(this.filter_category, 'i');
      this.categories = this.categories.filter((item: any) =>
        search.test(item.name)
      );
    } else {
      this.list_categories();
    }
  }

  search_price() {
    this.p = 1;
    this.filter_cat_pro = 'all';
    this.customerService.list_products_public(this.filter_product).subscribe({
      next: (res) => {
        this.products = res.data;
        let min = parseInt($('.cs-range-slider-value-min').val());
        let max = parseInt($('.cs-range-slider-value-max').val());
        this.products = this.products.filter((item: any) => {
          return item.price >= min && item.price <= max;
        });
      },
    });
  }

  search_by_category() {
    this.p = 1;
    if (this.filter_cat_pro == 'all') {
      this.list_products();
      this.load_data = false;
    } else {
      this.customerService.list_products_public(this.filter_product).subscribe({
        next: (res) => {
          this.products = res.data;
          this.products = this.products.filter(
            (item) => item.category == this.filter_cat_pro
          );
          this.load_data = false;
        },
      });
    }
  }

  //TO DO FIX LENGTH VARIETY IF NOT EXIST
  add_product(product: any) {
    let data = {
      product: product._id,
      customer: localStorage.getItem('public_id'),
      quantity: 1,
      variety: product.item_variety[0].name || '',
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
        }
        this.socket.emit('insert-item-cart', { data: true });
      },
    });
  }

  order_by() {
    if (this.sort_by == 'default') {
      this.customerService.list_products_public('').subscribe({
        next: (res) => {
          this.products = res.data;
          this.load_data = false;
        },
      });
    } else if (this.sort_by == 'popularity') {
      this.products.sort((a: any, b: any) => {
        if (a.num_sales < b.num_sales) {
          return 1;
        }
        if (a.num_sales > b.num_sales) {
          return -1;
        }
        return 0;
      });
    } else if (this.sort_by == 'max_min') {
      this.products.sort((a: any, b: any) => {
        if (a.price < b.price) {
          return 1;
        }
        if (a.price > b.price) {
          return -1;
        }
        return 0;
      });
    } else if (this.sort_by == 'min_max') {
      this.products.sort((a: any, b: any) => {
        if (a.price > b.price) {
          return 1;
        }
        if (a.price < b.price) {
          return -1;
        }
        return 0;
      });
    } else if (this.sort_by == 'az_title') {
      this.products.sort((a: any, b: any) => {
        if (a.title > b.title) {
          return 1;
        }
        if (a.title < b.title) {
          return -1;
        }
        return 0;
      });
    } else if (this.sort_by == 'za_title') {
      this.products.sort((a: any, b: any) => {
        if (a.title < b.title) {
          return 1;
        }
        if (a.title > b.title) {
          return -1;
        }
        return 0;
      });
    }
  }
}
