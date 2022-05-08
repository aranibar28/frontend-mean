import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { PublicService } from 'src/app/services/public.service';
declare var lightGallery: any;
declare var tns: any;

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
})
export class DetailProductComponent implements OnInit {
  public products_recomended: Array<any> = [];
  public product: any = {};
  public slug: any;

  public cart_data: any = {
    variety: '',
    quantity: 1,
  };

  public load_btn = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private publicService: PublicService
  ) {}

  ngOnInit(): void {
    this.init_assets();
    this.list_product_by_slug();
  }

  list_product_by_slug() {
    this.activatedRoute.params.subscribe(({ slug }) => {
      this.slug = slug;
      this.publicService.list_product_by_slug(this.slug).subscribe({
        next: (res) => {
          this.product = res.data;
          this.publicService
            .list_product_recomended(this.product.category)
            .subscribe({
              next: (res) => {
                this.products_recomended = res.data;
              },
            });
        },
      });
    });
  }

  add_product() {
    if (this.cart_data.variety) {
      if (this.cart_data.quantity <= this.product.stock) {
        let data = {
          product: this.product._id,
          customer: localStorage.getItem('public_id'),
          quantity: this.cart_data.quantity,
          variety: this.cart_data.variety,
        };
        this.load_btn = true;
        this.customerService.add_cart_customer(data).subscribe({
          next: (res) => {
            if (res.data == undefined) {
              this.load_btn = false;
              this.publicService.danger('El producto ya existe en el carrito.');
            } else {
              console.log(res);
              this.load_btn = false;
              this.publicService.success('Se agegró el producto al carrito.');
            }
          },
        });
      } else {
        const msg = 'La máxima cantidad disponible es ' + this.product.stock;
        this.publicService.danger(msg);
      }
    } else {
      const msg = 'Porfavor, seleccione una variedad del producto.';
      this.publicService.danger(msg);
    }
  }

  init_assets() {
    setTimeout(() => {
      tns({
        container: '.cs-carousel-inner',
        controlsText: [
          '<i class="cxi-arrow-left"></i>',
          '<i class="cxi-arrow-right"></i>',
        ],
        navPosition: 'top',
        controlsPosition: 'top',
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        navContainer: '#cs-thumbnails',
        navAsThumbnails: true,
        gutter: 15,
      });

      var e = document.querySelectorAll('.cs-gallery');
      if (e.length) {
        for (var t = 0; t < e.length; t++) {
          lightGallery(e[t], {
            selector: '.cs-gallery-item',
            download: !1,
            videojs: !0,
            youtubePlayerParams: { modestbranding: 1, showinfo: 0, rel: 0 },
            vimeoPlayerParams: { byline: 0, portrait: 0 },
          });
        }
      }

      tns({
        container: '.cs-carousel-inner-two',
        controlsText: [
          '<i class="cxi-arrow-left"></i>',
          '<i class="cxi-arrow-right"></i>',
        ],
        navPosition: 'top',
        controlsPosition: 'top',
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        nav: false,
        controlsContainer: '#custom-controls-related',
        responsive: {
          0: { items: 1, gutter: 20 },
          480: { items: 2, gutter: 24 },
          700: { items: 3, gutter: 24 },
          1100: { items: 4, gutter: 30 },
        },
      });
    }, 500);
  }
}
