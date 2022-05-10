import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { PublicService } from 'src/app/services/public.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
var server = environment.server;
declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  public id = this.publicService.id; // <-- id cliente
  public email_regx = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  public socket = io(server);
  public customer: any = {};

  constructor(
    private publicService: PublicService,
    private customerService: CustomerService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.id) {
      this.init_data();
    }
  }

  myForm: FormGroup = this.fb.group({
    first_name: [, [Validators.required, Validators.minLength(3)]],
    last_name: [, [Validators.required, Validators.minLength(3)]],
    email: [, [Validators.required, Validators.pattern(this.email_regx)]],
    password: [, []],
    phone: [, [Validators.required, Validators.pattern('[9][0-9]{8}')]],
    dni: [, [Validators.required, Validators.pattern('[0-9]{8}')]],
    birthday: [, []],
    gender: ['', []],
    country: ['', []],
  });

  init_data() {
    this.customerService.list_customer_by_id_invited(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.customer = res.data;
          this.myForm.patchValue(this.customer);
        } else {
          this.router.navigateByUrl('/');
        }
      },
      error: (err) => console.log(err),
    });
  }

  update() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    if ($('#input_password').val() == '') {
      this.myForm.controls['password'].setValue(this.customer.password);
    } else {
      this.myForm.controls['password'].setValue($('#input_password').val());
      $('#input_password').val('');
    }

    this.customerService
      .update_customer_invited(this.id, this.myForm.value)
      .subscribe({
        next: () => {
          this.socket.emit('login', { data: this.myForm.value });
          Swal.fire('Muy Bien!', 'Datos guardados correctamente', 'success');
        },
        error: (err) => {
          Swal.fire('Ups!', err.error.msg, 'error');
        },
      });
  }

  validate(name: string, status: boolean) {
    const input = this.myForm.controls[name];
    return status ? input.errors && input.touched : input.valid;
  }
}
