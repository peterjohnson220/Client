import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModalModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutModule } from '@progress/kendo-angular-layout';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfStateModule } from 'libs/state/state.module';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfFormsModule } from 'libs/forms/forms.module';
import { PfAppRootModule, AppComponent } from 'libs/features/app-root';

import { AppRoutingModule } from './app-routing.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CompanyModule } from './_companies/company.module';
import { BrowserDetectionService } from 'libs/core/services';

@NgModule({
  imports: [
    // Angular
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NoopAnimationsModule,

    // 3rd Party
    NgbModalModule.forRoot(),
    NgbTabsetModule.forRoot(),
    LayoutModule,

    // PF Modules
    PfCommonUIModule,
    PfApiModule,
    PfStateModule,
    PfFormsModule,
    PfAppRootModule,
    CompanyModule,

    // Routing
    AppRoutingModule

  ],
  bootstrap: [AppComponent],
  providers: [BrowserDetectionService]
})
export class AppModule { }
