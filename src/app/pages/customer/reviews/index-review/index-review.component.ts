import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-index-review',
  templateUrl: './index-review.component.html',
})
export class IndexReviewComponent implements OnInit {
  public id = this.publicService.id; // <-- id cliente
  public reviews: Array<any> = [];
  public load_data = true;
  public p: number = 1;

  constructor(
    private publicService: PublicService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this.customerService.read_review_customer(this.id).subscribe({
      next: (res) => {
        this.reviews = res.data;
        this.load_data = false;
      },
    });
  }
}
