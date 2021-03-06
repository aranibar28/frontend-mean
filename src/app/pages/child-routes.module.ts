import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './customer/profile/profile.component';
import { AuthGuard } from '../guards/auth.guard';
import { IndexProductComponent } from './products/index-product/index-product.component';
import { DetailProductComponent } from './products/detail-product/detail-product.component';
import { CartComponent } from './cart/cart.component';
import { AddressComponent } from './customer/address/address.component';
import { ContactComponent } from './contact/contact.component';
import { IndexOrderComponent } from './customer/orders/index-order/index-order.component';
import { DetailOrderComponent } from './customer/orders/detail-order/detail-order.component';
import { IndexReviewComponent } from './customer/reviews/index-review/index-review.component';

const childRoutes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cuenta/perfil', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'cuenta/direccion', component: AddressComponent, canActivate: [AuthGuard] },
  { path: 'cuenta/ordenes', component: IndexOrderComponent, canActivate: [AuthGuard] },
  { path: 'cuenta/ordenes/:id', component: DetailOrderComponent, canActivate: [AuthGuard] },
  { path: 'cuenta/reviews', component: IndexReviewComponent, canActivate: [AuthGuard] },

  { path: 'carrito', component: CartComponent, canActivate: [AuthGuard] },
  
  { path: 'productos', component: IndexProductComponent },
  { path: 'productos/:slug', component: DetailProductComponent },
  { path: 'productos/categoria/:category', component: IndexProductComponent },

  { path: 'contacto', component: ContactComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule],
})
export class ChildRoutesModule {}
