import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';
import { UserFilterEffects, UserFilterPopoverEffects, SaveFilterModalEffects } from './effects';
import { UserFilterPopoverComponent } from './containers';
import { SaveFilterModalComponent } from './components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Payfactors
    PfFormsModule,
    PfCommonUIModule,

    // 3rd Party
    StoreModule.forFeature('feature_userfilter', reducers),
    EffectsModule.forFeature([
      UserFilterEffects,
      UserFilterPopoverEffects,
      SaveFilterModalEffects
    ]),
    NgbPopoverModule,
    FontAwesomeModule
  ],
  declarations: [ UserFilterPopoverComponent, SaveFilterModalComponent ],
  exports: [ UserFilterPopoverComponent, SaveFilterModalComponent ]
})
export class PfUserFilterModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
