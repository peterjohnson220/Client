import { NgModule } from '@angular/core';

import { KendoGridScrollToDirective } from './directives';

const declarations = [
  // Directives
  KendoGridScrollToDirective
];

@NgModule({
  declarations: declarations,
  exports: declarations
})
export class PfKendoExtensions { }
