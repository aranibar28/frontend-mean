import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  public user: any = {};
  public customer: any = {};
  public token: any;
  public name: any;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {
    this.token = this.customerService.token;
    if (this.token) {
      this.router.navigateByUrl('/');
    }
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  ngOnInit(): void {}

  login(loginForm: any) {
    if (loginForm.valid) {
      let data = {
        email: this.user.email,
        password: this.user.password,
      };

      this.customerService.login_customer(data).subscribe({
        next: (res) => {
          this.customer = res.data;
          localStorage.setItem('token', res.token);
          localStorage.setItem('id', res.data._id);

          this.router.navigateByUrl('/');
        },
        error: (err) => {
          Swal.fire('Ups!', err.error.msg, 'error');
        },
      });
    } else {
      Swal.fire('Ups!', 'Los datos del formulario no son válidos', 'error');
    }
  }
}
