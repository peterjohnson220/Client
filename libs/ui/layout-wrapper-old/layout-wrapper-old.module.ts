import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PfCommonUIModule } from '../common/common-ui-module';

import { HeaderComponent } from './components';
import { LayoutWrapperComponent } from './containers';
import { HeaderEffects } from './effects';
import { reducers } from './reducers';

@NgModule({
  imports:      [
    // Angular
    CommonModule,

    // 3rd party
    NgbDropdownModule.forRoot(),
    StoreModule.forFeature('layoutWrapper', reducers),
    EffectsModule.forFeature([HeaderEffects]),

    // Payfactors
    PfCommonUIModule
  ],
  declarations: [ HeaderComponent, LayoutWrapperComponent ],
  exports:      [ LayoutWrapperComponent ]
})
export class PfLayoutWrapperOldModule { }
