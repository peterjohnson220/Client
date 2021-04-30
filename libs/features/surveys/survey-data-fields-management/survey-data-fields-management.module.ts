import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import * as fromFaIcons from './fa-icons';
import { CurrentFieldsPanelComponent, SurveyDataFieldsComponent } from './components';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    NgbModule,
    FontAwesomeModule,
    
    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
  ],
  declarations: [
    SurveyDataFieldsComponent,
    CurrentFieldsPanelComponent
  ],
  exports: [
    SurveyDataFieldsComponent
  ]
})
export class SurveyDataFieldsManagementModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}