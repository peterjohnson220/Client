import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // TODO: need this?
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // TODO: need this?

// Effects
import { RegistrationFormEffects, CompleteRegistrationEffects, ValidateRegistrationEffects } from './effects';

// Reducers
import { reducers } from './reducers';

// Third party
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// Containers
import { RegistrationFormPageComponent, ValidateRegistrationPageComponent } from './containers';

// Libs / Controls
import { PfCommonUIModule } from 'libs/ui/common'; // TODO: need this?
import { PfFormsModule } from 'libs/forms';

// Routing
import { RegistrationRoutingModule } from './registration-routing.module';
import { RegistrationEnabledGuard } from './services/registration-enabled.guard';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('registration', reducers),
    EffectsModule.forFeature([
      RegistrationFormEffects,
      CompleteRegistrationEffects,
      ValidateRegistrationEffects
    ]),

    // Routing
    RegistrationRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Pages
    RegistrationFormPageComponent,
    ValidateRegistrationPageComponent
  ],
  providers: [RegistrationEnabledGuard]
})
export class RegistrationModule { }
