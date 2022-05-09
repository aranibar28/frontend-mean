import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit {
  public id: any;
  public user: any = undefined;
  public user_lc: any = undefined;
  public categories: any;
  public op_cart = false;

  public cart_items: Array<any> = [];
  public subtotal = 0;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {
    this.id = customerService.id;
    if (this.id) {
      this.customerService.list_customer_by_id_invited(this.id).subscribe({
        next: (res) => {
          this.user = res.data;
          localStorage.setItem('public_user', JSON.stringify(this.user));
          if (localStorage.getItem('public_user')) {
            this.user_lc = JSON.parse(localStorage.getItem('public_user')!);
            this.customerService.get_cart_customer(this.user_lc._id).subscribe({
              next: (res) => {
                this.cart_items = res.data;
                console.log(this.cart_items);
                this.calculate_cart();
              },
            });
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
      .list_categories_public()
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

  show_modal_cart() {
    if (!this.op_cart) {
      this.op_cart = true;
      $('#cart').addClass('show');
    } else {
      this.op_cart = false;
      $('#cart').removeClass('show');
    }
  }

  calculate_cart() {
    this.cart_items.forEach((element) => {
      this.subtotal = this.subtotal + parseInt(element.product.price);
    });
  }

  delete_item(id: any) {
    this.customerService.delete_item_cart(id).subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }
}
