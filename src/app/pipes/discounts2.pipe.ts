import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discounts',
})
export class Discounts2Pipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    let discount = Math.round(value - (value * args[0]) / 100);
    return discount;
  }
}
