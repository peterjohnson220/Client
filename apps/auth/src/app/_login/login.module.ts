import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { LoginPageComponent } from './containers';
// Routing
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Routing
    LoginRoutingModule
  ],
  declarations: [

    // Pages
    LoginPageComponent
  ],
  providers: [  ]
})
export class LoginModule { }
