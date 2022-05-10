import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
const base_url = environment.url;

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
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

  public isAuthenticated(): boolean {
    const token = this.token;
    if (!token) {
      return false;
    }
    try {
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(token);
      if (helper.isTokenExpired(token)) {
        localStorage.clear();
        return false;
      }
      if (!decodedToken) {
        localStorage.clear();
        return false;
      }
    } catch (error) {
      localStorage.clear();
      return false;
    }
    return true;
  }

  login_customer_invited(data: any): Observable<any> {
    const url = `${base_url}/login_customer/`;
    return this.http.post(url, data, this.headers);
  }

  list_customer_by_id_invited(id: any): Observable<any> {
    const url = `${base_url}/list_customer_by_id_invited/${id}`;
    return this.http.get(url, this.headers);
  }

  update_customer_invited(id: any, data: any): Observable<any> {
    const url = `${base_url}/update_customer_invited/${id}`;
    return this.http.put(url, data, this.headers);
  }

  list_categories_public(): Observable<any> {
    const url = `${base_url}/get_config_public`;
    return this.http.get(url, this.headers);
  }

  list_products_public(filter: any): Observable<any> {
    const url = `${base_url}/list_products_public/${filter}`;
    return this.http.get(url, this.headers);
  }

  add_cart_customer(data: any): Observable<any> {
    const url = `${base_url}/add_cart_customer`;
    return this.http.post(url, data, this.headers);
  }

  get_cart_customer(id: any): Observable<any> {
    const url = `${base_url}/get_cart_customer/${id}`;
    return this.http.get(url, this.headers);
  }

  delete_item_cart(id: any): Observable<any> {
    const url = `${base_url}/delete_item_cart/${id}`;
    return this.http.delete(url, this.headers);
  }

  register_address_customer(data: any): Observable<any> {
    const url = `${base_url}/register_address_customer`;
    return this.http.post(url, data, this.headers);
  }

  list_address_customer(id: any): Observable<any> {
    const url = `${base_url}/list_address_customer/${id}`;
    return this.http.get(url, this.headers);
  }
  //change_address_customer}
  change_address_customer(id: any, customer: any): Observable<any> {
    const url = `${base_url}/change_address_customer/${id}`;
    return this.http.put(url + '/' + customer, { data: true }, this.headers);
  }

  delete_address_customer(id: any): Observable<any> {
    const url = `${base_url}/delete_address_customer/${id}`;
    return this.http.delete(url, this.headers);
  }
}
