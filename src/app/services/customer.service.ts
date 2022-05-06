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

  get token(): string {
    return localStorage.getItem('token') || '';
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

  login_customer(data: any): Observable<any> {
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

  get_config_public(): Observable<any> {
    const url = `${base_url}/get_config_public`;
    return this.http.get(url, this.headers);
  }
}
