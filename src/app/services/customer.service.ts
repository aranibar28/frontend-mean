import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.url;

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  login_customer(data: any): Observable<any> {
    const url = `${base_url}/login_customer/`;
    return this.http.post(url, data, this.headers);
  }

  list_customer_by_id_invited(id: any): Observable<any> {
    const url = `${base_url}/list_customer_by_id_invited/${id}`;
    return this.http.get(url, this.headers);
  }
}
