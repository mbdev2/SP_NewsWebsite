import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';
import { ZgodovinaService } from '../../storitve/zgodovina.service';
import { PovezavaService } from '../../storitve/povezava.service';

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.css']
})
export class PrijavaComponent implements OnInit {
  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }

  public napakaNaObrazcu: string = "";

  public prijavniPodatki = {
    ime: "",
    email: "",
    geslo: ""
  }

  public vsebinaStrani = {
    glava: {
      naslov: "Prijava v eTV app",
      podnaslov: ""
    },
    stranskaOrodnaVrstica: ""
  }

  constructor(
    private usmerjevalnik: Router,
    private avtentikacijaStoritev: AvtentikacijaService,
    private zgodovinaStoritev: ZgodovinaService,
    private povezavaStoritev: PovezavaService
  ) { }

  public posiljanjePodatkov(): void {
   this.napakaNaObrazcu = "";
   if (
     !this.prijavniPodatki.email ||
     !this.prijavniPodatki.geslo
   ) {
     this.napakaNaObrazcu = "Zahtevani so vsi podatki, prosim poskusite znova!";
   } else {
     this.izvediPrijavo();
   }
 }

 private izvediPrijavo(): void {
   this.avtentikacijaStoritev
     .prijava(this.prijavniPodatki)
     .then(() => {
       this.usmerjevalnik.navigateByUrl(this.zgodovinaStoritev.vrniPredhodnjeUrlNasloveBrezPrijaveInRegistracije());
     })
     .catch(sporocilo => this.napakaNaObrazcu = sporocilo);
 }

  ngOnInit(): void {
  }

}
