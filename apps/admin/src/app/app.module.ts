import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { PfLayoutWrapperOldModule } from 'libs/ui/layout-wrapper-old';
import { PfApiModule } from 'libs/data/payfactors-api';
import { PfStateModule } from 'libs/state/state.module';
import { PfSecurityModule } from 'libs/security/security.module';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppWrapperComponent } from './app-wrapper.component';
import { PfFormsModule } from 'libs/forms/forms.module';
import { TruncateAfterPipe } from '../../../../libs/shared/pipes';


@NgModule({
  declarations: [
    AppComponent,
    AppWrapperComponent,
    TruncateAfterPipe
  ],
  imports: [
    // Angular
    BrowserModule,

    // PF Modules
    PfCommonUIModule,
    PfSecurityModule,
    PfLayoutWrapperOldModule,
    PfApiModule,
    PfStateModule,
    PfFormsModule,

    // Routing
    AppRoutingModule

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
