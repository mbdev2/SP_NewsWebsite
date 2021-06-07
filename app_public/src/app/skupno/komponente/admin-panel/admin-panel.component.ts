import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ZgodovinaService } from '../../storitve/zgodovina.service';
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';
import { ProfilService } from "../../storitve/profil.service";
import { Uporabnik, UporabnikData } from "../../razredi/uporabnik";
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';



@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

     public sporocilo: string;

     public uporabniki: UporabnikData[];

  constructor(
       private profilStoritev: ProfilService,
       private avtentikacijaStoritev: AvtentikacijaService
  ) { }

  // GRAFICNI PRIKAZ PODATKOV
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public vrednosti: number[] = [];

  public barChartData: ChartDataSets[] = [
   { data: this.vrednosti, label: 'Št. priljubljenih člankov', backgroundColor: 'rgba(121, 176, 218, 1.0)' }
 ];;

  private pridobiVseUporabnike = (): void => {
       this.sporocilo = "Iščem podatke o uporabnikih.";
       this.profilStoritev
          .pridobiVseUporabnike()
          .then(najdeniUporabniki => {
               this.sporocilo = najdeniUporabniki.length > 0 ? "" : "Ni najdenih uporabnikov."
               this.uporabniki = najdeniUporabniki
               for (var uporabnik of najdeniUporabniki) {
                    this.barChartLabels.push(uporabnik.vzdevek);
                    this.vrednosti.push(uporabnik.priljubljeniClanki.length);
               }
               this.barChartData = [
                 { data: this.vrednosti, label: 'Št. priljubljenih člankov', backgroundColor: 'rgba(121, 176, 218, 1.0)' }
               ];
               console.log(this.barChartData);
               console.log(this.vrednosti);
          })
          .catch(napaka => this.prikaziNapako(napaka))
  }

  public izbrisiTegaUporabnika(uporabnik: UporabnikData, idUporabnika: string): void {
      this.profilStoritev
           .zbrisiTegaUporabnika(idUporabnika)
           .then(() => {
                console.log("Uporabnik uspešno izbrisan.");
                let uporabniki = this.uporabniki.slice(0);
                const indeks = uporabniki.indexOf(uporabnik);
                if (indeks > -1) {
                     uporabniki.splice(indeks, 1)
                }
                this.uporabniki = uporabniki;
           })
           .catch(napaka => this.prikaziNapako(napaka))
  }

  public posodobiUporabnika(uporabnik): void {
       this.profilStoritev
        .posodobiTegaUporabnika(uporabnik)
        .then(posodobljen => {
             console.log("Uporabnik posodobljen.");
             let uporabniki = this.uporabniki.slice(0);
             var indeks = this.uporabniki.indexOf(uporabnik);
             this.uporabniki[indeks] = posodobljen;
             console.log(this.uporabniki)
        })
        .catch(napaka => this.sporocilo = napaka);
  }


  private prikaziNapako = (napaka: any): void => {
       this.sporocilo = napaka.message || napaka;
  }

  ngOnInit(): void {
       this.pridobiVseUporabnike();
  }

}
