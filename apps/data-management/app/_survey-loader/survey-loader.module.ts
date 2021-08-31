import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule, NgbTooltipModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { UploadModule } from '@progress/kendo-angular-upload';

import { PfCommonModule } from 'libs/core';
import { PfFieldMapperModule } from 'libs/features/loaders/org-data-loader';
import { PfSiteAdminRouteModule } from 'libs/features/site-admin';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import * as fromFaIcons from './fa-icons';
import { SurveyLoadersRoutingModule } from './survey-loader-routing.module';

import { SurveyLoaderComponent, UploadSurveyFileComponent } from './containers';
import { reducers } from './reducers';
import { UploadSurveyFileEffects, SurveyLoaderEffects } from './effects';
import { SurveyLoaderTabComponent } from './components';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropDownsModule,

    // Routing
    SurveyLoadersRoutingModule,

    // 3rd Party
    DragulaModule.forRoot(),
    StoreModule.forFeature('surveyloader_main', reducers),
    EffectsModule.forFeature([
      UploadSurveyFileEffects,
      SurveyLoaderEffects
    ]),
    FontAwesomeModule,
    NgbTooltipModule,
    NgbAlertModule,
    NgbCollapseModule,
    UploadModule,
    LayoutModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfFieldMapperModule,
    PfSiteAdminRouteModule
  ],
  declarations: [
    // Pages

    // Containers
    UploadSurveyFileComponent,
    SurveyLoaderTabComponent,


    // Components
    SurveyLoaderComponent
  ]
})
export class SurveyLoaderModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
