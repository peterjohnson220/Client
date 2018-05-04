import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// Effects
import { ForgotPasswordEffects } from './effects';

// Reducers
import { reducers } from './reducers';

// Third party
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// Containers
import { LoginPageComponent, ForgotPasswordPageComponent } from './containers';

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
    EffectsModule.forFeature([ForgotPasswordEffects]),

    // Routing
    LoginRoutingModule
  ],
  declarations: [

    // Pages
    LoginPageComponent,
    ForgotPasswordPageComponent
  ],
  providers: [  ]
})
export class LoginModule { }
