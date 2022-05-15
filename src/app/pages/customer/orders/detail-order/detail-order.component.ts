import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
})
export class DetailOrderComponent implements OnInit {
  public id: any;
  public order: any = {};
  public details: Array<any> = [];
  public load_data = true;
  public p: number = 1;

  constructor(
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => (this.id = id));
    this.init_data();
  }

  init_data() {
    this.customerService.read_orders_by_id(this.id).subscribe({
      next: (res) => {
        if (res) {
          this.load_data = false;
          this.order = res.data;
          this.details = res.details;
          console.log(res);
        } else {
          this.router.navigateByUrl('/cuenta/ordenes');
        }
      },
    });
  }
}
