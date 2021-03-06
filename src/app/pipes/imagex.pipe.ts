import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'imagex',
})
export class ImagePipex implements PipeTransform {
  url = environment.url;

  transform(image: string) {
    return `${this.url}/get_banner/${image}`;
  }
}
