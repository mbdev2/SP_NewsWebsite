import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jeKajClankov'
})
export class JeKajClankovPipe implements PipeTransform {

  transform(clanki: any[]): boolean {
       console.log(clanki.length)
       if(clanki.length < 1) {
            return true;
       } else {
            return false;
       }
  }

}
