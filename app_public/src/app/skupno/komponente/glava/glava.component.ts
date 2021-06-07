import { Component, OnInit } from '@angular/core';
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';
import { Uporabnik } from '../../razredi/uporabnik';
import { ZgodovinaService } from '../../storitve/zgodovina.service';
import { Router } from '@angular/router';
import { PovezavaService } from '../../storitve/povezava.service';


@Component({
  selector: 'app-glava',
  templateUrl: './glava.component.html',
  styleUrls: ['./glava.component.css']
})
export class GlavaComponent implements OnInit {

  constructor(
    private avtentikacijaStoritev: AvtentikacijaService,
    private zgodovinaStoritev: ZgodovinaService,
    private usmerjevalnik: Router,
    private povezavaStoritev: PovezavaService
  ) { }


  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }

  public odjava(): void {
    this.avtentikacijaStoritev.odjava();
    this.usmerjevalnik.navigateByUrl('/');
  }

  public jePrijavljen(): boolean {
    return this.avtentikacijaStoritev.jePrijavljen();
  }

  public vrniUporabnika(): string {
    const uporabnik: Uporabnik = this.avtentikacijaStoritev.vrniTrenutnegaUporabnika();
    return uporabnik ? uporabnik.ime : 'Gost';
  }

  public prikaziRezultateIskanja(data): void {
    let niz = data.iskalniNiz;
    this.usmerjevalnik.navigate(['rezultatiIskanja'], { queryParams: { iskalniNiz: niz } });
  }



  ngOnInit(): void {
  }


}

