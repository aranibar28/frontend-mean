import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit {
  public load_btn = false;

  constructor(private publicService: PublicService, private fb: FormBuilder) {}

  ngOnInit(): void {}

  myForm: FormGroup = this.fb.group({
    customer: [, [Validators.required]],
    subject: [, [Validators.required]],
    message: [, [Validators.required]],
    email: [, [Validators.required]],
    phone: [, [Validators.required]],
  });

  register() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.load_btn = true;
    this.publicService.send_message_contact(this.myForm.value).subscribe({
      next: () => {
        this.myForm.reset();
        this.load_btn = false;
        this.publicService.success('Mensaje enviado correctamente!');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  validate(name: string, status: boolean) {
    const input = this.myForm.controls[name];
    return status ? input.errors && input.touched : input.valid;
  }
}
