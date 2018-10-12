import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbCarouselModule, NgbModalModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfStateModule } from 'libs/state/state.module';
import { PfAppRootModule, AppComponent } from 'libs/features/app-root';

import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from './shared/shared.module';
import { PayfactorsApiService } from 'libs/data/payfactors-api/payfactors-api.service';

import { StoreModule } from '@ngrx/store';
import { reducers } from './shared/reducers';


@NgModule({
  imports: [

    // Angular
    BrowserAnimationsModule,

    // Third Party
    NgbModalModule.forRoot(),
    NgbPopoverModule.forRoot(),
    NgbCarouselModule.forRoot(),
    StoreModule.forFeature('peer_shared', reducers),

    // PF Modules
    PfStateModule,
    PfApiModule,
    PfAppRootModule,
    SharedModule,

    // Routing
    AppRoutingModule
  ],

  bootstrap: [AppComponent],
  providers: [PayfactorsApiService]

})
export class AppModule { }
