import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Effects
import { ForgotPasswordEffects, MarketingImageEffects } from './effects';
import { FirstLoginEffects } from './effects';
import { ResetPasswordEffects} from './effects';
import { LoginEffects } from './effects';

// Reducers
import { reducers } from './reducers';

// Third party
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import * as fromFaIcons from './fa-icons';

// Containers
import { FirstLoginPageComponent, LoginPageComponent, ForgotPasswordPageComponent, ResetPasswordPageComponent } from './containers';

// Libs / Controls
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

// Routing
import { LoginRoutingModule } from './login-routing.module';
import { MarketingModule } from 'apps/admin/app/_marketing/marketing.module';

// Services
import { MarketingApiService } from 'libs/data/payfactors-api/marketing/marketing-api.service';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('authMain', reducers),
    EffectsModule.forFeature([
      FirstLoginEffects,
      ForgotPasswordEffects,
      ResetPasswordEffects,
      LoginEffects,
      MarketingImageEffects
    ]),
    FontAwesomeModule,

    // Routing
    LoginRoutingModule,

    // Payfactors
    PfCommonUIModule,
    MarketingModule,
    PfFormsModule
  ],
  declarations: [

    // Pages
    FirstLoginPageComponent,
    ForgotPasswordPageComponent,
    LoginPageComponent,
    ResetPasswordPageComponent
  ],
  providers: [ MarketingApiService ]
})
export class LoginModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
