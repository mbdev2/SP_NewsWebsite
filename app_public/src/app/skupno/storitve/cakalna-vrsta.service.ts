import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Clanek, Komentar } from '../razredi/clanek';
import { environment } from '../../../environments/environment';
import { SHRAMBA_BRSKALNIKA } from '../razredi/shramba';

@Injectable({
  providedIn: 'root'
})
export class CakalnaVrstaService {

  constructor(
    private http: HttpClient,
    @Inject(SHRAMBA_BRSKALNIKA) private shramba: Storage
  ) { }

  private apiUrl = environment.apiUrl;

  public pridobiCakalnoVrsto(): Promise<Clanek[]> {
       const url: string = `${this.apiUrl}/cakalnaVrsta`;
       const httpLastnosti = {
          headers: new HttpHeaders({
          'Authorization': `Bearer ${this.shramba.getItem('etvUserID-zeton')}`
          })
       };
       return this.http
          .get(url, httpLastnosti)
          .toPromise()
          .then(odgovor => odgovor as Clanek[])
          .catch(this.obdelajNapako);
  }

  public objaviClanek(idClanka: string): Promise<any> {
       const url: string = `${this.apiUrl}/cakalnaVrsta/${idClanka}`;
       const httpLastnosti = {
          headers: new HttpHeaders({
          'Authorization': `Bearer ${this.shramba.getItem('etvUserID-zeton')}`
          })
       };
       return this.http
          .get(url, httpLastnosti)
          .toPromise()
          .then(odgovor => odgovor as any)
          .catch(this.obdelajNapako);
  }

  public izbrisiClanek(idClanka: string): Promise<any> {
       const url: string = `${this.apiUrl}/overview/${idClanka}`;
       const httpLastnosti = {
          headers: new HttpHeaders({
          'Authorization': `Bearer ${this.shramba.getItem('etvUserID-zeton')}`
          })
       };
       return this.http
          .delete(url, httpLastnosti)
          .toPromise()
          .then(odgovor => odgovor as any)
          .catch(this.obdelajNapako);
  }



  private obdelajNapako(napaka: any): Promise<any> {
    console.error('Prišlo je do napake', napaka.error["sporočilo"] || napaka.error.errmsg || napaka.message || napaka);
    return Promise.reject(napaka.error["sporočilo"] || napaka.error.errmsg || napaka.message || napaka);
  }
}
