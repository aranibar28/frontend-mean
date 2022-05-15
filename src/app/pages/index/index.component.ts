import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { ProductsService } from 'src/app/services/products.service';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
  public discounts: any = undefined;
  public categories: Array<any> = [];
  public new_products: Array<any> = [];
  public sales_products: Array<any> = [];

  constructor(
    private publicService: PublicService,
    private productsService: ProductsService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.publicService.init_menu();
    this.get_discount();
    this.get_categories();
    this.get_new_products();
    this.get_sales_products();
  }

  get_discount() {
    this.publicService.get_discount_active().subscribe({
      next: (res) => {
        this.discounts = res ? res.data[0] : undefined;
      },
    });
  }

  get_categories() {
    this.customerService.list_categories_public().subscribe(({ data }) => {
      this.categories = data;
    });
  }

  get_new_products() {
    this.productsService.list_product_news().subscribe(({ data }) => {
      this.new_products = data;
    });
  }

  get_sales_products() {
    this.productsService.list_product_sales().subscribe(({ data }) => {
      this.sales_products = data;
    });
  }
}
