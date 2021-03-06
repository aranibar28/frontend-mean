import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
var server = environment.server;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  public user: any = {};
  public customer: any = {};
  public token: any;
  public name: any;
  public socket = io(server);

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {
    this.token = this.customerService.token;
    if (this.token) {
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit(): void {}

  login(loginForm: any) {
    if (loginForm.valid) {
      let data = {
        email: this.user.email,
        password: this.user.password,
      };

      this.customerService.login_customer_invited(data).subscribe({
        next: (res) => {
          this.socket.emit('login', { data: res.data });
          this.customer = res.data;
          localStorage.setItem('public_token', res.token);
          localStorage.setItem('public_id', res.data._id);
          this.router.navigateByUrl('/');
          Swal.fire({
            icon: 'success',
            title: `Bienvenido ${res.data.first_name}!!`,
            showConfirmButton: false,
            timer: 1500,
          });
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
