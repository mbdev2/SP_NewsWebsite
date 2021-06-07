import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jeMojKomentar'
})
export class JeMojKomentarPipe implements PipeTransform {

  transform(komentarji: string[], komentar: string): boolean {
       if (komentarji.indexOf(komentar) > -1) {
            return true;
       } else {
            return false;
       }
  }

}
