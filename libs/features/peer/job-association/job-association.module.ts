import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';

import { reducers } from './reducers';
import { ExchangeJobsEffects, CompanyJobsEffects, JobAssociationModalEffects } from './effects';

import { PfCommonModule, WindowCommunicationService } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { AssociatedCompanyJobsComponent } from './components';
import { CompanyJobsComponent, JobAssociationModalComponent, ExchangeJobsComponent } from './containers';
import { GridDetailPanelComponent } from './components/grid-detail-panel/grid-detail-panel.component';
import { HalfCompleteIconComponent } from './components/half-complete-icon/half-complete-icon.component';
import { CompleteIconComponent } from './components/complete-icon/complete-icon.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    StoreModule.forFeature('feature_job_association', reducers),
    EffectsModule.forFeature([CompanyJobsEffects, ExchangeJobsEffects, JobAssociationModalEffects]),

    // 3rd party
    GridModule,
    TooltipModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
  ],
  declarations: [
    // Components
    AssociatedCompanyJobsComponent,

    // Containers
    CompanyJobsComponent,
    ExchangeJobsComponent,
    JobAssociationModalComponent,
    GridDetailPanelComponent,
    HalfCompleteIconComponent,
    CompleteIconComponent
  ],
  providers: [WindowCommunicationService],
  exports: [JobAssociationModalComponent]
})
export class JobAssociationModule {
}
