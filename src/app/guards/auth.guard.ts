import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (!this.customerService.isAuthenticated()) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}
