import {Component, Input, OnInit} from '@angular/core';
import { ClankiPodatkiService } from '../../storitve/clanki-podatki.service';
import {Clanek} from '../../razredi/clanek';

@Component({
  selector: 'app-homepage-kategorije',
  templateUrl: './homepage-kategorije.component.html',
  styleUrls: ['./homepage-kategorije.component.css']
})
export class HomepageKategorijeComponent implements OnInit {

  @Input() naslovKategorije: string;

  constructor(private clankiPodatkiService: ClankiPodatkiService) { }
  public clanki: Clanek[];
  public sporocilo: string;


  private pridobiAktualneClanke(): void {
    this.sporocilo = "Iščem članke...";
    this.clankiPodatkiService
      .pridobiAktualneClanke(1)
      .then(najdeniClanki => {
        this.sporocilo = najdeniClanki.length > 0 ? "" : "Ni najdenih člankov."
        this.clanki = najdeniClanki
      })
      .catch(napaka => this.prikaziNapako(napaka));
  }

  private pridobiKulturneClanke(): void {
    this.sporocilo = "Iščem članke...";
    this.clankiPodatkiService
      .pridobiKulturneClanke(1)
      .then(najdeniClanki => {
        this.sporocilo = najdeniClanki.length > 0 ? "" : "Ni najdenih člankov."
        this.clanki = najdeniClanki
      })
      .catch(napaka => this.prikaziNapako(napaka));
  }

  private pridobiSportneClanke(): void {
    this.sporocilo = "Iščem članke...";
    this.clankiPodatkiService
      .pridobiSportneClanke(1)
      .then(najdeniClanki => {
        this.sporocilo = najdeniClanki.length > 0 ? "" : "Ni najdenih člankov."
        this.clanki = najdeniClanki
      })
      .catch(napaka => this.prikaziNapako(napaka));
  }


  private posljiClankeKategorije(): void {
    switch (this.naslovKategorije) {
      case 'Danes':
        this.pridobiAktualneClanke()
        break;
      case 'Kultura':
        this.pridobiKulturneClanke()
        break;
      case 'Šport':
        this.pridobiSportneClanke()
        break;
      default:
        console.log("Ta kategorija ni ena izmed izpostavljenih!");
        break;
    }
  }

  private prikaziNapako = (napaka: any): void => {
    this.sporocilo = napaka.message || napaka;
  }

  ngOnInit() {
    this.posljiClankeKategorije();
  }

}
