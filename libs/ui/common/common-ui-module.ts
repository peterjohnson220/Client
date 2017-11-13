import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoadingIndicatorComponent } from './loading';

@NgModule({
  imports:      [
    CommonModule,
    NgbModule.forRoot()
  ],
  declarations: [ LoadingIndicatorComponent ],
  exports:      [ LoadingIndicatorComponent ]
})
export class PFCommonUIModule { }
