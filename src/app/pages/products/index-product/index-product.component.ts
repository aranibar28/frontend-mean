import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
declare var noUiSlider: any;
declare var $: any;

@Component({
  selector: 'app-index-product',
  templateUrl: './index-product.component.html',
})
export class IndexProductComponent implements OnInit {
  public categories: Array<any> = [];
  public products: Array<any> = [];
  public filter_category = '';
  public filter_product = '';
  public load_data = true;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.list_categories();
    this.list_products();
    this.slider();
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
      },
    });
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

  search_product() {
    this.list_products();
  }

  slider() {
    var slider: any = document.getElementById('slider');
    noUiSlider.create(slider, {
      start: [0, 1000],
      connect: true,
      range: {
        min: 0,
        max: 1000,
      },
      tooltips: [true, true],
      pips: {
        mode: 'count',
        values: 5,
      },
    });
    slider.noUiSlider.on('update', function (values: any) {
      $('.cs-range-slider-value-min').val(values[0]);
      $('.cs-range-slider-value-max').val(values[1]);
    });
    $('.noUi-tooltip').css('font-size', '11px');
  }
}
