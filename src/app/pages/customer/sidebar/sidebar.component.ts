import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  public id: any;
  public user: any = undefined;
  public user_lc: any = undefined;

  constructor(private customerService: CustomerService) {
    this.id = customerService.id;
    if (this.id) {
      this.customerService.list_customer_by_id_invited(this.id).subscribe({
        next: (res) => {
          this.user = res.data;
          localStorage.setItem('public_user', JSON.stringify(this.user));
          if (localStorage.getItem('public_user')) {
            this.user_lc = JSON.parse(localStorage.getItem('public_user')!);
          } else {
            this.user_lc = undefined;
          }
        },
        error: (err) => {
          console.log(err);
          this.user = undefined;
        },
      });
    }
  }

  ngOnInit(): void {}
}
