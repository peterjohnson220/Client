import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { PeerExchangeSignupRoutingModule } from './peer-exchange-signup-routing.module';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    PeerExchangeSignupRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: []
})
export class PeerExchangeSignupModule { }
