import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.url;
declare var noUiSlider: any;
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

  list_product_by_slug(slug: any): Observable<any> {
    const url = `${base_url}/list_product_by_slug/${slug}`;
    return this.http.get(url, this.headers);
  }

  list_product_recomended(category: any): Observable<any> {
    const url = `${base_url}/list_product_recomended/${category}`;
    return this.http.get(url, this.headers);
  }

  success(msg: string) {
    iziToast.show({
      title: 'SUCESS',
      titleColor: '#1dc74c',
      color: '#fff',
      class: 'text-success',
      position: 'topRight',
      message: msg,
    });
  }

  danger(msg: string) {
    iziToast.show({
      title: 'ERROR',
      titleColor: '#ff0000',
      color: '#fff',
      class: 'text-danger',
      position: 'topRight',
      message: msg,
    });
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
}
