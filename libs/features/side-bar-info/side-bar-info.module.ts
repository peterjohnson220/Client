import { NgModule } from '@angular/core';
import { SideBarInfoComponent } from './components/side-bar-info/side-bar-info.component';
import { CommonModule } from '@angular/common';

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
