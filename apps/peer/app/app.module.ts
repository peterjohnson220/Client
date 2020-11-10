import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbCarouselModule, NgbModalModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfStateModule } from 'libs/state/state.module';
import { PfAppRootModule, AppComponent } from 'libs/features/app-root';
import { PfLayoutWrapperModule } from 'libs/ui/layout-wrapper';
import { PayfactorsApiService } from 'libs/data/payfactors-api/payfactors-api.service';
import { SentryService, SentryErrorHandler, WindowCommunicationService } from 'libs/core/services';
import { SearchFilterMappingDataObj } from 'libs/features/search/models';

import { AppRoutingModule } from './app-routing.module';
import { AppWrapperComponent } from './shared/appwrapper/app-wrapper.component';
import { SharedModule } from './shared/shared.module';

import { StoreModule } from '@ngrx/store';
import { reducers } from './shared/reducers';

@NgModule({
  declarations: [
    AppWrapperComponent
  ],
  imports: [

    // Angular
    BrowserAnimationsModule,

    // Third Party
    NgbModalModule,
    NgbPopoverModule,
    NgbCarouselModule,
    StoreModule.forFeature('peer_shared', reducers),

    // PF Modules
    PfStateModule,
    PfApiModule,
    PfAppRootModule,
    PfLayoutWrapperModule,
    SharedModule,

    // Routing
    AppRoutingModule
  ],

  bootstrap: [AppComponent],
  providers: [
    PayfactorsApiService,
    WindowCommunicationService,
    { provide: ErrorHandler, useClass: SentryErrorHandler },
    SentryService
  ]

})
export class AppModule { }
