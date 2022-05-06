import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
declare var noUiSlider: any;
declare var $: any;

@Component({
  selector: 'app-index-product',
  templateUrl: './index-product.component.html',
})
export class IndexProductComponent implements OnInit {
  public categories: any;
  public filter_category = '';
  public config_global: any = {};

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.list_categories();
    this.slider();
  }

  list_categories() {
    this.customerService
      .get_config_public()
      .subscribe(({ data: { categories } }) => (this.categories = categories));
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
