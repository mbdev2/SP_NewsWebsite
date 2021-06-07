import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'returnIDonly'
})
export class ReturnIDonlyPipe implements PipeTransform {

  transform(value: string, ...args: string[]): string {
    console.log("HAAHAHA")
    console.log(value.split(':')[2])
    return value.split(':')[2];
  }

}
