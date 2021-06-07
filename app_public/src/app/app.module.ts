import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppUsmerjanjeModule } from './moduli/app-usmerjanje/app-usmerjanje.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ChartsModule } from 'ng2-charts';

import { HomepageKategorijeComponent } from './skupno/komponente/homepage-kategorije/homepage-kategorije.component';
import { OgrodjeComponent } from './skupno/komponente/ogrodje/ogrodje.component';
import { GlavaComponent } from './skupno/komponente/glava/glava.component';
import { SubsectionComponent } from './skupno/komponente/subsection/subsection.component';
import { HomepageComponent } from './skupno/komponente/homepage/homepage.component';
import { RezultatiIskanjaComponent } from './skupno/komponente/rezultati-iskanja/rezultati-iskanja.component';
import { ProfilComponent } from './skupno/komponente/profil/profil.component';
import { JeKajClankovPipe } from './skupno/cevi/je-kaj-clankov.pipe';
import { ArticleComponent } from './skupno/komponente/article/article.component';
import { JeMojKomentarPipe } from './skupno/cevi/je-moj-komentar.pipe';
import { RegistracijaComponent } from './skupno/komponente/registracija/registracija.component';
import { PrijavaComponent } from './skupno/komponente/prijava/prijava.component';
import { DbComponent } from './skupno/komponente/db/db.component';
import { NajnovejsiNaprejPipe } from './skupno/cevi/najnovejsi-naprej.pipe';
import { MediainputComponent } from './skupno/komponente/mediainput/mediainput.component';
import { PrikaziVseComponent } from './skupno/komponente/prikazi-vse/prikazi-vse.component';
import { UrediProfilComponent } from './skupno/komponente/uredi-profil/uredi-profil.component';
import { LiveComponent } from './skupno/komponente/live/live.component';
import { VideotekaComponent } from './skupno/komponente/videoteka/videoteka.component';
import { ReturnIDonlyPipe } from './skupno/cevi/return-idonly.pipe';
import { DovoliUrlPipe } from './skupno/cevi/dovoli-url.pipe';
import { OdobritevComponent } from './skupno/komponente/odobritev/odobritev.component';
import { AdminPanelComponent } from './skupno/komponente/admin-panel/admin-panel.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    HomepageKategorijeComponent,
    OgrodjeComponent,
    GlavaComponent,
    SubsectionComponent,
    HomepageComponent,
    RezultatiIskanjaComponent,
    ProfilComponent,
    JeKajClankovPipe,
    ArticleComponent,
    JeMojKomentarPipe,
    RegistracijaComponent,
    PrijavaComponent,
    DbComponent,
    NajnovejsiNaprejPipe,
    MediainputComponent,
    PrikaziVseComponent,
    UrediProfilComponent,
    LiveComponent,
    VideotekaComponent,
    ReturnIDonlyPipe,
    DovoliUrlPipe,
    OdobritevComponent,
    AdminPanelComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppUsmerjanjeModule,
    PaginationModule.forRoot(),
    ChartsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [OgrodjeComponent]
})
export class AppModule { }
