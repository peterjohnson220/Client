import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgbModalModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutModule } from '@progress/kendo-angular-layout';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfAppRootModule, AppComponent } from 'libs/features/app-root';
import { PfSecurityModule } from 'libs/security/security.module';
import { PfStateModule } from 'libs/state/state.module';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfLayoutWrapperModule } from 'libs/ui/layout-wrapper';
import { JwtQueryStringAuthInterceptor } from 'libs/core/services';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';


@NgModule({
  imports: [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,

    // 3rd Party
    NgbModalModule.forRoot(),
    NgbTabsetModule.forRoot(),
    LayoutModule,

    // PF Modules
    PfApiModule,
    PfAppRootModule,
    PfCommonUIModule,
    PfLayoutWrapperModule,
    PfSecurityModule,
    PfStateModule,
    SharedModule,

    // Routing
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtQueryStringAuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
