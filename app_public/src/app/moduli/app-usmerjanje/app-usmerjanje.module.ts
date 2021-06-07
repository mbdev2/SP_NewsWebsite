import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SubsectionComponent } from '../../skupno/komponente/subsection/subsection.component';
import { HomepageComponent } from '../../skupno/komponente/homepage/homepage.component';
import { RezultatiIskanjaComponent } from '../../skupno/komponente/rezultati-iskanja/rezultati-iskanja.component';
import { RegistracijaComponent } from '../../skupno/komponente/registracija/registracija.component';
import { PrijavaComponent } from '../../skupno/komponente/prijava/prijava.component';
import { DbComponent } from '../../skupno/komponente/db/db.component';


import { ProfilComponent } from '../../skupno/komponente/profil/profil.component';
import { ArticleComponent } from '../../skupno/komponente/article/article.component';
import { MediainputComponent } from '../../skupno/komponente/mediainput/mediainput.component';
import { PrikaziVseComponent } from '../../skupno/komponente/prikazi-vse/prikazi-vse.component';
import { UrediProfilComponent } from '../../skupno/komponente/uredi-profil/uredi-profil.component';
import { LiveComponent } from '../../skupno/komponente/live/live.component';
import { VideotekaComponent } from '../../skupno/komponente/videoteka/videoteka.component';
import { OdobritevComponent } from '../../skupno/komponente/odobritev/odobritev.component';
import { AdminPanelComponent } from '../../skupno/komponente/admin-panel/admin-panel.component';

const poti: Routes = [
  {
    path: '',
    component: HomepageComponent
  }, {
    path: 'ekonomija',
    component: SubsectionComponent
  }, {
    path: 'danes',
    component: SubsectionComponent
  }, {
    path: 'covid',
    component: SubsectionComponent
  }, {
    path: 'izobrazba',
    component: SubsectionComponent
  }, {
    path: 'kultura',
    component: SubsectionComponent
  }, {
    path: 'sport',
    component: SubsectionComponent
  }, {
    path: 'rezultatiIskanja',
    component: RezultatiIskanjaComponent
  }, {
    path: 'article/:idClanka',
    component: ArticleComponent
  }, {
    path: 'profile',
    component: ProfilComponent
  }, {
    path: 'registracija',
    component: RegistracijaComponent
  }, {
    path: 'prijava',
    component: PrijavaComponent
  }, {
    path: 'db',
    component: DbComponent
  }, {
    path: 'mediainput',
    component: MediainputComponent
  }, {
    path: 'prikaziVseMoje',
    component: PrikaziVseComponent
  }, {
    path: 'prikaziVsePriljubljene',
    component: PrikaziVseComponent
  }, {
    path: 'profile/uredi',
    component: UrediProfilComponent
  }, {
      path: 'article/uredi/:idClanka',
      component: MediainputComponent
  }, {
     path: 'live',
    component: LiveComponent
  }, {
    path: 'videoteka',
    component: VideotekaComponent
  }, {
    path: 'odobritev',
    component: OdobritevComponent
  }, {
    path: 'admin',
    component: AdminPanelComponent
  }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(poti)
  ],
  exports: [RouterModule]
})
export class AppUsmerjanjeModule { }
