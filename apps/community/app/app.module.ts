import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModalModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfStateModule } from 'libs/state/state.module';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfFormsModule } from 'libs/forms/forms.module';
import { PfAppRootModule, AppComponent } from 'libs/features/app-root';

import { AppRoutingModule } from './app-routing.module';
import { NewCommninityEnabledGuard } from 'libs/security/guards/new-community-enabled.guard';

@NgModule({
  imports: [
    // Angular
    BrowserModule,
    // 3rd Party
    NgbModalModule.forRoot(),
    NgbCarouselModule.forRoot(),
    NgxLinkifyjsModule.forRoot(),

    // PF Modules
    PfCommonUIModule,
    PfApiModule,
    PfStateModule,
    PfFormsModule,
    PfAppRootModule,

    // Routing
    AppRoutingModule

  ],
  providers: [
    NewCommninityEnabledGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
