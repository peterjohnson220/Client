import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { ProjectListPageComponent } from './project-list.page/project-list.page';
import { ProjectListPageRoutingModule } from './project-list-page-routing.module';
import {PfDataGridModule} from 'libs/features';
import * as fromFaIcons from './fa-icons';
@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    // store, effects, reducers, etc.
    FontAwesomeModule,

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
