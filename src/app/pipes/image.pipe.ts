import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'image',
})
export class ImagePipe implements PipeTransform {
  url = environment.url;

  transform(image: string, args?: any) {
    if (args == 'product') {
      return `${this.url}/get_banner/${image}`;
    } else {
      return `${this.url}/get_banner_discount/${image}`;
    }
  }
}
