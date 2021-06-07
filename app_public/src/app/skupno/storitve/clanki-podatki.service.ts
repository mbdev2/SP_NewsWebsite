import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Clanek, Komentar } from '../razredi/clanek';
import { environment } from '../../../environments/environment';
import { SHRAMBA_BRSKALNIKA } from '../razredi/shramba';

@Injectable({
  providedIn: 'root'
})
export class ClankiPodatkiService {

  constructor(
    private http: HttpClient,
    @Inject(SHRAMBA_BRSKALNIKA) private shramba: Storage
  ) { }

  private apiUrl = environment.apiUrl;


  public pridobiSteviloClankovVKategoriji(kategorija: string): Promise<number> {
    const url: string = `${this.apiUrl}/steviloClankov/${kategorija}`;
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor as number)
      .catch(this.obdelajNapako);
  }

  public pridobiAktualneClanke(page: number): Promise<Clanek[]> {
    const url: string = `${this.apiUrl}/Danes/${page}`;
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor as Clanek[])
      .catch(this.obdelajNapako);
  }

  public pridobiEkonomskeClanke( page: number): Promise<Clanek[]> {
    const url: string = `${this.apiUrl}/Ekonomija/${page}`;
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

  public pridobiIzobrazevalneClanke( page: number): Promise<Clanek[]> {
    const url: string = `${this.apiUrl}/Izobrazba/${page}`;
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor as Clanek[])
      .catch(this.obdelajNapako);
  }

  public pridobiCovidClanke( page: number): Promise<Clanek[]> {
    const url: string = `${this.apiUrl}/Covid/${page}`;
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor as Clanek[])
      .catch(this.obdelajNapako);
  }

  public pridobiKulturneClanke( page: number): Promise<Clanek[]> {
    const url: string = `${this.apiUrl}/Kultura/${page}`;
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor as Clanek[])
      .catch(this.obdelajNapako);
  }

  public pridobiSportneClanke( page: number): Promise<Clanek[]> {
    const url: string = `${this.apiUrl}/Sport/${page}`;
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor as Clanek[])
      .catch(this.obdelajNapako);
  }

  public pridobiRezultateIskanja(iskalniNiz: string): Promise<Clanek[]> {
    const url: string = `${this.apiUrl}/rezultati/${iskalniNiz}`;
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor as Clanek[])
      .catch(this.obdelajNapako);
  }

  public pridobiClanek(idClanka: string): Promise<Clanek> {
     var url = ''
     var httpLastnosti = null
     console.log(this.shramba.getItem('etvUserID-zeton'));
     if (this.shramba.getItem('etvUserID-zeton') !== null) {
          url = `${this.apiUrl}/article/${idClanka}`;
          httpLastnosti = {
             headers: new HttpHeaders({
                  'Authorization': `Bearer ${this.shramba.getItem('etvUserID-zeton')}`,
                  'prijavljen': 'defined'
             })
          };
     } else {
           url = `${this.apiUrl}/article/${idClanka}/nePrijavljen`;
           httpLastnosti = {
             headers: new HttpHeaders({
                  'prijavljen': 'undefined'
             })
          };
     }
     return this.http
     .get(url, httpLastnosti)
     .toPromise()
     .then(odgovor => odgovor as any)
     .catch(this.obdelajNapako);
 }

 public jePriljubljen(idClanka: string): Promise<string> {
     if (this.shramba.getItem('etvUserID-zeton') !== null) {
          //console.log("TUKAJ SEM")
          const url: string = `${this.apiUrl}/jePriljubljen/${idClanka}`;
          const httpLastnosti = {
             headers: new HttpHeaders({
                  'Authorization': `Bearer ${this.shramba.getItem('etvUserID-zeton')}`
             })
          };
          return this.http
          .get(url, httpLastnosti)
          .toPromise()
          .then(odgovor => odgovor as string)
          .catch(this.obdelajNapako);
     } else {
          //console.log("NEEE, TUKAJ SEM")
          return Promise.resolve().then(odgovor => "nePrijavljen" as string)
     }
 }

 public dodajKomentarClanku(idClanka: string, komentar: Komentar): Promise<Komentar> {
      const url: string = `${this.apiUrl}/article/${idClanka}/komentarji`;
      const httpLastnosti = {
           headers: new HttpHeaders({
                'Authorization': `Bearer ${this.shramba.getItem('etvUserID-zeton')}`
           })
      };
      return this.http
      .post(url, komentar, httpLastnosti)
      .toPromise()
      .then(odgovor => odgovor as any)
      .catch(this.obdelajNapako);
 }

 public objaviClanek(clanek: Clanek): Promise<Clanek> {
      const url: string = `${this.apiUrl}/mediainput`;
      const httpLastnosti = {
           headers: new HttpHeaders({
                'Authorization': `Bearer ${this.shramba.getItem('etvUserID-zeton')}`
           })
      };
      //console.log("HTTP LASTNOSTI:", httpLastnosti)
      //console.log("ZETON:", this.shramba.getItem('etvUserID-zeton'))
      return this.http
      .post(url, clanek, httpLastnosti)
      .toPromise()
      .then((odgovor => odgovor as Clanek))
      .catch(this.obdelajNapako);
 }

 public izbrisiKomentar(idClanka: string, idKomentarja: string): Promise<any> {
      //console.log("PODATKI:", idClanka, idKomentarja);
      const url: string = `${this.apiUrl}/article/${idClanka}/izbrisKomentarja/${idKomentarja}`;
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

 public izbrisiClanek(idClanka: string): Promise<any> {
      const url: string = `${this.apiUrl}/article/${idClanka}`;
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

 public dodajMedPriljubljene(idClanka: string): Promise<any> {
      const url: string = `${this.apiUrl}/dodajMedPriljubljene/${idClanka}`;
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

 public odstraniIzPriljubljenih(idClanka: string): Promise<any> {
      const url: string = `${this.apiUrl}/odstraniIzPriljubljenih/${idClanka}`;
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



  private obdelajNapako(napaka: any): Promise<any> {
    console.error('Prišlo je do napake', napaka.error["sporočilo"] || napaka.error.errmsg || napaka.message || napaka);
    return Promise.reject(napaka.error["sporočilo"] || napaka.error.errmsg || napaka.message || napaka);
  }
}
