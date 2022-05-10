import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { PublicService } from 'src/app/services/public.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
})
export class AddressComponent implements OnInit {
  public regions: Array<any> = [];
  public provinces: Array<any> = [];
  public districts: Array<any> = [];
  public address: Array<any> = [];
  public load_data: boolean = true;
  public id = this.publicService.id; // <-- id cliente

  public regions_arr: Array<any> = [];
  public provinces_arr: Array<any> = [];
  public districts_arr: Array<any> = [];

  constructor(
    private publicService: PublicService,
    private customerService: CustomerService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.init_ubigeo();
    this.list_address();
  }

  myForm: FormGroup = this.fb.group({
    customer: [this.id],
    receiver: [, [Validators.required, Validators.minLength(3)]],
    dni: [, [Validators.required, Validators.pattern('[0-9]{8}')]],
    address: [, [Validators.required, Validators.minLength(3)]],
    zip: [, [Validators.required, Validators.pattern('[0-9]{1,5}')]],
    phone: [, [Validators.required, Validators.pattern('[9][0-9]{8}')]],
    country: [null, [Validators.required, Validators.minLength(3)]],
    region: [{ value: null, disabled: true }],
    province: [{ value: null, disabled: true }],
    district: [{ value: null, disabled: true }],
    principal: [false],
  });

  select_country() {
    const country = this.myForm.controls['country'].value;
    if (country == 'Perú') {
      this.myForm.controls['region'].enable();
      this.publicService.get_region().subscribe({
        next: (res) => {
          res.forEach((element: any) => {
            this.regions.push(element);
          });
        },
      });
    } else {
      this.myForm.controls['region'].reset();
      this.myForm.controls['region'].disable();
      this.myForm.controls['province'].reset();
      this.myForm.controls['province'].disable();
      this.myForm.controls['district'].reset();
      this.myForm.controls['district'].disable();
    }
  }

  select_region() {
    this.provinces = [];
    this.myForm.controls['province'].reset();
    this.myForm.controls['province'].enable();
    this.myForm.controls['district'].disable();
    this.myForm.controls['district'].reset();
    const region = this.myForm.controls['region'].value;
    this.publicService.get_province().subscribe({
      next: (res) => {
        res.forEach((element: any) => {
          if (element.department_id == region) {
            this.provinces.push(element);
          }
        });
      },
    });
  }

  select_province() {
    this.districts = [];
    this.myForm.controls['district'].reset();
    this.myForm.controls['district'].enable();
    const province = this.myForm.controls['province'].value;
    this.publicService.get_district().subscribe({
      next: (res) => {
        res.forEach((element: any) => {
          if (element.province_id == province) {
            this.districts.push(element);
          }
        });
      },
    });
  }

  init_ubigeo() {
    combineLatest([
      this.publicService.get_region(),
      this.publicService.get_province(),
      this.publicService.get_district(),
    ]).subscribe(([region, province, district]) => {
      this.regions_arr = region;
      this.provinces_arr = province;
      this.districts_arr = district;
    });
  }

  list_address() {
    this.customerService.list_address_customer(this.id).subscribe({
      next: (res) => {
        this.address = res.data;
        this.load_data = false;
      },
    });
  }

  change_address_customer(id: any) {
    this.customerService.change_address_customer(id, this.id).subscribe({
      next: () => {
        this.list_address();
        this.publicService.success('Se actualizó la dirección principal.');
      },
    });
  }

  delete_address_customer(id: any) {
    this.customerService.delete_address_customer(id).subscribe({
      next: () => {
        this.list_address();
        this.publicService.success('Se eliminó la dirección.');
      },
    });
  }

  register() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.regions_arr.forEach((element: any) => {
      const region = this.myForm.controls['region'];
      if (parseInt(element.id) === parseInt(region.value)) {
        region.setValue(element.name);
      }
    });

    this.provinces_arr.forEach((element: any) => {
      const province = this.myForm.controls['province'];
      if (parseInt(element.id) === parseInt(province.value)) {
        province.setValue(element.name);
      }
    });

    this.districts_arr.forEach((element: any) => {
      const district = this.myForm.controls['district'];
      if (parseInt(element.id) === parseInt(district.value)) {
        district.setValue(element.name);
      }
    });

    this.customerService
      .register_address_customer(this.myForm.value)
      .subscribe({
        next: () => {
          this.list_address();
          this.myForm.reset();
          this.myForm.controls['region'].disable();
          this.myForm.controls['province'].disable();
          this.myForm.controls['district'].disable();
          this.publicService.success('Se registro correctamente la dirección.');
        },
      });
  }

  validate(name: string, status: boolean) {
    const input = this.myForm.controls[name];
    return status ? input.errors && input.touched : input.valid;
  }
}
