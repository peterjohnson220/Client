import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UploadModule } from '@progress/kendo-angular-upload';
import { GridModule } from '@progress/kendo-angular-grid';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DragulaModule } from 'ng2-dragula';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfCompanySelectorModule } from 'libs/features/company/company-selector/company-selector.module';

import { JobsHierarchyPageComponent, JobsHierarchyFormComponent } from './containers';
import { JobsHierarchyRoutingModule } from './jobs-hierarchy-routing.module';
import { reducers } from './reducers';
import { JobsHierarchyEffects } from './effects';
import { JobLevelHierarchyDndService } from './services';

@NgModule({
  declarations: [JobsHierarchyPageComponent, JobsHierarchyFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonsModule,

    DropDownsModule,
    FontAwesomeModule,
    UploadModule,
    GridModule,
    StoreModule.forFeature('jobsHierarchyPage_main', reducers),
    EffectsModule.forFeature([JobsHierarchyEffects]),
    DragulaModule.forRoot(),

    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfCompanySelectorModule,

    JobsHierarchyRoutingModule
  ],
  providers: [JobLevelHierarchyDndService]
})
export class JobsHierarchyModule { }
