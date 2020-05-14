import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';

import { PageComponent } from './page_module.page';
import { PageRoutingModule } from './page_module-routing';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,

    PageRoutingModule
  ],
  declarations: [
    PageComponent
  ],
  exports: []
})
export class PageModule { }
