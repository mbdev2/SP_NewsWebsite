import { Component, OnInit } from '@angular/core';
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';
import { Uporabnik } from '../../razredi/uporabnik';


@Component({
  selector: 'app-db',
  templateUrl: './db.component.html',
  styleUrls: ['./db.component.css']
})
export class DbComponent implements OnInit {

  constructor(
    private avtentikacijaStoritev: AvtentikacijaService,
  ) { }

  public odjavaBrisi(): void {
    this.avtentikacijaStoritev.brisiDBA();
    if (this.avtentikacijaStoritev.jePrijavljen()){
      this.avtentikacijaStoritev.odjava();
    }
  }

  public napolni(): void {
    this.avtentikacijaStoritev.polniDBA();
  }

  ngOnInit(): void {
  }

}
