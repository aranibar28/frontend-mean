import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PagesRoutingModule } from './pages-routing.module';
import { ComponentsModule } from '../components/components.module';

import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { PagesComponent } from './pages.component';
import { ProfileComponent } from './customer/profile/profile.component';
import { SidebarComponent } from './customer/sidebar/sidebar.component';
import { IndexProductComponent } from './products/index-product/index-product.component';

@NgModule({
  declarations: [
    IndexComponent,
    LoginComponent,
    PagesComponent,
    ProfileComponent,
    SidebarComponent,
    IndexProductComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    ComponentsModule,
  ]
})
export class PagesModule { }
