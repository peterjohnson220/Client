import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Effects
import { ForgotPasswordEffects } from './effects';
import { FirstLoginEffects } from './effects';

// Reducers
import { reducers } from './reducers';

// Third party
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// Containers
import { FirstLoginPageComponent, LoginPageComponent, ForgotPasswordPageComponent } from './containers';

// Libs / Controls
import { ConfirmPasswordComponent } from 'libs/forms/components/confirm-password';

// Routing
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('authMain', reducers),
    EffectsModule.forFeature([FirstLoginEffects, ForgotPasswordEffects]),

    // Routing
    LoginRoutingModule
  ],
  declarations: [

    // Pages
    FirstLoginPageComponent,
    ForgotPasswordPageComponent,
    LoginPageComponent,

    // Controls
    ConfirmPasswordComponent
  ],
  providers: [  ]
})
export class LoginModule { }
