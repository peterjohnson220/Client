import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { MomentModule } from 'ngx-moment';
import { NgbModalModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutModule } from '@progress/kendo-angular-layout';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfAppRootModule, AppComponent } from 'libs/features/infrastructure/app-root';
import { PfSecurityModule } from 'libs/security/security.module';
import { PfStateModule } from 'libs/state/state.module';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfLayoutWrapperModule } from 'libs/ui/layout-wrapper';
import { JwtQueryStringAuthInterceptor, SentryService, SentryErrorHandler } from 'libs/core/services';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { PfJobDescriptionManagementModule } from 'libs/features/jobs/job-description-management/job-description-management.module';
import {SsoAuthGuard} from './shared/guards';
import { UserContextGuard } from '../../../libs/security/guards';


@NgModule({
  imports: [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,

    // 3rd Party
    MomentModule,
    NgbModalModule,
    NgbTabsetModule,
    LayoutModule,

    // PF Modules
    PfApiModule,
    PfAppRootModule,
    PfCommonUIModule,
    PfLayoutWrapperModule,
    PfSecurityModule,
    PfStateModule,
    SharedModule,
    PfJobDescriptionManagementModule,

    // Routing
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtQueryStringAuthInterceptor,
      multi: true
    },
    { provide: ErrorHandler, useClass: SentryErrorHandler },
    SentryService,
    SsoAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
