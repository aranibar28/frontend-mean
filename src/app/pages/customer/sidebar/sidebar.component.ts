import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  public id = this.customerService.id;
  public user: any = undefined;
  public user_lc: any = undefined;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {
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
