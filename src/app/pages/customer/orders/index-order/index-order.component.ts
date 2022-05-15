import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-index-order',
  templateUrl: './index-order.component.html',
})
export class IndexOrderComponent implements OnInit {
  public id = this.publicService.id; // <-- id cliente
  public orders: Array<any> = [];
  public load_data = true;
  public p: number = 1;

  constructor(
    private customerService: CustomerService,
    private publicService: PublicService
  ) {}

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this.customerService.read_orders_customer(this.id).subscribe({
      next: (res) => {
        this.load_data = false;
        this.orders = res.data;
      },
    });
  }
}
