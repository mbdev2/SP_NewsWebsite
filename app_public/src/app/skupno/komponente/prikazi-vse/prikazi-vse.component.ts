import { Component, OnInit } from '@angular/core';
import { ProfilService } from "../../storitve/profil.service";
import { Clanek } from "../../razredi/clanek";
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prikazi-vse',
  templateUrl: './prikazi-vse.component.html',
  styleUrls: ['./prikazi-vse.component.css']
})
export class PrikaziVseComponent implements OnInit {

  constructor(
       private profilStoritev: ProfilService,
       private avtentikacijaStoritev: AvtentikacijaService,
       private usmerjevalnik: Router
  ) { }

  public clanki: Clanek[];

  private URLnaslov = this.usmerjevalnik.url;

  public naslov: string;

  public sporocilo: string;

  pridobiClanke = (): void => {
       switch(this.URLnaslov) {
         case "/prikaziVseMoje": {
              console.log("TUKAJ JE NASLOV", this.URLnaslov);
              this.sporocilo = "Iščem vaše članke.";
              this.naslov = "Moji članki";
              this.profilStoritev.pridobiVseMoje()
              .then(najdeniClanki => {
                  this.sporocilo = najdeniClanki.length > 0 ? "" : "Ni najdenih priljubljenih clankov"
                  this.clanki = najdeniClanki
              })
              .catch(napaka => this.prikaziNapako(napaka))
              break;
         }
         case "/prikaziVsePriljubljene": {
              console.log("TUKAJ JE NSALOV", this.URLnaslov);
              this.sporocilo = "Iščem vaše priljubljene članke.";
              this.naslov = "Priljubljeni članki";
              this.profilStoritev.pridobiVsePriljubljene()
              .then(najdeniClanki => {
                  this.sporocilo = najdeniClanki.length > 0 ? "" : "Ni najdenih priljubljenih clankov"
                  this.clanki = najdeniClanki
              })
              .catch(napaka => this.prikaziNapako(napaka))
              break;
         }
         default: {
               //DO NOTHING
               break;
         }
      }
  }

  private prikaziNapako = (napaka: any): void => {
       this.sporocilo = napaka.message || napaka;
  }

  ngOnInit(): void {
       this.pridobiClanke();
  }

}
