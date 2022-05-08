import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { PagesRoutingModule } from './pages-routing.module';
import { ComponentsModule } from '../components/components.module';

import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { PagesComponent } from './pages.component';
import { ProfileComponent } from './customer/profile/profile.component';
import { SidebarComponent } from './customer/sidebar/sidebar.component';
import { IndexProductComponent } from './products/index-product/index-product.component';
import { ImagePipe } from '../pipes/image.pipe';
import { DetailProductComponent } from './products/detail-product/detail-product.component';
import { NoSanitizePipe } from '../pipes/nosanitizer.pipe';

@NgModule({
  declarations: [
    IndexComponent,
    LoginComponent,
    PagesComponent,
    ProfileComponent,
    SidebarComponent,
    IndexProductComponent,
    ImagePipe,
    NoSanitizePipe,
    DetailProductComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    ComponentsModule,
    NgxPaginationModule,
  ],
})
export class PagesModule {}
