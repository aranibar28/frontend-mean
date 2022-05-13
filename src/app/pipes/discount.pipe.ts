import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'discount',
})
export class DiscountPipe implements PipeTransform {
  url = environment.url;

  transform(image: string) {
    return `${this.url}/get_banner_discount/${image}`;
  }
}
