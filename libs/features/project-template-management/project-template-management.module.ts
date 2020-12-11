import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { ProjectTemplateManagementEffects } from './effects/project-template-management.effects';
import { reducers } from './reducers';
import { ProjectTemplateManagementComponent, ProjectTemplateFieldsComponent } from './containers';
import * as fromFaIcons from './fa-icons';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('feature_project_template_management', reducers),
    EffectsModule.forFeature([
      ProjectTemplateManagementEffects,
    ]),
    NgbModule,
    FontAwesomeModule,
    NumericTextBoxModule,
    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
  ],
  declarations: [
    // Feature
    ProjectTemplateManagementComponent,
    ProjectTemplateFieldsComponent
  ],
  exports: [
    ProjectTemplateManagementComponent,
    ProjectTemplateFieldsComponent
  ]
})

export class ProjectTemplateManagementModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
