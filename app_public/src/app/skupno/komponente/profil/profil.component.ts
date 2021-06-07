import { Component, OnInit } from '@angular/core';
import { ProfilService } from "../../storitve/profil.service";
import { Clanek } from "../../razredi/clanek";
import { Router } from '@angular/router';
import { Uporabnik, UporabnikData } from "../../razredi/uporabnik";
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';


@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  constructor(
       private profilStoritev: ProfilService,
       private usmerjevalnik: Router,
       private avtentikacijaStoritev: AvtentikacijaService
  ) { }

  public uporabnik: UporabnikData;

  public mojiClanki: Clanek[];

  public priljubljeniClanki: Clanek[];

  public sporocilo: string;

  public odjava(): void {
    this.avtentikacijaStoritev.odjava();
    this.usmerjevalnik.navigateByUrl('/');
  }

  private pridobiUporabnika = (): void => {
       this.sporocilo = "Iščem podatke o uporabniku.";
       this.profilStoritev
          .pridobiUporabnika()
          .then(najdenUporabnik => {
               this.sporocilo = najdenUporabnik ? "" : "Ni najdenega uporabnika"
               this.uporabnik = najdenUporabnik
          })
          .catch(napaka => this.prikaziNapako(napaka))
  }

  private pridobiPriljubljene = (): void => {
       this.sporocilo = "Iščem vaše priljubljene članke.";
       this.profilStoritev
          .pridobiPriljubljene()
          .then(najdeniClanki => {
               this.sporocilo = najdeniClanki.length > 0 ? "" : "Ni najdenih priljubljenih clankov"
               this.priljubljeniClanki = najdeniClanki
          })
          .catch(napaka => this.prikaziNapako(napaka))
  }

  private pridobiMoje = (): void => {
       this.sporocilo = "Iščem vaše članke.";
       this.profilStoritev
          .pridobiMoje()
          .then(najdeniClanki => {
               this.sporocilo = najdeniClanki.length > 0 ? "" : "Ni najdenih mojih clankov"
               this.mojiClanki = najdeniClanki
          })
          .catch(napaka => this.prikaziNapako(napaka))
  }

  private prikaziNapako = (napaka: any): void => {
       this.sporocilo = napaka.message || napaka;
  }

  ngOnInit(): void {
       this.pridobiUporabnika();
       this.pridobiPriljubljene();
       this.pridobiMoje();
  }

}
