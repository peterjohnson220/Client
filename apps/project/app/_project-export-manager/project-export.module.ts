import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ProjectExportManagerComponent } from './project-export-manager/project-export-manager.component';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';

import { reducers } from './reducers';
import { ProjectExportManagerEffects } from './effects';


@NgModule({
  declarations: [
    // Feature
    ProjectExportManagerComponent
  ],
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('feature_project_export_manager', reducers),
    EffectsModule.forFeature([
      ProjectExportManagerEffects
    ]),
    FontAwesomeModule,
    LayoutModule,
    GridModule,
    DropDownListModule,

    // Payscale
    PfCommonUIModule,
    PfCommonModule,
    PfFormsModule
  ],
  exports: [
    ProjectExportManagerComponent
  ]
})

export class ProjectExportModule {
  constructor() {}
}
