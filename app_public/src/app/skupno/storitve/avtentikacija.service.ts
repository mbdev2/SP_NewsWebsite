import { Inject, Injectable } from '@angular/core';
import { SHRAMBA_BRSKALNIKA } from '../razredi/shramba';
import { Uporabnik } from '../razredi/uporabnik';
import { RezultatAvtentikacije } from '../razredi/rezultat-avtentikacije';
import { UserAuthService } from '../storitve/user-auth.service';

@Injectable({
  providedIn: 'root'
})

export class AvtentikacijaService {

  constructor(
    @Inject(SHRAMBA_BRSKALNIKA) private shramba: Storage,
    private userAuthStoritev: UserAuthService
  ) { }

  private b64Utf8(niz: string): string {
     return decodeURIComponent(
       Array.prototype.map
         .call(
           atob(niz),
           (znak: string) => {
             return '%' + ('00' + znak.charCodeAt(0).toString(16)).slice(-2);
           }
         )
         .join('')
     );
   };

  public jePrijavljen(): boolean {
    const zeton: string = this.vrniZeton();
    if (zeton) {
      //console.log(zeton);
      const koristnaVsebina = JSON.parse(this.b64Utf8(zeton.split('.')[1]));
      return koristnaVsebina.exp > (Date.now() / 1000);
    } else {
      return false;
    }
  }

  public vrniTrenutnegaUporabnika(): Uporabnik {
    if (this.jePrijavljen()) {
      const zeton: string = this.vrniZeton();
      const { email, ime } = JSON.parse(this.b64Utf8(zeton.split('.')[1]));
      return { email, ime} as Uporabnik;
    }
  }

  public async prijava(uporabnik: Uporabnik): Promise<any> {
    return this.userAuthStoritev
      .prijava(uporabnik)
      .then((rezultatAvtentikacije: RezultatAvtentikacije) => {
        this.shraniZeton(rezultatAvtentikacije["eTVtoken"])
      });
  }

  public async registracija(uporabnik: Uporabnik): Promise<any> {
    return this.userAuthStoritev
      .registracija(uporabnik)
      .then((rezultatAvtentikacije: RezultatAvtentikacije) => {
        this.shraniZeton(rezultatAvtentikacije["eTVtoken"]);
      });
  }

  public odjava(): void {
    this.shramba.removeItem('etvUserID-zeton');
  }

  public brisiDBA(): void {
    this.userAuthStoritev.brisiDB();
  }

  public polniDBA(): void {
    this.userAuthStoritev.polniDB();
  }

  public vrniZeton(): string {
    return this.shramba.getItem('etvUserID-zeton');
  }

  public shraniZeton(zeton: string): void {
    this.shramba.setItem('etvUserID-zeton', zeton);
  }

}
