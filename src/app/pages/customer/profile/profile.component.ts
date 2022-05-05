import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import Swal from 'sweetalert2';
declare var $ :any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  public email_regx = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  public customer: any = {};
  public id: any;

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.id = localStorage.getItem('id');
    if (this.id) {
      this.init_data();
    }
  }

  ngOnInit(): void {}

  myForm: FormGroup = this.fb.group({
    first_name: [, [Validators.required, Validators.minLength(3)]],
    last_name:  [, [Validators.required, Validators.minLength(3)]],
    email:      [, [Validators.required, Validators.pattern(this.email_regx)]],
    password:   [, []],
    phone:      [, [Validators.required, Validators.pattern('[9][0-9]{8}')]],
    dni:        [, [Validators.required, Validators.pattern('[0-9]{8}')]],
    birthday:   [, []],
    gender:     ['', []],
    country:    ['', []],
  });

  init_data() {
    this.customerService.list_customer_by_id_invited(this.id).subscribe({
      next: (res) => {
        if (res.data != undefined) {
          this.customer = res.data;
          const { first_name, last_name, email, password, phone, dni, birthday, gender, country } = this.customer;
          this.myForm.patchValue({
            first_name,
            last_name,
            email,
            password,
            phone,
            dni,
            birthday,
            gender,
            country
          });
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
    this.customerService
      .update_customer_invited(this.id, this.myForm.value)
      .subscribe({
        next: () => {
          console.log(this.myForm.value);
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
