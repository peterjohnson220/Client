import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgDataLoaderRoutingModule } from './org-data-loader-routing.module';
import { ManageFieldMappingsPageComponent } from './containers/pages';
import { PfCommonUIModule } from '../../../../libs/ui/common';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FieldMapperComponent } from './containers/field-mapper/field-mapper.component';
import { UploadModule } from '@progress/kendo-angular-upload';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { FormsModule } from '@angular/forms';
import { CompanySelectorEffects } from './effects/company-selector.effects';
import { CompanySelectorComponent } from './containers/company-selector/company-selector.component';
import { OrgDataFieldMappingsEffects } from './effects/org-data-field-mappings.effects';

@NgModule({
  imports:      [
    // Angular
    CommonModule,
    FormsModule,

    // 3rd Party
    StoreModule.forFeature('orgDataLoader', reducers),
    EffectsModule.forFeature([CompanySelectorEffects, OrgDataFieldMappingsEffects]),

    // 3rd Party
    LayoutModule,
    UploadModule,

    // Routing
    OrgDataLoaderRoutingModule,

    // Payfactors
    PfCommonUIModule
  ],
  declarations: [
    // Pages
    ManageFieldMappingsPageComponent,
    FieldMapperComponent,
    CompanySelectorComponent
  ]
})
export class OrgDataLoaderModule { }
