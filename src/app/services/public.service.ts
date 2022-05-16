import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.url;

declare var noUiSlider: any;
declare var lightGallery: any;
declare var tns: any;
declare var Cleave: any;
declare var StickySidebar: any;

declare var iziToast: any;
declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class PublicService {
  constructor(private http: HttpClient) {}

  get id(): string {
    return localStorage.getItem('public_id') || '';
  }

  get user(): string {
    return localStorage.getItem('public_user') || '';
  }

  get token(): string {
    return localStorage.getItem('public_token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  get_region(): Observable<any> {
    return this.http.get('./assets/regiones.json');
  }

  get_province(): Observable<any> {
    return this.http.get('./assets/provincias.json');
  }

  get_district(): Observable<any> {
    return this.http.get('./assets/distritos.json');
  }

  get_delivery(): Observable<any> {
    return this.http.get('./assets/delivery.json');
  }

  success(msg: string) {
    iziToast.show({
      title: 'SUCESS',
      titleColor: '#1dc74c',
      color: '#fff',
      class: 'text-success',
      position: 'bottomCenter',
      message: msg,
    });
  }

  danger(msg: string) {
    iziToast.show({
      title: 'ERROR',
      titleColor: '#ff0000',
      color: '#fff',
      class: 'text-danger',
      position: 'bottomCenter',
      message: msg,
    });
  }

  get_discount_active(): Observable<any> {
    const url = `${base_url}/get_discount_active`;
    return this.http.get(url, this.headers);
  }

  send_message_contact(data: any): Observable<any> {
    const url = `${base_url}/send_message_contact`;
    return this.http.post(url, data, this.headers);
  }

  list_reviews_public(id: any): Observable<any> {
    const url = `${base_url}/list_reviews_public/${id}`;
    return this.http.get(url, this.headers);
  }

  init_menu() {
    setTimeout(() => {
      tns({
        container: '.cs-carousel-inner',
        controlsText: [
          '<i class="cxi-arrow-left"></i>',
          '<i class="cxi-arrow-right"></i>',
        ],
        mode: 'gallery',
        navContainer: '#pager',
        responsive: {
          0: { controls: false },
          991: { controls: true },
        },
      });

      tns({
        container: '.cs-carousel-inner-two',
        controls: false,
        responsive: {
          0: {
            gutter: 20,
          },
          400: {
            items: 2,
            gutter: 20,
          },
          520: {
            gutter: 30,
          },
          768: {
            items: 3,
            gutter: 30,
          },
        },
      });

      tns({
        container: '.cs-carousel-inner-three',
        controls: false,
        mouseDrag: !0,
        responsive: {
          0: {
            items: 1,
            gutter: 20,
          },
          420: {
            items: 2,
            gutter: 20,
          },
          600: {
            items: 3,
            gutter: 20,
          },
          700: {
            items: 3,
            gutter: 30,
          },
          900: {
            items: 4,
            gutter: 30,
          },
          1200: {
            items: 5,
            gutter: 30,
          },
          1400: {
            items: 6,
            gutter: 30,
          },
        },
      });

      tns({
        container: '.cs-carousel-inner-four',
        nav: false,
        controlsText: [
          '<i class="cxi-arrow-left"></i>',
          '<i class="cxi-arrow-right"></i>',
        ],
        controlsContainer: '#custom-controls-trending',
        responsive: {
          0: {
            items: 1,
            gutter: 20,
          },
          480: {
            items: 2,
            gutter: 24,
          },
          700: {
            items: 3,
            gutter: 24,
          },
          1100: {
            items: 4,
            gutter: 30,
          },
        },
      });

      tns({
        container: '.cs-carousel-inner-five',
        controls: false,
        gutter: 30,
        responsive: {
          0: { items: 1 },
          380: { items: 2 },
          550: { items: 3 },
          750: { items: 4 },
          1000: { items: 5 },
          1250: { items: 6 },
        },
      });

      tns({
        container: '.cs-carousel-inner-six',
        controls: false,
        gutter: 15,
        responsive: {
          0: { items: 2 },
          500: { items: 3 },
          1200: { items: 3 },
        },
      });
    }, 500);
  }

  slider() {
    var slider: any = document.getElementById('slider');
    noUiSlider.create(slider, {
      start: [0, 3000],
      connect: true,
      range: {
        min: 0,
        max: 3000,
      },
      tooltips: [true, true],
      pips: {
        mode: 'count',
        values: 5,
      },
    });
    slider.noUiSlider.on('update', function (values: any) {
      $('.cs-range-slider-value-min').val(values[0]);
      $('.cs-range-slider-value-max').val(values[1]);
    });
    $('.noUi-tooltip').css('font-size', '11px');
  }

  init_carousel_assets() {
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
  }

  init_payment_assets() {
    setTimeout(() => {
      new Cleave('#cc-number', {
        creditCard: true,
      });
      new Cleave('#cc-exp-date', {
        date: true,
        datePattern: ['m', 'Y'],
      });
      new StickySidebar('.sidebar-sticky', { topSpacing: 20 });
    }, 500);
  }
}
