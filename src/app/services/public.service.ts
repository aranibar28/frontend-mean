import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.url;
declare var iziToast: any;

@Injectable({
  providedIn: 'root',
})
export class PublicService {
  constructor(private http: HttpClient) {}

  get id(): string {
    return localStorage.getItem('public_id') || '';
  }

  get token(): string {
    return localStorage.getItem('public_token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
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
}
