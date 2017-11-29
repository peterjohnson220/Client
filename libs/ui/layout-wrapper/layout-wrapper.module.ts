import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PfCommonUIModule } from '../common/common-ui-module';

import { HeaderComponent, LeftSidebarComponent, RightSidebarComponent, UserMenuComponent, FooterComponent } from './components';
import { LayoutWrapperComponent } from './containers';
import { HeaderEffects } from './effects';
import { reducers } from './reducers';

@NgModule({
  imports:      [
    CommonModule,
    NgbModule,

    PfCommonUIModule,

    StoreModule.forFeature('layoutWrapper', reducers),
    EffectsModule.forFeature([HeaderEffects]),
  ],
  declarations: [HeaderComponent, LeftSidebarComponent, RightSidebarComponent, UserMenuComponent, LayoutWrapperComponent, FooterComponent],
  exports: [HeaderComponent, LeftSidebarComponent, LayoutWrapperComponent ]
})
export class PfLayoutWrapperModule { }
