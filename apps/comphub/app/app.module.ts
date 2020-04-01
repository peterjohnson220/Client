import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfAppRootModule, AppComponent } from 'libs/features/app-root';
import { PfSecurityModule } from 'libs/security/security.module';
import { PfStateModule } from 'libs/state/state.module';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfLayoutWrapperModule } from 'libs/ui/layout-wrapper';
import { GuidelinesBadgeModule } from 'libs/features/peer/guidelines-badge/guidelines-badge.module';

import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,
    GuidelinesBadgeModule,

    // PF Modules
    PfApiModule,
    PfAppRootModule,
    PfCommonUIModule,
    PfLayoutWrapperModule,
    PfSecurityModule,
    PfStateModule,

    // Routing
    AppRoutingModule,
    FontAwesomeModule,
    NgbPopoverModule
  ],
  declarations: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
