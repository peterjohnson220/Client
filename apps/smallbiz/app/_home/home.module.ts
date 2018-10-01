import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
// import { reducers } from './shared/reducers';

import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './containers/pages';

@NgModule({
  declarations: [
    HomePageComponent],
  imports: [
    // Angular
    FormsModule,
    CommonModule,

    // Third Party
    // StoreModule.forFeature('peer_shared', reducers),

    // Routing
    HomeRoutingModule
  ]
})
export class HomeModule { }
