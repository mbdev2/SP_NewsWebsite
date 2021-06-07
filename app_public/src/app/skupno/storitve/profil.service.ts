import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SHRAMBA_BRSKALNIKA } from '../razredi/shramba';
import { Clanek } from '../razredi/clanek';
import { Uporabnik, UporabnikData } from '../razredi/uporabnik';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  constructor(
       private http: HttpClient,
       @Inject(SHRAMBA_BRSKALNIKA) private shramba: Storage
  ) { }

  private apiUrl = environment.apiUrl;

  public pridobiUporabnika(): Promise<UporabnikData> {
       const url: string = `${this.apiUrl}/profile`;
       const httpLastnosti = {
          headers: new HttpHeaders({
               'Authorization': `Bearer ${this.shramba.getItem('etvUserID-zeton')}`
          })
       };
       return this.http
          .get(url, httpLastnosti)
          .toPromise()
          .then(odgovor => odgovor as UporabnikData)
          .catch(this.obdelajNapako);
  }

  public pridobiPriljubljene(): Promise<Clanek[]> {
       const url: string = `${this.apiUrl}/profile/priljubljeni`;
       const httpLastnosti = {
          headers: new HttpHeaders({
               'Authorization': `Bearer ${this.shramba.getItem('etvUserID-zeton')}`,
               'limita': "3"
          })
       };
       return this.http
          .get(url, httpLastnosti)
          .toPromise()
          .then(odgovor => odgovor as Clanek[])
          .catch(this.obdelajNapako);
  }

  public pridobiMoje(): Promise<Clanek[]> {
       //console.log("2 tukaj")
       const url: string = `${this.apiUrl}/profile/moji`;
       const httpLastnosti = {
          headers: new HttpHeaders({
               'Authorization': `Bearer ${this.shramba.getItem('etvUserID-zeton')}`,
               'limita': "3"
          })
       };
       return this.http
          .get(url, httpLastnosti)
          .toPromise()
          .then(odgovor => odgovor as Clanek[])
          .catch(this.obdelajNapako);
  }

  public pridobiVsePriljubljene(): Promise<Clanek[]> {
       const url: string = `${this.apiUrl}/profile/priljubljeni`;
       const httpLastnosti = {
          headers: new HttpHeaders({
               'Authorization': `Bearer ${this.shramba.getItem('etvUserID-zeton')}`,
               'limita': "-1"
          })
       };
       return this.http
          .get(url, httpLastnosti)
          .toPromise()
          .then(odgovor => odgovor as Clanek[])
          .catch(this.obdelajNapako);
  }

  public pridobiVseMoje(): Promise<Clanek[]> {
       //console.log("2 tukaj")
       const url: string = `${this.apiUrl}/profile/moji`;
       const httpLastnosti = {
          headers: new HttpHeaders({
               'Authorization': `Bearer ${this.shramba.getItem('etvUserID-zeton')}`,
               'limita': "-1"
          })
       };
       return this.http
          .get(url, httpLastnosti)
          .toPromise()
          .then(odgovor => odgovor as Clanek[])
          .catch(this.obdelajNapako);
  }

  public posodobiUporabnika(uporabnik: any, geslo: string): Promise<UporabnikData> {
       const url: string = `${this.apiUrl}/profile/posodobi`;
       const httpLastnosti = {
          headers: new HttpHeaders({
               'Authorization': `Bearer ${this.shramba.getItem('etvUserID-zeton')}`,
               'geslo': geslo
          })
       };
       return this.http
          .put(url, uporabnik, httpLastnosti)
          .toPromise()
          .then(odgovor => odgovor as UporabnikData[])
          .catch(this.obdelajNapako);
  }

  public zbrisiUporabnika(): Promise<any> {
       const url: string = `${this.apiUrl}/users/izbrisi`;
       const httpLastnosti = {
          headers: new HttpHeaders({
               'Authorization': `Bearer ${this.shramba.getItem('etvUserID-zeton')}`,
               'uporabnik': 'null'
          })
       };
       return this.http
          .delete(url, httpLastnosti)
          .toPromise()
          .then(odgovor => odgovor as any)
          .catch(this.obdelajNapako);
  }

  public pridobiVseUporabnike(): Promise<UporabnikData[]> {
       const url: string = `${this.apiUrl}/users`;
       const httpLastnosti = {
          headers: new HttpHeaders({
               'Authorization': `Bearer ${this.shramba.getItem('etvUserID-zeton')}`,
          })
       };
       return this.http
          .get(url, httpLastnosti)
          .toPromise()
          .then(odgovor => odgovor as UporabnikData[])
          .catch(this.obdelajNapako);
  }

  public zbrisiTegaUporabnika(idUporabnika: string): Promise<any> {
       const url: string = `${this.apiUrl}/users/izbrisi`;
       const httpLastnosti = {
          headers: new HttpHeaders({
               'Authorization': `Bearer ${this.shramba.getItem('etvUserID-zeton')}`,
               'uporabnik': idUporabnika
          })
       };
       return this.http
          .delete(url, httpLastnosti)
          .toPromise()
          .then(odgovor => odgovor as any)
          .catch(this.obdelajNapako);
  }

  public posodobiTegaUporabnika(uporabnik: any): Promise<UporabnikData> {
       const url: string = `${this.apiUrl}/users/novNivoDostopa`;
       console.log(uporabnik.nivodostopa)
       const httpLastnosti = {
          headers: new HttpHeaders({
               'Authorization': `Bearer ${this.shramba.getItem('etvUserID-zeton')}`,
               'uporabnik': uporabnik._id,
               'novNivo': uporabnik.nivodostopa
          })
       };
       return this.http
          .put(url, uporabnik, httpLastnosti)
          .toPromise()
          .then(odgovor => odgovor as UporabnikData[])
          .catch(this.obdelajNapako);
  }

  private obdelajNapako(napaka: any): Promise<any> {
     console.error('Prišlo je do napake', napaka);
     return Promise.reject(napaka.message || napaka);
  }
}
