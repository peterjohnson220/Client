import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { DragulaModule } from 'ng2-dragula';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import {MultiMatchModule} from 'libs/features/multi-match/multi-match.module';

import * as fromFaIcons from './fa-icons';
import { MultiMatchRoutingModule } from './multi-match-routing.module';
import { MultiMatchPageComponent } from './multi-match-page/multi-match-page.component';


@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    DragulaModule.forRoot(),
    FontAwesomeModule,

    // Routing
    MultiMatchRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    MultiMatchModule
  ],
  declarations: [MultiMatchPageComponent]
})
export class MultiMatchPageModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
