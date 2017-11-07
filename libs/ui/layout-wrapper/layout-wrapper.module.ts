import { NgModule } from '@angular/core';

import { HeaderComponent } from './components/index';
import { LayoutWrapperComponent } from './containers/index';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  // imports:      [ HeaderComponent ],
  declarations: [ HeaderComponent, SidebarComponent, LayoutWrapperComponent ],
  exports:      [ HeaderComponent, SidebarComponent, LayoutWrapperComponent ]
  // providers:    [ ContactService ]
})
export class LayoutWrapperModule { }
