import { NgModule } from '@angular/core';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { ListAreaService, JobDescriptionManagementService, JobDescriptionManagementDnDService } from 'libs/features/job-description-management/services';

import * as fromFaIcons from './fa-icons';
import {StoreModule} from '@ngrx/store';
import {reducers} from './reducers';
import {EffectsModule} from '@ngrx/effects';
import {
  CompanyFlsaStatusEffects,
  CompanyLogoEffects,
  ControlTypesEffects,
  JobDescriptionAppliesToEffects,
  JobDescriptionLibraryEffects,
  JobFamilyEffects,
  SharedWorkflowEffects,
  TemplateListEffects,
  WorkflowConfigEffects
} from 'libs/features/job-description-management/effects/';

@NgModule({
  imports: [
    StoreModule.forFeature('jobDescriptionManagement_shared', reducers),
    EffectsModule.forFeature([
      CompanyFlsaStatusEffects,
      CompanyLogoEffects,
      ControlTypesEffects,
      JobDescriptionAppliesToEffects,
      JobDescriptionLibraryEffects,
      JobFamilyEffects,
      SharedWorkflowEffects,
      TemplateListEffects,
      WorkflowConfigEffects
    ]),
    FontAwesomeModule
  ],
  declarations: [],
  exports: [],
  providers: [
    ListAreaService,
    JobDescriptionManagementService,
    JobDescriptionManagementDnDService
  ]
})
export class PfJobDescriptionManagementModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
