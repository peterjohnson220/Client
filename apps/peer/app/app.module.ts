import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbCarouselModule, NgbModalModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfStateModule } from 'libs/state/state.module';
import { PfAppRootModule, AppComponent } from 'libs/features/app-root';

import { AppRoutingModule } from './app-routing.module';

import { AppWrapperComponent } from './shared/appwrapper/app-wrapper.component';
import { PfLayoutWrapperModule } from 'libs/ui/layout-wrapper';

@NgModule({
  declarations: [
    AppWrapperComponent],
  imports: [
    // Angular
    BrowserAnimationsModule,

    // Third Party
    NgbModalModule.forRoot(),
    NgbPopoverModule.forRoot(),
    NgbCarouselModule.forRoot(),

    // PF Modules
    PfStateModule,
    PfApiModule,
    PfAppRootModule,
    PfLayoutWrapperModule,

    // Routing
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
