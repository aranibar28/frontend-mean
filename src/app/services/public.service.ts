import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.url;

@Injectable({
  providedIn: 'root',
})
export class PublicService {
  constructor(private http: HttpClient) {}

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
}
