import { NgModule } from '@angular/core';

import { UserContextGuard } from './guards/user-context.guard';

@NgModule({
  providers:    [ UserContextGuard ]
})
export class PfSecurityModule { }
