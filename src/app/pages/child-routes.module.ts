import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './customer/profile/profile.component';
import { AuthGuard } from '../guards/auth.guard';
import { IndexProductComponent } from './products/index-product/index-product.component';
import { DetailProductComponent } from './products/detail-product/detail-product.component';

const childRoutes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cuenta/perfil', component: ProfileComponent, canActivate: [AuthGuard] },

  { path: 'productos', component: IndexProductComponent },
  { path: 'productos/:slug', component: DetailProductComponent },
  { path: 'productos/categoria/:category', component: IndexProductComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule],
})
export class ChildRoutesModule {}
