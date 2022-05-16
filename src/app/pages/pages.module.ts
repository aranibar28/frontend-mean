import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { BarRatingModule } from 'ngx-bar-rating';

import { PagesRoutingModule } from './pages-routing.module';
import { ComponentsModule } from '../components/components.module';

import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { PagesComponent } from './pages.component';
import { ProfileComponent } from './customer/profile/profile.component';
import { SidebarComponent } from './customer/sidebar/sidebar.component';
import { IndexProductComponent } from './products/index-product/index-product.component';
import { DetailProductComponent } from './products/detail-product/detail-product.component';
import { NoSanitizePipe } from '../pipes/nosanitizer.pipe';
import { CartComponent } from './cart/cart.component';
import { ImagePipe } from '../pipes/image.pipe';
import { AddressComponent } from './customer/address/address.component';
import { DiscountsPipe } from '../pipes/discounts.pipe';
import { ContactComponent } from './contact/contact.component';
import { IndexOrderComponent } from './customer/orders/index-order/index-order.component';
import { DetailOrderComponent } from './customer/orders/detail-order/detail-order.component';
import { IndexReviewComponent } from './customer/reviews/index-review/index-review.component';

@NgModule({
  declarations: [
    IndexComponent,
    LoginComponent,
    PagesComponent,
    ProfileComponent,
    SidebarComponent,
    IndexProductComponent,
    NoSanitizePipe,
    DetailProductComponent,
    CartComponent,
    ImagePipe,
    DiscountsPipe,
    AddressComponent,
    ContactComponent,
    IndexOrderComponent,
    DetailOrderComponent,
    IndexReviewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    ComponentsModule,
    NgxPaginationModule,
    BarRatingModule,
  ],
})
export class PagesModule {}
