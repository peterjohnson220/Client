import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LayoutWrapperModule } from '../../../../libs/layout-wrapper/src/layout-wrapper.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LayoutWrapperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
