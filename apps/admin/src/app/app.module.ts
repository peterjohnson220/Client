import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfStateModule } from 'libs/state/state.module';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfFormsModule } from 'libs/forms/forms.module';
import { TruncateAfterPipe } from '../../../../libs/shared/pipes';
import { PfAppRootModule, AppComponent } from 'libs/features/app-root';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,    
    TruncateAfterPipe
  ],
  imports: [
    // Angular
    BrowserModule,

    // PF Modules
    PfCommonUIModule,
    PfApiModule,
    PfStateModule,
    PfFormsModule,
    PfAppRootModule,

    // Routing
    AppRoutingModule

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
