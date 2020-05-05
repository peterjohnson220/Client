import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModalModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { NotificationModule } from '@progress/kendo-angular-notification';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfStateModule } from 'libs/state/state.module';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfFormsModule } from 'libs/forms/forms.module';
import { PfAppRootModule, AppComponent } from 'libs/features/app-root';
import { JobAssociationMatchModule } from 'libs/features/peer/job-association-match';

import { AppRoutingModule } from './app-routing.module';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    // Angular
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NoopAnimationsModule,

    // 3rd Party
    NgbModalModule,
    NgbTabsetModule,
    LayoutModule,
    NotificationModule,
    JobAssociationMatchModule,

    // PF Modules
    PfCommonUIModule,
    PfApiModule,
    PfStateModule,
    PfFormsModule,
    PfAppRootModule,

    // Routing
    AppRoutingModule,

    BrowserAnimationsModule

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
