import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfSearchModule } from 'libs/features/search/search';
import { SurveySearchModule } from 'libs/features/surveys/survey-search';
import {WindowCommunicationService} from 'libs/core/services';
import {AddDataModule} from 'libs/features/pricings/add-data';

import { AddSurveyDataPageComponent } from './containers';
import { AddDataPageRoutingModule } from './add-data-page-routing.module';



@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // Routing
    AddDataPageRoutingModule,

    // Payfactors
    SurveySearchModule,
    PfCommonUIModule,
    PfFormsModule,
    PfSearchModule,
    AddDataModule
  ],
  declarations: [
    // Pages
    AddSurveyDataPageComponent
  ],
  providers: [WindowCommunicationService]
})
export class AddDataPageModule { }
