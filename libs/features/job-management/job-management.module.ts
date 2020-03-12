import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import * as fromFaIcons from './fa-icons';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { JobManagementEffects } from './effects/job-management.effects';
import { reducers } from './reducers';

import { JobManagementComponent } from './job-management/job-management.component';
import { JobFormComponent } from './containers';
import { JobContainerComponent } from './containers/job-container/job-container.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JobAttachmentsComponent } from './containers/job-attachments/job-attachments.component';
import { JobStructuresComponent } from './containers/job-structures/job-structures.component';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('feature_job_management', reducers),
    EffectsModule.forFeature([
      JobManagementEffects,
    ]),
    GridModule,
    LayoutModule,
    DropDownsModule,
    NgbModule,
    FontAwesomeModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
  ],
  declarations: [
    // Feature
    JobManagementComponent,

    // Components
    JobFormComponent,
    JobContainerComponent,
    JobAttachmentsComponent,
    JobStructuresComponent
  ],
  exports: [
    JobManagementComponent,
  ]
})

export class JobManagementModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
