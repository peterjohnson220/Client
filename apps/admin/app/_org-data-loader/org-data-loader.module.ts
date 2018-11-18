import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LayoutModule } from '@progress/kendo-angular-layout';
import { EffectsModule } from '@ngrx/effects';
import { UploadModule } from '@progress/kendo-angular-upload';
import { StoreModule } from '@ngrx/store';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { OrgDataLoaderRoutingModule } from './org-data-loader-routing.module';
import { ManageFieldMappingsPageComponent } from './containers/pages';
import { FieldMapperComponent } from './containers/field-mapper/field-mapper.component';
import { reducers } from './reducers';
import { CompanySelectorEffects } from './effects/company-selector.effects';
import { CompanySelectorComponent } from './containers/company-selector/company-selector.component';
import { OrgDataFieldMappingsEffects } from './effects/org-data-field-mappings.effects';
import { EmailRecipientsComponent } from './containers/email-recipients/email-recipients.component';
import { OrgDataEmailRecipientsEffects } from './effects/email-recipients.effects';


@NgModule({
  imports:      [
    // Angular
    CommonModule,
    FormsModule,

    // 3rd Party
    StoreModule.forFeature('orgDataLoader', reducers),
    EffectsModule.forFeature([CompanySelectorEffects, OrgDataFieldMappingsEffects, OrgDataEmailRecipientsEffects]),

    // 3rd Party
    LayoutModule,
    UploadModule,

    // Routing
    OrgDataLoaderRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Pages
    ManageFieldMappingsPageComponent,
    FieldMapperComponent,
    CompanySelectorComponent,
    EmailRecipientsComponent
  ]
})
export class OrgDataLoaderModule { }
