import { Component, OnInit } from '@angular/core';
import {ClankiPodatkiService} from '../../storitve/clanki-podatki.service';
import {Clanek} from '../../razredi/clanek';
import { ActivatedRoute } from '@angular/router';
import { ZunanjiService } from '../../storitve/zunanji.service';

@Component({
  selector: 'app-rezultati-iskanja',
  templateUrl: './rezultati-iskanja.component.html',
  styleUrls: ['./rezultati-iskanja.component.css']
})
export class RezultatiIskanjaComponent implements OnInit {

  constructor(private clankiPodatkiService: ClankiPodatkiService,
              private pot: ActivatedRoute,
              private ZunanjiService: ZunanjiService) { }

  public clanki: Clanek[];
  videos = [];
  public sporocilo: string;

  private pridobiVideoposnetke(iskalniNiz): void {
      this.videos = [];
      this.ZunanjiService.sendGetRequest().subscribe((data: any[]) => {
        this.sporocilo = data.length > 0 ? "" : "Ni najdenih videoposnetkov."
        if(iskalniNiz == ''){
          this.videos = [];
        }
        else {
          for (let i in data) {
            let match = (String(data[i].title)).toLowerCase().includes(iskalniNiz.toLowerCase());
            if (match) {
              this.videos.push(data[i])
            }
          }
        }
      }, err => {
        this.sporocilo = err
      });
  }

  private pridobiRezultateIskanja(): void {
    this.sporocilo = "Iščem rezultate iskanja...";
    this.pot.queryParams.subscribe(params => {
      let iskalniNiz = params['iskalniNiz'];
      this.pridobiVideoposnetke(iskalniNiz)
      if(iskalniNiz==''){
        this.clanki = [];
      }
      else {
        this.clankiPodatkiService
          .pridobiRezultateIskanja(iskalniNiz)
          .then(najdeniClanki => {
            this.sporocilo = najdeniClanki.length > 0 ? "" : "Ni najdenih člankov."
            this.clanki = najdeniClanki
          })
          .catch(napaka => this.prikaziNapako(napaka));
      }
      });
  }

  private prikaziNapako = (napaka: any): void => {
    this.sporocilo = napaka.message || napaka;
  }


  ngOnInit(): void {
    this.pridobiRezultateIskanja()
  }

}
