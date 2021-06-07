import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SHRAMBA_BRSKALNIKA } from '../razredi/shramba';

@Injectable({
  providedIn: 'root'
})
export class ZunanjiService {

  constructor(private httpClient: HttpClient) { }

  private apiUrl = environment.apiUrl;

  public sendGetRequest(){
    return this.httpClient.get(this.apiUrl+"/videoteka");
  }
}
