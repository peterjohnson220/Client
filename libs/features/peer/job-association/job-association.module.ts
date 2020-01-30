import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule, RowFilterModule} from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { reducers } from './reducers';
import { ExchangeJobsEffects, CompanyJobsEffects, JobAssociationModalEffects } from './effects';

import { PfCommonModule, WindowCommunicationService } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import * as fromFaIcons from './fa-icons';
import { AssociatedCompanyJobsComponent } from './components';
import { CompanyJobsComponent, JobAssociationModalComponent, ExchangeJobsComponent } from './containers';
import { GridDetailPanelComponent } from './components/grid-detail-panel/grid-detail-panel.component';
import { HalfCompleteIconComponent } from './components/half-complete-icon/half-complete-icon.component';
import { CompleteIconComponent } from './components/complete-icon/complete-icon.component';
import { UnsavedChangesWarningComponent } from './components/unsaved-changes-warning/unsaved-changes-warning.component';

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
    FontAwesomeModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    RowFilterModule
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
    CompleteIconComponent,
    UnsavedChangesWarningComponent
  ],
  providers: [WindowCommunicationService],
  exports: [JobAssociationModalComponent]
})
export class JobAssociationModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
