import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Effects
import { ForgotPasswordEffects } from './effects';
import { FirstLoginEffects } from './effects';
import { ResetPasswordEffects} from './effects';

// Reducers
import { reducers } from './reducers';

// Third party
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// Containers
import { FirstLoginPageComponent, LoginPageComponent, ForgotPasswordPageComponent, ResetPasswordPageComponent } from './containers';

// Libs / Controls
import { ConfirmPasswordComponent } from 'libs/forms/components/confirm-password';
import { PfCommonUIModule } from 'libs/ui/common';

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
    EffectsModule.forFeature([FirstLoginEffects, ForgotPasswordEffects, ResetPasswordEffects]),

    // Routing
    LoginRoutingModule,

    // Payfactors
    PfCommonUIModule
  ],
  declarations: [

    // Pages
    FirstLoginPageComponent,
    ForgotPasswordPageComponent,
    LoginPageComponent,
    ResetPasswordPageComponent,

    // Controls
    ConfirmPasswordComponent
  ],
  providers: [  ]
})
export class LoginModule { }
