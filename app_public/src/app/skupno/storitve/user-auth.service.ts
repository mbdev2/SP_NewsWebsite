import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Uporabnik } from '../razredi/uporabnik';
import { RezultatAvtentikacije } from '../razredi/rezultat-avtentikacije';
import { environment } from '../../../environments/environment';
import { SHRAMBA_BRSKALNIKA } from '../razredi/shramba';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(
    private http: HttpClient,
    @Inject(SHRAMBA_BRSKALNIKA) private shramba: Storage
  ) { }

  private apiUrl = environment.apiUrl;

  public prijava(uporabnik: Uporabnik): Promise<RezultatAvtentikacije> {
    return this.avtentikacija('prijava', uporabnik);
  }

  public registracija(uporabnik: Uporabnik): Promise<RezultatAvtentikacije> {
    return this.avtentikacija('registracija', uporabnik);
  }

  private avtentikacija(urlNaslov: string, uporabnik: Uporabnik): Promise<RezultatAvtentikacije> {
   const url: string = `${this.apiUrl}/${urlNaslov}`;
   return this.http
     .post(url, uporabnik)
     .toPromise()
     .then(rezultat => rezultat as RezultatAvtentikacije)
     .catch(this.obdelajNapako);
 }

 // Polnjenje in brisanje baze
 public brisiDB(): Promise<any> {
   const url: string = `${this.apiUrl}/brisidb`;
   const httpLastnosti = {
     headers: new HttpHeaders({
       'Authorization': `Bearer ${this.shramba.getItem('etvUserID-zeton')}`
     })
   };
   return this.http
     .get(url, httpLastnosti)
     .toPromise()
     .then(odgovor => console.log(odgovor))
     .catch(this.obdelajNapako);
 }

 public polniDB(): Promise<any> {
   const url: string = `${this.apiUrl}/polnidb`;
   return this.http
     .get(url)
     .toPromise()
     .then(odgovor => console.log(odgovor))
     .catch(this.obdelajNapako);
 }


  private obdelajNapako(napaka: any): Promise<any> {
    console.error('Prišlo je do napake', napaka.error["sporočilo"] || napaka.error.errmsg || napaka.message || napaka);
    return Promise.reject(napaka.error["sporočilo"] || napaka.error.errmsg || napaka.message || napaka);
  }
}
