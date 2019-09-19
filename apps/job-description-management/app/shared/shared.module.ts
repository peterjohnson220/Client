import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComboBoxModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { GridModule, FilterMenuModule } from '@progress/kendo-angular-grid';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfJobDescriptionManagementModule } from 'libs/features/job-description-management/job-description-management.module';

import { ListAreaFilterDateComponent } from './components/list-area-filter/list-area-filter-date';
import { ListAreaFilterNumberComponent } from './components/list-area-filter/list-area-filter-number';
import { ListAreaFilterPillsComponent } from './components/list-area-filter/list-area-filter-pills';
import { ListAreaFilterSidebarComponent } from './components/list-area-filter/list-area-filter-sidebar';
import { ListAreaFilterTextComponent } from './components/list-area-filter/list-area-filter-text';
import { StatusPillComponent } from './components/status-pill';
import {
  JobDescriptionAppliesToModalComponent
} from './components/modals/job-description-applies-to';
import { JobDescriptionInfoHeaderNoLogoComponent } from './components/info-header/job-description-info-header-no-logo.component';
import { RouteTrackingService } from './services';
import { ListAreaService } from './services/list-area.service';
import { reducers } from './reducers';
import { JobDescriptionAppliesToEffects } from './effects/job-description-appliesto.effects';
import { TemplateListEffects } from './effects/template-list.effects';
import { CompanyFlsaStatusEffects } from './effects/company-flsa-status.effects';
import { JobFamilyEffects } from './effects/job-family.effects';
import {
  JobDescriptionInfoHeaderWithLogoComponent
} from './components/info-header/job-description-info-header-with-logo/job-description-info-header-with-logo.component';
import {ControlTypesEffects} from './effects/control-types.effects';
import { JobDescriptionAppliesToDisplayNamePipe } from './pipes';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('jobDescriptionManagement_shared', reducers),
    EffectsModule.forFeature([
      CompanyFlsaStatusEffects,
      JobDescriptionAppliesToEffects,
      JobFamilyEffects,
      ControlTypesEffects,
      TemplateListEffects
    ]),
    FontAwesomeModule,
    PfJobDescriptionManagementModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    ReactiveFormsModule,
    ComboBoxModule,
    DropDownsModule,
    FormsModule,
    DatePickerModule,
    FilterMenuModule,
    GridModule
  ],
  exports: [
    StatusPillComponent,
    ListAreaFilterPillsComponent,
    ListAreaFilterSidebarComponent,
    JobDescriptionAppliesToModalComponent,
    JobDescriptionInfoHeaderNoLogoComponent,
    JobDescriptionInfoHeaderWithLogoComponent
  ],
  declarations: [
    // Components
    ListAreaFilterDateComponent,
    ListAreaFilterNumberComponent,
    ListAreaFilterPillsComponent,
    ListAreaFilterSidebarComponent,
    ListAreaFilterTextComponent,
    StatusPillComponent,
    JobDescriptionAppliesToModalComponent,
    JobDescriptionInfoHeaderNoLogoComponent,
    JobDescriptionInfoHeaderWithLogoComponent,

    // Pipes
    JobDescriptionAppliesToDisplayNamePipe
  ],
  providers: [
    RouteTrackingService,
    ListAreaService
  ]
})
export class SharedModule { }








