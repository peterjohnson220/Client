import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PfCommonUIModule } from '../common/common-ui-module';

import {
  HeaderComponent,
  UserMenuComponent,
  UserMenuAvatarComponent,
  LeftSidebarComponent,
  RightSidebarComponent
} from './components';
import { LayoutWrapperComponent } from './containers';
import { HeaderEffects, LeftSidebarEffects } from './effects';
import { reducers } from './reducers';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,

    PfCommonUIModule,

    StoreModule.forFeature('layoutWrapper', reducers),
    EffectsModule.forFeature([ HeaderEffects, LeftSidebarEffects ]),
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
