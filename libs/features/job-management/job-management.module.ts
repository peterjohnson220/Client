import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import * as fromFaIcons from './fa-icons';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { JobManagementEffects } from './effects/job-management.effects';
import { reducers } from './reducers';

import { JobManagementComponent } from './job-management/job-management.component';
import { NotesManagerModule } from '../notes-manager';
import {
  StandardFieldsComponent,
  UserDefinedFieldsComponent,
  JobContainerComponent,
  JobAttachmentsComponent,
  JobStructuresComponent
} from './containers';

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
    PerfectScrollbarModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    NotesManagerModule,
  ],
  declarations: [
    // Feature
    JobManagementComponent,

    // Components
    StandardFieldsComponent,
    UserDefinedFieldsComponent,
    JobContainerComponent,
    JobAttachmentsComponent,
    JobStructuresComponent,
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
