import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfCompanySelectorModule } from 'libs/features/company/company-selector/company-selector.module';

import { JobsHierarchyPageComponent } from './containers/pages/jobs-hierarchy-page/jobs-hierarchy.page';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { JobsHierarchyFormComponent } from './containers/jobs-hierarchy-form/jobs-hierarchy-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { JobsHierarchyRoutingModule } from './jobs-hierarchy-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UploadModule } from '@progress/kendo-angular-upload';
import { GridModule } from '@progress/kendo-angular-grid';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { JobsHierarchyEffects } from './effects/jobs-hierarchy.effects';

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

    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfCompanySelectorModule,

    JobsHierarchyRoutingModule
  ]
})
export class JobsHierarchyModule { }
