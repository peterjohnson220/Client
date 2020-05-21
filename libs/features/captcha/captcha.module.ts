import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers } from './reducers';
import { CaptchaService } from './services';
import { CaptchaComponent } from './containers';
import { CaptchaEffects } from './effects';

const declarations = [
  CaptchaComponent
];

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,

    // 3rd Party
    StoreModule.forFeature('feature_captcha', reducers),
    EffectsModule.forFeature([CaptchaEffects])
  ],
  declarations: declarations,
  exports: declarations,
  providers: [
    CaptchaService
  ]
})
export class CaptchaModule { }
