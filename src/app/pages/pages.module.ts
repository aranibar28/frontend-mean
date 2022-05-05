import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PagesRoutingModule } from './pages-routing.module';
import { ComponentsModule } from '../components/components.module';

import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { PagesComponent } from './pages.component';

@NgModule({
  declarations: [
    IndexComponent,
    LoginComponent,
    PagesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PagesRoutingModule,
    ComponentsModule,
  ]
})
export class PagesModule { }
