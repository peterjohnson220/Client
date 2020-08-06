import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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

import { reducers } from './reducers';
import { StatementAssignmentRoutingModule } from './statement-assignment-routing.module';
import { StatementAssignmentPageComponent } from './statement-assignment.page';
import { StatementAssignmentModalComponent, AssignedEmployeesGridComponent, EmployeeSearchResultsComponent } from './containers';
import * as effects from './effects';
import { SearchFilterMappingData, EmployeeSearchUserFilterType} from './models';
import { EmployeeResultComponent } from './components/employee-result/employee-result.component';
import { GenerateStatementModalComponent } from './components/generate-statement-modal/generate-statement-modal.component';
import * as fromTrsShared from '../../shared';
import { UnassignEmployeesModalComponent } from './components/unassign-employees-modal/unassign-employees-modal.component';
import { GridActionMenuComponent } from './components/grid-action-menu/grid-action-menu.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('totalRewards_statementAssignment', reducers),
    EffectsModule.forFeature([
      effects.EmployeeSearchFiltersEffects,
      effects.EmployeeSearchResultsEffects,
      effects.EmployeeSearchSingleFilterEffects,
      effects.EmployeeSearchUserFilterEffects,
      effects.StatementAssignmentModalEffects,
      effects.StatementAssignmentPageEffects,
      effects.AssignedEmployeesGridEffects
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
    fromTrsShared.SharedModule,

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
    GridActionMenuComponent
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
