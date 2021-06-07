import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ClankiPodatkiService } from "../../storitve/clanki-podatki.service";
import { Clanek, Komentar } from "../../razredi/clanek";
import { ZgodovinaService } from '../../storitve/zgodovina.service';
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';
import { Router } from '@angular/router';
import { PovezavaService } from '../../storitve/povezava.service';


class ImageSnippet {
     pending: boolean = false;
     status: string = 'init';
     constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-mediainput',
  templateUrl: './mediainput.component.html',
  styleUrls: ['./mediainput.component.css']
})
export class MediainputComponent implements OnInit {

     public novClanek: Clanek = {
          _id: "",
          naslov: "",
          kraj: "",
          caption: "",
          slika: "",
          clanektext: "",
          kategorija: "placeholder",
          avtor: "",
          avtorVzdevek: "",
          komentarji: [],
          datum: null
     }

     public jePovezava(): boolean {
          return this.povezavaStoritev.jePovezava;
     }

     public napakaNaObrazcu: string;

     public dodajNovClanek(): void {
          this.napakaNaObrazcu = "";
          if (this.soPodatkiUstrezni()) {
               this.clankiPodatkiService
                    .objaviClanek(this.novClanek)
                    .then(() => window.location.href="/")
                    .catch(sporocilo => this.napakaNaObrazcu = sporocilo)
          } else {
               this.napakaNaObrazcu = "Manjka vam en izmed zahtevanih podatkov: Naslov, Kraj, Kategorija, Opis, Besedilo!"
          }
     }

     public soPodatkiUstrezni(): boolean {
          if (this.novClanek.naslov && this.novClanek.kraj && this.novClanek.caption && this.novClanek.clanektext && this.novClanek.kategorija) {
               return true;
          } else {
               return false;
          }
     }

     private onSuccess() {
          this.selectedFile.pending = false;
          this.selectedFile.status = 'ok';
     }

     private onError() {
          this.selectedFile.pending = false;
          this.selectedFile.status = 'fail';
          this.selectedFile.src = '';
     }

     public selectedFile: ImageSnippet;

     processFile(imageInput: any) {
         const file: File = imageInput.files[0];
         const reader = new FileReader();

         reader.addEventListener('load', (event: any) => {

           this.selectedFile = new ImageSnippet(event.target.result, file);
           this.novClanek.slika = event.target.result;

           this.selectedFile.pending = true;

         });

         reader.readAsDataURL(file);
    };

  constructor(
     private clankiPodatkiService: ClankiPodatkiService,
     private usmerjevalnik: Router,
     private zgodovinaStoritev: ZgodovinaService,
     private povezavaStoritev: PovezavaService
  ) { }

  private URLnaslov = this.usmerjevalnik.url;

  public naslov: string;

  poisciClanek = (): void => {
       let argument = this.URLnaslov.split("/");
       console.log(argument)
       switch(argument[1]) {
         case "article": {
              //console.log("TUKAJ JE NASLOV", this.URLnaslov);
              var idClanka = argument[3]
              this.naslov = "Uredi članek";
              this.clankiPodatkiService
              .pridobiClanek(idClanka)
              .then((najdenClanek: any) => {
                  this.napakaNaObrazcu = najdenClanek ? "" : "Ni najdenega članka za urejanje."
                  this.novClanek = najdenClanek.clanek
                  this.novClanek.clanektext = najdenClanek.clanek.besedilo
                  //console.log("PRIDOBLJEN CLANEK:", najdenClanek);
                  //console.log("NOVI CLANEK", this.novClanek);
              })
              .catch(napaka => this.napakaNaObrazcu = napaka)
              break;
         }
         case "mediainput": {
              this.naslov = "Nov članek";
              break;
         }
         default: {
               // DO NOTHING
               break;
         }
      }
  }

  public izbrisiClanek(): void {
           this.clankiPodatkiService
                .izbrisiClanek(this.novClanek._id)
                .then(() => {
                     console.log("Članek uspešno izbrisan.");
                     window.location.href="/prikaziVseMoje"
                })
                .catch(napaka => this.napakaNaObrazcu = napaka)
  }



  ngOnInit(): void {
       this.poisciClanek()
  }

}
