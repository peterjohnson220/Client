import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfSearchModule } from 'libs/features/search';
import { SearchFilterMappingDataObj } from 'libs/features/search/models';
import { UserFilterTypeData } from 'libs/features/user-filter/models';
import { WindowCommunicationService } from 'libs/core/services';

import { reducers } from './reducers';
import { StatementAssignmentRoutingModule } from './statement-assignment-routing.module';
import { StatementAssignmentPageComponent } from './statement-assignment.page';
import { StatementAssignmentModalComponent } from './containers';
import { EmployeeSearchResultsComponent } from './containers/employee-search-results/employee-search-results.component';
import {
  EmployeeSearchResultsEffects,
  EmployeeSearchUserFilterEffects,
  StatementAssignmentModalEffects
} from './effects';
import { EmployeeResultComponent } from './components/employee-result/employee-result.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('totalRewards_statementAssignment', reducers),
    EffectsModule.forFeature([EmployeeSearchResultsEffects, StatementAssignmentModalEffects, EmployeeSearchUserFilterEffects]),

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    PfSearchModule,

    // Routing
    StatementAssignmentRoutingModule,
  ],
  declarations: [
    StatementAssignmentPageComponent,
    StatementAssignmentModalComponent,
    EmployeeSearchResultsComponent,
    EmployeeResultComponent
  ],
  providers: [
    { provide: SearchFilterMappingDataObj, useValue: {} },
    { provide: UserFilterTypeData, useValue: ''},
    WindowCommunicationService
  ]
})
export class StatementAssignmentModule {
  constructor() {}
}
