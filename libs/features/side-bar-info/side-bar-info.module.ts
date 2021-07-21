import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SideBarInfoComponent } from './components/side-bar-info/side-bar-info.component';

@NgModule({
  declarations: [
    SideBarInfoComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [SideBarInfoComponent]
})
export class PfSideBarInfoModule {
  constructor() {}
}
