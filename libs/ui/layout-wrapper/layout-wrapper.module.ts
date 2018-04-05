import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PfCommonUIModule } from '../common';

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
    NgbTooltipModule.forRoot(),
    NgbDropdownModule.forRoot(),
    StoreModule.forFeature('layoutWrapper', reducers),
    EffectsModule.forFeature([ HeaderEffects, LeftSidebarEffects ]),

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
}
