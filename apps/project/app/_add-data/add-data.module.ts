import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveysPageComponent } from './containers';
import { AddDataRoutingModule } from './add-data-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    AddDataRoutingModule
  ],
  declarations: [
    // Pages
    SurveysPageComponent
  ]
})
export class AddDataModule { }







