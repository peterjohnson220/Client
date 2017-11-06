import { NgModule } from '@angular/core';

import { HeaderComponent } from './components';
import { LayoutWrapperComponent } from './containers';

@NgModule({
  // imports:      [ HeaderComponent ],
  declarations: [ HeaderComponent, LayoutWrapperComponent ],
  exports:      [ HeaderComponent, LayoutWrapperComponent ]
  // providers:    [ ContactService ]
})
export class LayoutWrapperModule { }
