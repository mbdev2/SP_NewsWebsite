import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ClankiPodatkiService } from "../../storitve/clanki-podatki.service";
import { Clanek, Komentar } from "../../razredi/clanek";
import { ZgodovinaService } from '../../storitve/zgodovina.service';
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';
import { PovezavaService } from '../../storitve/povezava.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

     public napakaNaObrazcu: string = "";

     public novKomentar: Komentar = {
          avtor: "",
          besedilo: ""
     };

     public jePovezava(): boolean {
          return this.povezavaStoritev.jePovezava;
     }

  constructor(
       private clankiPodatkiService: ClankiPodatkiService,
       private pot: ActivatedRoute,
       private zgodovinaStoritev: ZgodovinaService,
       private avtentikacijaStoritev: AvtentikacijaService,
       private povezavaStoritev: PovezavaService
  ) { }

  public clanek: Clanek;

  public priljubljen: string;

  public mojiKomentarji: string[];

  private ponastaviObrazec(): void {
     this.novKomentar.avtor = "";
     this.novKomentar.besedilo = "";
  }

  public posljiKomentar(): void {
   this.napakaNaObrazcu = "";
   if (!this.novKomentar.besedilo){
        this.napakaNaObrazcu = "Zahtevano je besedilo komentarja!";
   } else {
        this.objaviKomentar();
   }
 }

 private objaviKomentar(): void {
   this.clankiPodatkiService
     .dodajKomentarClanku(this.clanek._id, this.novKomentar)
     .then((komentar: any) => {
          var idKomentarja = komentar._id;
          console.log("Komentar shranjen", komentar);
          let komentarji = this.clanek.komentarji.slice(0);
          let mojiKomentarji = this.mojiKomentarji.slice(0);
          komentarji.unshift(komentar);
          mojiKomentarji.unshift(idKomentarja);
          this.clanek.komentarji = komentarji;
          this.mojiKomentarji = mojiKomentarji;
          this.ponastaviObrazec();
     })
     .catch(napaka => this.napakaNaObrazcu = napaka);
 }

 public izbrisiKomentar(komentar: Komentar, idKomentarja: string): void {
          this.clankiPodatkiService
               .izbrisiKomentar(this.clanek._id, idKomentarja)
               .then(() => {
                    console.log("Komentar uspešno izbrisan.");
                    let komentarji = this.clanek.komentarji.slice(0);
                    const indeks = komentarji.indexOf(komentar);
                    if (indeks > -1) {
                         komentarji.splice(indeks, 1)
                    }
                    this.clanek.komentarji = komentarji;
               })
               .catch(napaka => this.napakaNaObrazcu = napaka)
 }

 public sporocilo: string;

 public dodajMedPriljubljene(): void {
     this.clankiPodatkiService
          .dodajMedPriljubljene(this.clanek._id)
          .then(() => {
               console.log("Članek dodan med priljubljene.");
               this.priljubljen = "priljubljen";
               //console.log(this.priljubljen);
          })
          .catch(napaka => this.sporocilo = napaka);
 }

 public odstraniIzPriljubljenih(): void {
      this.clankiPodatkiService
          .odstraniIzPriljubljenih(this.clanek._id)
          .then(() => {
               console.log("Članek odstranjen iz priljubljenih.");
               this.priljubljen = "nePriljubljen";
               //console.log(this.priljubljen);
          })
          .catch(napaka => this.sporocilo = napaka);
 }


  ngOnInit(): void {
       this.pot.paramMap
           .pipe(
                switchMap((params: ParamMap) => {
                     let idClanka = params.get('idClanka');
                     var dataClanek = this.clankiPodatkiService.pridobiClanek(idClanka);
                     return dataClanek;
                })
           )
           .subscribe(
                (podatki: any) => {
                this.clanek = podatki.clanek;
                this.clanek.clanektext = podatki.clanek.besedilo;
                this.mojiKomentarji = podatki.mojiKomentarji;
                },
                err => {
                     this.sporocilo = err
                }
           )

      this.pot.paramMap
          .pipe(
               switchMap((params: ParamMap) => {
                    let idClanka = params.get('idClanka');
                    return this.clankiPodatkiService.jePriljubljen(idClanka);
               })
          )
          .subscribe(
               (podatki: any) => {
               this.priljubljen = podatki
               //console.log(this.priljubljen);
               },
               err => {
                    this.sporocilo = err
               }
          )
  }

}
