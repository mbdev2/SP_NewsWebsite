import { Component, OnInit } from '@angular/core';
import { ClankiPodatkiService } from '../../storitve/clanki-podatki.service';
import {Clanek} from '../../razredi/clanek';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
@Component({
  selector: 'app-subsection',
  templateUrl: './subsection.component.html',
  styleUrls: ['./subsection.component.css']
})
export class SubsectionComponent implements OnInit {


  constructor(private clankiPodatkiService: ClankiPodatkiService,
              private pot: ActivatedRoute,
              private router: Router) {
  }

  public clanki: Clanek[];
  public sporocilo: string;
  path: any;
  naslovKategorije = '';
  steviloRezultatov : number;
  page = 1;

  private pridobiCovidClanke(): void {
    this.sporocilo = "Iščem članke...";
    this.naslovKategorije = 'Covid';
    this.clankiPodatkiService
      .pridobiCovidClanke(this.page)
      .then(najdeniClanki => {
        this.sporocilo = najdeniClanki.length > 0 ? "" : "Ni najdenih člankov."
        this.clanki = najdeniClanki
      })
      .catch(napaka => this.prikaziNapako(napaka));
    this.clankiPodatkiService
      .pridobiSteviloClankovVKategoriji(this.naslovKategorije)
      .then(steviloRezultatov => this.steviloRezultatov = steviloRezultatov)
      .catch(napaka => this.prikaziNapako(napaka));
  }

  private pridobiIzobrazevalneClanke(): void {
    this.sporocilo = "Iščem članke...";
    this.naslovKategorije = 'Izobrazba';
    this.clankiPodatkiService
      .pridobiIzobrazevalneClanke(this.page)
      .then(najdeniClanki => {
        this.sporocilo = najdeniClanki.length > 0 ? "" : "Ni najdenih člankov."
        this.clanki = najdeniClanki
      })
      .catch(napaka => this.prikaziNapako(napaka));
    this.clankiPodatkiService
      .pridobiSteviloClankovVKategoriji(this.naslovKategorije)
      .then(steviloRezultatov => this.steviloRezultatov = steviloRezultatov)
      .catch(napaka => this.prikaziNapako(napaka));
  }

  private pridobiEkonomskeClanke(): void {
    this.sporocilo = "Iščem članke...";
    this.naslovKategorije = 'Ekonomija';
    this.clankiPodatkiService
      .pridobiEkonomskeClanke(this.page)
      .then(najdeniClanki => {
        this.sporocilo = najdeniClanki.length > 0 ? "" : "Ni najdenih člankov."
        this.clanki = najdeniClanki
      })
      .catch(napaka => this.prikaziNapako(napaka));
    this.clankiPodatkiService
      .pridobiSteviloClankovVKategoriji(this.naslovKategorije)
      .then(steviloRezultatov => this.steviloRezultatov = steviloRezultatov)
      .catch(napaka => this.prikaziNapako(napaka));
  }

  private pridobiAktualneClanke(): void {
    this.sporocilo = "Iščem članke...";
    this.naslovKategorije = 'Danes';
    this.clankiPodatkiService
      .pridobiAktualneClanke(this.page)
      .then(najdeniClanki => {
        this.sporocilo = najdeniClanki.length > 0 ? "" : "Ni najdenih člankov."
        this.clanki = najdeniClanki
      })
      .catch(napaka => this.prikaziNapako(napaka));
    this.clankiPodatkiService
      .pridobiSteviloClankovVKategoriji(this.naslovKategorije)
      .then(steviloRezultatov => this.steviloRezultatov = steviloRezultatov)
      .catch(napaka => this.prikaziNapako(napaka));
  }

  private pridobiKulturneClanke(): void {
    this.sporocilo = "Iščem članke...";
    this.naslovKategorije = 'Kultura';
    this.clankiPodatkiService
      .pridobiKulturneClanke(this.page)
      .then(najdeniClanki => {
        this.sporocilo = najdeniClanki.length > 0 ? "" : "Ni najdenih člankov."
        this.clanki = najdeniClanki
      })
      .catch(napaka => this.prikaziNapako(napaka));
    this.clankiPodatkiService
      .pridobiSteviloClankovVKategoriji(this.naslovKategorije)
      .then(steviloRezultatov => this.steviloRezultatov = steviloRezultatov)
      .catch(napaka => this.prikaziNapako(napaka));
  }

  private pridobiSportneClanke(): void {
    this.sporocilo = "Iščem članke...";
    this.naslovKategorije = 'Šport';
    this.clankiPodatkiService
      .pridobiSportneClanke(this.page)
      .then(najdeniClanki => {
        this.sporocilo = najdeniClanki.length > 0 ? "" : "Ni najdenih člankov."
        this.clanki = najdeniClanki
      })
      .catch(napaka => this.prikaziNapako(napaka));
    this.clankiPodatkiService
      .pridobiSteviloClankovVKategoriji(this.naslovKategorije)
      .then(steviloRezultatov => this.steviloRezultatov = steviloRezultatov)
      .catch(napaka => this.prikaziNapako(napaka));
  }

  private posljiClankeKategorije(): void {
    this.path = this.router.url.split('/')[1];
    switch (this.path) {
      case 'covid':
        this.pridobiCovidClanke()
        break;
      case 'izobrazba':
        this.pridobiIzobrazevalneClanke()
        break;
      case 'ekonomija':
        this.pridobiEkonomskeClanke()
        break;
      case 'danes':
        this.pridobiAktualneClanke()
        break;
      case 'kultura':
        this.pridobiKulturneClanke()
        break;
      case 'sport':
        this.pridobiSportneClanke()
        break;
      default:
        console.log("Ta kategorija nea obstaja!");
        break;
    }
  }



  pageChanged(event: PageChangedEvent): void {
    this.page = event.page;
    this.posljiClankeKategorije();
  }

  private prikaziNapako = (napaka: any): void => {
    this.sporocilo = napaka.message || napaka;
  }

  ngOnInit() {
    this.posljiClankeKategorije();
  }

}
