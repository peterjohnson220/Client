import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';

import { reducers } from './reducers';
import {ExchangeJobsEffects, CompanyJobsEffects} from './effects';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';

import { CompanyJobsComponent, JobAssociationModalComponent, ExchangeJobsComponent } from './containers';



@NgModule({
  imports: [
    // Angular
    CommonModule,
    StoreModule.forFeature('feature_job_association', reducers),
    EffectsModule.forFeature([CompanyJobsEffects, ExchangeJobsEffects]),

    // 3rd party
    GridModule,
    TooltipModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
  ],
  declarations: [
    // Components

    // Containers
    CompanyJobsComponent,
    ExchangeJobsComponent,
    JobAssociationModalComponent

    // Pages
  ],
  exports: [JobAssociationModalComponent]
})
export class JobAssociationModule {
}
