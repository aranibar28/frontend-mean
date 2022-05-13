import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { ImagePipex } from '../pipes/imagex.pipe';
import { Discounts2Pipe } from '../pipes/discounts2.pipe';

@NgModule({
  declarations: [NavComponent, FooterComponent, ImagePipex, Discounts2Pipe],
  imports: [CommonModule, RouterModule],
  exports: [NavComponent, FooterComponent],
})
export class ComponentsModule {}
