import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit {
  public id: any;
  public user: any = undefined;
  public user_lc: any = undefined;
  public categories: any;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {
    this.id = localStorage.getItem('id');
    if (this.id) {
      this.customerService.list_customer_by_id_invited(this.id).subscribe({
        next: (res) => {
          this.user = res.data;
          localStorage.setItem('user_data', JSON.stringify(this.user));
          if (localStorage.getItem('user_data')) {
            this.user_lc = JSON.parse(localStorage.getItem('user_data')!);
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

  ngOnInit(): void {
    this.list_categories();
  }

  list_categories() {
    this.customerService
      .get_config_public()
      .subscribe(({ data: { categories } }) => (this.categories = categories));
  }

  logout() {
    Swal.fire({
      text: '¿Quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        this.router.navigateByUrl('/');
        window.location.reload();
      }
    });
  }
}
