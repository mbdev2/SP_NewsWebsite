import { Component, OnInit } from '@angular/core';
import { ProfilService } from "../../storitve/profil.service";
import { Clanek } from "../../razredi/clanek";
import { Uporabnik, UporabnikData } from "../../razredi/uporabnik";
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';
import { Router } from '@angular/router';
import { PovezavaService } from '../../storitve/povezava.service';


@Component({
  selector: 'app-uredi-profil',
  templateUrl: './uredi-profil.component.html',
  styleUrls: ['./uredi-profil.component.css']
})
export class UrediProfilComponent implements OnInit {

     public posodobljenUporabnik: UporabnikData = {
        email: "",
        ime: "",
        priimek: "",
        vzdevek: "",
        telstevilka: "",
        nivodostopa: "",
        priljubljeniClanki: []
   };

     public jePovezava(): boolean {
          return this.povezavaStoritev.jePovezava;
     }

  constructor(
       private profilStoritev: ProfilService,
       private avtentikacijaStoritev: AvtentikacijaService,
       private usmerjevalnik: Router,
       private povezavaStoritev: PovezavaService
  ) { }

  public uporabnik: UporabnikData;

  public sporocilo: string;

  public geslo: string;

  private pridobiUporabnika = (): void => {
       this.sporocilo = "Iščem podatke o uporabniku.";
       this.geslo = "";
       this.profilStoritev
          .pridobiUporabnika()
          .then(najdenUporabnik => {
               this.sporocilo = najdenUporabnik ? "" : "Ni najdenega uporabnika";
               this.uporabnik = najdenUporabnik
               this.posodobljenUporabnik = najdenUporabnik
          })
          .catch(napaka => this.sporocilo = napaka)
  }

  public posodobiProfil(): void {
       this.sporocilo = "Posodabljam vaše podatke";
       this.profilStoritev
        .posodobiUporabnika(this.posodobljenUporabnik, this.geslo)
        .then((uporabnik: UporabnikData) => {
             console.log("Uporabnik posodobljen");
             if (this.geslo == '') {
                  window.location.href="/profile";
             } else {
                  this.odjava()
             }
        })
        .catch(napaka => this.sporocilo = napaka);
 }

 public odjava(): void {
   this.avtentikacijaStoritev.odjava();
   window.location.href="/";
 }

 public zbrisiUporabnika(): void {
     this.profilStoritev
          .zbrisiUporabnika()
          .then(() => {
               console.log("Uporabnik uspešno izbrisan.");
               this.odjava();
          })
          .catch(napaka => this.sporocilo = napaka)
 }

  ngOnInit(): void {
       this.pridobiUporabnika()
  }

}
