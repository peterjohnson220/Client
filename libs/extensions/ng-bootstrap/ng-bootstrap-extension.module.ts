import { NgModule } from '@angular/core';

import { HandlePopoverCloseDirective } from './directives';

const declarations = [
  // Directives
  HandlePopoverCloseDirective
];

@NgModule({
  declarations: declarations,
  exports: declarations
})
export class PfNgBootstrapExtensionModule { }
