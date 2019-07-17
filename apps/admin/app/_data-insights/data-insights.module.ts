import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { StandardReportsListPageComponent } from './containers';
import { StandardReportsListComponent } from './components';
import { DataInsightsRoutingModule } from './data-insights-routing.module';
import {reducers} from './reducers';
import { StandardReportsListPageEffects } from './effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('dataInsightsManagement_main', reducers),
    EffectsModule.forFeature([
      StandardReportsListPageEffects
    ]),
    GridModule,

    // Routing
    DataInsightsRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Components
    StandardReportsListComponent,
    // Pages
    StandardReportsListPageComponent
  ]
})
export class DataInsightsModule { }








