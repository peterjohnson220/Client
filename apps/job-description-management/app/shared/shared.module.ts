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

import { ListAreaFilterDateComponent } from './components/list-area-filter-date.component';
import { ListAreaFilterNumberComponent } from './components/list-area-filter-number.component';
import { ListAreaFilterPillsComponent } from './components/list-area-filter-pills.component';
import { ListAreaFilterSidebarComponent } from './components/list-area-filter-sidebar.component';
import { ListAreaFilterTextComponent } from './components/list-area-filter-text.component';
import { StatusPillComponent } from './components/status-pill.component';
import { JobDescriptionAppliesToModalComponent } from './components/job-description-applies-to-modal.component';
import { RouteTrackingService } from './services';
import { ListAreaService } from './services/list-area.service';
import { reducers } from './reducers';
import { JobDescriptionAppliesToEffects } from './effects/job-description-appliesto.effects';
import { TemplateListEffects } from './effects/template-list.effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('jobDescriptionManagement_shared', reducers),
    EffectsModule.forFeature([
      JobDescriptionAppliesToEffects,
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
    JobDescriptionAppliesToModalComponent
  ],
  declarations: [
    // Components
    ListAreaFilterDateComponent,
    ListAreaFilterNumberComponent,
    ListAreaFilterPillsComponent,
    ListAreaFilterSidebarComponent,
    ListAreaFilterTextComponent,
    StatusPillComponent,
    JobDescriptionAppliesToModalComponent
  ],
  providers: [
    RouteTrackingService,
    ListAreaService
  ]
})
export class SharedModule { }








