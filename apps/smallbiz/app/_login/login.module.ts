import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers } from './reducers';
import { LoginEffects } from './effects';
import { LoginRoutingModule } from './login-routing.module';
import { LoginPageComponent } from './containers/pages';

@NgModule({
  declarations: [
    LoginPageComponent],
  imports: [
    // Angular
    FormsModule,

    // Third Party
    StoreModule.forFeature('loginArea', reducers),
    EffectsModule.forFeature([LoginEffects]),

    // Routing
    LoginRoutingModule
  ]
})
export class LoginModule { }
