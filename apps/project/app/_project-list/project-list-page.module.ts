import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {NgbDropdownModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import { PfDataGridModule } from 'libs/features';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';

import { ProjectListPageComponent } from './project-list.page/project-list.page';
import { ProjectListPageRoutingModule } from './project-list-page-routing.module';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';

import { ProjectListPageEffects } from './effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('projectListPageMain', reducers),
    EffectsModule.forFeature([
        ProjectListPageEffects
      ]
    ),
    FontAwesomeModule,
    NgbModule,
    NgbDropdownModule,

    // Routing
    ProjectListPageRoutingModule,

    // Payfactors
    PfDataGridModule,
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Pages
    ProjectListPageComponent
  ]
})
export class ProjectListPageModule {
  constructor(library: FaIconLibrary) {
     library.addIcons(...fromFaIcons.faIcons);
  }
}
