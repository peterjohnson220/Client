import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from 'libs/ui/common';
import { CaptchaModule } from 'libs/features/captcha';

import { HospitalitySignupPageComponent, HospitalitySignupSuccessPageComponent } from './pages';
import { HospitalitySignupRoutingModule } from './hospitality-signup-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { HospitalitySignupEffects } from './effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    FontAwesomeModule,
    EffectsModule.forFeature([HospitalitySignupEffects]),

    // Payfactors
    PfCommonUIModule,
    CaptchaModule,

    // Routing
    HospitalitySignupRoutingModule,

    // Shared
    SharedModule
  ],
  declarations: [
    HospitalitySignupPageComponent,
    HospitalitySignupSuccessPageComponent
  ]
})
export class HospitalitySignupModule { }
