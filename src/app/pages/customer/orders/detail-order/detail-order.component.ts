import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import Swal from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
})
export class DetailOrderComponent implements OnInit {
  public id: any;
  public order: any = {};
  public details: Array<any> = [];
  public load_data = true;
  public p: number = 1;

  public review: any = {};

  constructor(
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => (this.id = id));
    this.init_data();
  }

  init_data() {
    this.customerService.read_orders_by_id(this.id).subscribe({
      next: (res) => {
        if (res) {
          res.details.forEach((element: any) => {
            this.customerService
              .read_review_product(element.product._id)
              .subscribe({
                next: (res) => {
                  let emit = false;
                  res.data.forEach((element: any) => {
                    if (element.customer == localStorage.getItem('public_id')) {
                      emit = true;
                    }
                  });
                  element.status = emit;
                },
              });
          });
          this.order = res.data;
          this.details = res.details;
          this.load_data = false;
        } else {
          this.router.navigateByUrl('/cuenta/ordenes');
        }
      },
    });
  }

  open_modal(item: any) {
    this.review = {};
    this.review.product = item.product._id;
    this.review.customer = item.customer;
    this.review.sale = this.id;
    this.review.starts = '';
  }

  register(id: any) {
    if (this.review.review) {
      if (this.review.starts != '') {
        this.customerService.send_review_product(this.review).subscribe({
          next: () => {
            Swal.fire('Enviado!', 'Reseña publicada.', 'success');
            $('#review-' + id).modal('hide');
            $('.modal-backdrop').removeClass('show');
            this.init_data();
          },
        });
      } else {
        Swal.fire('Error', 'Seleccione una puntuación', 'error');
      }
    } else {
      Swal.fire('Error', 'Escriba una reseña', 'error');
    }
  }
}
