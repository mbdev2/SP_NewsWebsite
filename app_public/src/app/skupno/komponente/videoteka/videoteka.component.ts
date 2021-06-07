import { Component, OnInit } from '@angular/core';
import { ZunanjiService } from '../../storitve/zunanji.service';
import { PovezavaService } from '../../storitve/povezava.service';

@Component({
  selector: 'app-videoteka',
  templateUrl: './videoteka.component.html',
  styleUrls: ['./videoteka.component.css']
})
export class VideotekaComponent implements OnInit {

  feed = [];

  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }

  constructor(
       private ZunanjiService: ZunanjiService,
       private povezavaStoritev: PovezavaService
  ) { }

  public sporocilo: string;

  ngOnInit(): void {
    this.ZunanjiService
     .sendGetRequest()
     .subscribe(
          (data: any[]) => {
                this.feed = data;
          },
          err => {
               this.sporocilo = err
          }
     )
  }

}
