import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { reducers } from './reducers';

import { StatementAssignmentRoutingModule } from './statement-assignment-routing.module';
import { StatementAssignmentPageComponent } from './statement-assignment.page';
import { StatementAssignmentModalComponent } from './containers';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('totalRewards_statementAssignment', reducers),

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,

    // Routing
    StatementAssignmentRoutingModule
  ],
  declarations: [
    StatementAssignmentPageComponent,
    StatementAssignmentModalComponent
  ]
})
export class StatementAssignmentModule {
  constructor() {}
}
