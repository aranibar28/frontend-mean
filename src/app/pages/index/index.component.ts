import { Component, OnInit } from '@angular/core';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
  public discounts: any = undefined;

  constructor(private publicService: PublicService) {}

  ngOnInit(): void {
    this.publicService.init_menu();
    this.get_discount();
  }

  get_discount() {
    this.publicService.get_discount_active().subscribe({
      next: (res) => {
        this.discounts = res ? res.data[0] : undefined;
      },
    });
  }
}
