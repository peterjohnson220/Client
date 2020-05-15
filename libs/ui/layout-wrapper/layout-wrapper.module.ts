import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PfCommonUIModule } from '../common';
import * as fromFaIcons from './fa-icons';

import {
  HeaderComponent,
  UserMenuComponent,
  UserMenuAvatarComponent,
  RightSidebarComponent
} from './components';
import {
  LayoutWrapperComponent,
  LeftSidebarComponent
} from './containers';
import { HeaderEffects, LeftSidebarEffects } from './effects';
import { reducers } from './reducers';
import { PfCommonModule } from '../../core';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    NgbTooltipModule,
    NgbDropdownModule,
    StoreModule.forFeature('layoutWrapper', reducers),
    EffectsModule.forFeature([ HeaderEffects, LeftSidebarEffects ]),
    FontAwesomeModule,

    // Payfactors
    PfCommonUIModule,
    PfCommonModule
  ],
  declarations: [
    HeaderComponent,
    UserMenuComponent,
    UserMenuAvatarComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    LayoutWrapperComponent ],
  exports: [ LayoutWrapperComponent ]
})
export class PfLayoutWrapperModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
