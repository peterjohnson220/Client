import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FormAppWrapperComponent, TwoColumnFormComponent } from './components';
import { reducers } from './reducers';
import { SharedEffects, PeerExchangeSignupEffects } from './effects';

const declarations = [
  FormAppWrapperComponent,
  TwoColumnFormComponent
];

@NgModule({
  imports: [
    // Angular
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    EffectsModule.forFeature([SharedEffects, PeerExchangeSignupEffects]),
    StoreModule.forFeature('form_shared', reducers)
  ],
  declarations: declarations,
  exports: declarations
})
export class SharedModule {
  constructor() { }
}
