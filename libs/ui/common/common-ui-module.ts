import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoadingIndicatorComponent, LoadingUserContextComponent } from './loading';

@NgModule({
  imports:      [
    CommonModule,
    NgbModule.forRoot()
  ],
  declarations: [ LoadingIndicatorComponent, LoadingUserContextComponent ],
  exports:      [ LoadingIndicatorComponent, LoadingUserContextComponent ]
})
export class PFCommonUIModule { }
