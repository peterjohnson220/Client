import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { GridModule, SharedModule } from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfSearchModule } from 'libs/features/search';
import { SearchFilterMappingDataObj } from 'libs/features/search/models';
import { UserFilterTypeData } from 'libs/features/user-filter/models';
import { WindowCommunicationService } from 'libs/core/services';
import { ListAreaService } from 'libs/core/services/list-area.service';
import { PfListAreaModule } from 'libs/features/list-area/list-area.module';
import * as fromTrsStatement from 'libs/features/total-rewards/total-rewards-statement';

import { reducers } from './reducers';
import { StatementAssignmentRoutingModule } from './statement-assignment-routing.module';
import { StatementAssignmentPageComponent } from './statement-assignment.page';
import { StatementAssignmentModalComponent, AssignedEmployeesGridComponent, EmployeeSearchResultsComponent } from './containers';
import * as effects from './effects';
import { SearchFilterMappingData, EmployeeSearchUserFilterType} from './models';
import {
  EmployeeResultComponent,
  GenerateStatementModalComponent,
  UnassignEmployeesModalComponent,
  GridActionMenuComponent,
  StatementEmailTemplateComponent
} from './components';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('totalRewards_statementAssignment', reducers),
    EffectsModule.forFeature([
      effects.EmployeeSearchFiltersEffects,
      effects.EmployeeSearchResultsEffects,
      effects.EmployeeSearchSingleFilterEffects,
      effects.EmployeeSearchUserFilterEffects,
      effects.StatementAssignmentModalEffects,
      effects.StatementAssignmentPageEffects,
      effects.AssignedEmployeesGridEffects,
      effects.GenerateStatementModalEffects
    ]),
    SharedModule,
    GridModule,
    TooltipModule,
    FontAwesomeModule,
    NgbDropdownModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    PfSearchModule,
    PfListAreaModule,
    fromTrsStatement.TotalRewardsStatementModule,

    // Routing
    StatementAssignmentRoutingModule,
  ],
  declarations: [
    StatementAssignmentPageComponent,
    StatementAssignmentModalComponent,
    EmployeeSearchResultsComponent,
    EmployeeResultComponent,
    GenerateStatementModalComponent,
    AssignedEmployeesGridComponent,
    UnassignEmployeesModalComponent,
    GridActionMenuComponent,
    StatementEmailTemplateComponent
  ],
  providers: [
    { provide: SearchFilterMappingDataObj, useValue: SearchFilterMappingData },
    { provide: UserFilterTypeData, useValue: EmployeeSearchUserFilterType},
    WindowCommunicationService,
    ListAreaService
  ]
})
export class StatementAssignmentModule {
  constructor() {}
}
