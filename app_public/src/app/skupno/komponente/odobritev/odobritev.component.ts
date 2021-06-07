import { Component, OnInit } from '@angular/core';
import { Clanek } from "../../razredi/clanek";
import { Router } from '@angular/router';
import { Uporabnik, UporabnikData } from "../../razredi/uporabnik";
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';
import { CakalnaVrstaService } from '../../storitve/cakalna-vrsta.service';

@Component({
  selector: 'app-odobritev',
  templateUrl: './odobritev.component.html',
  styleUrls: ['./odobritev.component.css']
})
export class OdobritevComponent implements OnInit {

     public sporocilo: string;

     public odobritevClanki: Clanek[];

  constructor(
       private cakalnaVrstaStoritev: CakalnaVrstaService,
       private usmerjevalnik: Router,
       private avtentikacijaStoritev: AvtentikacijaService
  ) { }

  private pridobiCakalnoVrsto = (): void => {
       this.sporocilo = "Iščem članke, ki čakajo na odobritev.";
       this.cakalnaVrstaStoritev
          .pridobiCakalnoVrsto()
          .then(najdeniClanki => {
               this.sporocilo = najdeniClanki.length > 0 ? "" : "Ni najdenih čakajičih člankov"
               console.log(najdeniClanki);
               this.odobritevClanki = najdeniClanki
               console.log(this.odobritevClanki);
          })
          .catch(napaka => this.prikaziNapako(napaka))
  }

  public objavi(clanek: Clanek): void {
       this.cakalnaVrstaStoritev
          .objaviClanek(clanek._id)
          .then(() => {
               console.log("Clanek uspešno obljavljen in odstranjen iz čakalne vrste.");
               let clanki = this.odobritevClanki.slice(0);
               const indeks = clanki.indexOf(clanek);
               if (indeks > -1) {
                    clanki.splice(indeks, 1)
               }
               this.odobritevClanki = clanki
          })
          .catch(napaka => this.prikaziNapako(napaka));
  }

  public izbrisi(clanek: Clanek): void {
       this.cakalnaVrstaStoritev
          .izbrisiClanek(clanek._id)
          .then(() => {
               console.log("Clanek uspešno izbrisan in odstranjen iz čakalne vrste.");
               let clanki = this.odobritevClanki.slice(0);
               const indeks = clanki.indexOf(clanek);
               if (indeks > -1) {
                    clanki.splice(indeks, 1)
               }
               this.odobritevClanki = clanki
          })
          .catch(napaka => this.prikaziNapako(napaka));
  }


  private prikaziNapako = (napaka: any): void => {
       this.sporocilo = napaka.message || napaka;
  }

  ngOnInit(): void {
       this.pridobiCakalnoVrsto()
  }

}
