import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColumnResizingService } from '@progress/kendo-angular-grid';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import {TemplatesRoutingModule} from './templates-routing.module';
import { TemplateModule } from './template';
import { TemplateListModule } from './template-list';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    TemplatesRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,

    // Features
    TemplateModule,
    TemplateListModule
  ],
  declarations: [],
  exports: [],
  providers: [ColumnResizingService]
})
export class TemplatesModule { }
