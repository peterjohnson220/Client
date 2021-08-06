import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromAppNotificationsMainReducer from 'libs/features/infrastructure/app-notifications/reducers';
import * as fromEmployeeManagementReducer from 'libs/features/employees/employee-management/reducers';
import { AbstractFeatureFlagService } from 'libs/core/services';
import { SettingsService } from 'libs/state/app-context/services';
import { DeliveryMethod } from 'libs/features/total-rewards/total-rewards-statement/models/delivery-method';
import { generateMockStatement } from 'libs/features/total-rewards/total-rewards-statement/models';

import { StatementAssignmentPageComponent } from './statement-assignment.page';
import { DeliveryOption } from '../models';
import * as fromStatementAssignmentReducer from '../reducers';
import * as fromPageActions from '../actions/statement-assignment.page.actions';
import * as fromAssignmentsModalActions from '../actions/statement-assignment-modal.actions';
import * as fromAssignedEmployeesGridActions from '../actions/assigned-employees-grid.actions';

describe('AssignedEmployeesGridComponent', () => {
  let component: StatementAssignmentPageComponent;
  let fixture: ComponentFixture<StatementAssignmentPageComponent>;
  let store: Store<fromStatementAssignmentReducer.State>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromStatementAssignmentReducer.reducers,
          totalRewards_statementAssignment: combineReducers(fromStatementAssignmentReducer.reducers),
          feature_appnotifications: combineReducers(fromAppNotificationsMainReducer.reducers),
          feature_employee_management: combineReducers(fromEmployeeManagementReducer.reducers),
        })],
      declarations: [StatementAssignmentPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({ }), params: of({ id: 'abc-123' }) }
        },
        {
          provide: Router,
          useValue: { },
        },
        {
          provide: AbstractFeatureFlagService,
          useValue: { enabled: jest.fn(), bindEnabled: jest.fn() }
        },
        {
          provide: SettingsService,
          useValue: { selectCompanySetting: () => of(false)}
        }
      ]
    });

    store = TestBed.inject(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementAssignmentPageComponent);
    component = fixture.componentInstance;

    component.StatementAssignmentModalComponent = { onMessage: () => ({})} as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the expected page title', () => {
    // arrange
    component.statement$ = of({ StatementName: 'Test Statement Name' }) as any;

    // act
    fixture.detectChanges();

    // assert
    const pageTextContent = fixture.nativeElement.textContent;
    expect(pageTextContent.indexOf('Test Statement Name: Assigned Employees')).toBeGreaterThan(-1);
  });

  it('should hide the filter pill section when no filters are applied', () => {
    // arrange
    component.assignedEmployeesGridState = {
      filter: {
        filters: [],
        logic: 'and'
      }
    } as any;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.nativeElement.querySelector('pf-list-area-filter-pills')).toBeFalsy();
  });

  it('should show the filter pill section when filters are applied', () => {
    // arrange
    component.assignedEmployeesGridState = {
      filter: {
        filters: [{ field: 'LastName', operator: 'contains', value: 'a' }],
        logic: 'and'
      }
    } as any;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.nativeElement.querySelector('pf-list-area-filter-pills')).toBeTruthy();
  });

  it('should dispatch the expected action when Assign Employees is clicked', () => {
    // arrange
    jest.spyOn(store, 'dispatch');
    const openModalAction = new fromAssignmentsModalActions.OpenModal();

    // act
    fixture.detectChanges();
    const openModalButton = fixture.debugElement.nativeElement.querySelector('button.open-assign-modal');
    openModalButton.click();

    // assert
    expect(store.dispatch).toHaveBeenCalledWith(openModalAction);
  });

  it('handleAssignedEmployeesGridStateChange should preserve current filters and dispatch updated paging in the dispatched action', () => {
    // arrange
    jest.spyOn(store, 'dispatch');
    const currentGridState = {
      filter: {
        filters: [{ field: 'LastName', operator: 'contains', value: 'a' }]
      }
    } as any;
    component.assignedEmployeesGridState = currentGridState;

    // arrange, setup a grid state change
    const updatedGridState = { skip: 20 };

    // arrange, setup a combined grid state that should have both the current filters and new paging
    const loadEmployeesAction = new fromAssignedEmployeesGridActions.LoadAssignedEmployees({ ...currentGridState, ...updatedGridState });

    // act
    component.handleAssignedEmployeesGridStateChange(updatedGridState);

    // assert
    expect(store.dispatch).toHaveBeenCalledWith(loadEmployeesAction);
  });

  it('handleClearFilter should remove the expected filter', () => {
    // arrange, set the current gridState up to have one filter
    jest.spyOn(component.filterChangeSubject, 'next');
    const currentGridState = {
      filter: {
        filters: [{ field: 'LastName', operator: 'contains', value: 'a' }]
      }
    } as any;
    component.assignedEmployeesGridState = currentGridState;

    // arrange, create the filter to be removed and the expected action
    const filterToRemove = { field: 'LastName', operator: 'contains', value: 'a' };
    const remainingFilters = [];

    // act
    component.handleClearFilter(filterToRemove);

    // assert
    expect(component.filterChangeSubject.next).toHaveBeenCalledWith(remainingFilters);
  });

  it('handleClearAllFilters should remove all filters', () => {
    // arrange, set the current gridState up to have one filter
    jest.spyOn(component.filterChangeSubject, 'next');
    const currentGridState = {
      filter: {
        filters: [
          { field: 'LastName', operator: 'contains', value: 'a' },
          { field: 'FirstName', operator: 'contains', value: 'b' },
        ]
      }
    } as any;
    component.assignedEmployeesGridState = currentGridState;

    // arrange, create the filter to be removed and the expected action
    const emptyFilters = [];

    // act
    component.handleClearAllFilters();

    // assert
    expect(component.filterChangeSubject.next).toHaveBeenCalledWith(emptyFilters);
  });

  it('should dispatch the ExportAssignedEmployees action when Export Employee Benefits Report is clicked', () => {
    // arrange
    jest.spyOn(store, 'dispatch');
    const exportEmployeesAction = new fromPageActions.ExportAssignedEmployees();

    // act
    component.handleExportClicked();

    // assert
    expect(store.dispatch).toHaveBeenCalledWith(exportEmployeesAction);
  });

  it(`should not dispatch the ExportAssignedEmployees action when Export Employee Benefits Report is clicked
      and File Download Security Warning is canceled`, () => {
    // arrange
    jest.spyOn(store, 'dispatch');
    const exportEmployeesAction = new fromPageActions.ExportAssignedEmployees();
    component.fileDownloadSecurityWarningModal = { open: () => ({})} as any;
    component.enableFileDownloadSecurityWarning = true;

    // act
    component.handleExportClicked();
    component.handleSecurityWarningConfirmed(false);

    // assert
    expect(store.dispatch).not.toHaveBeenCalledWith(exportEmployeesAction);
  });

  it('should dispatch the GenerateStatements action when Generate is clicked and Download Bulk PDF chosen', () => {
    // arrange
    jest.spyOn(store, 'dispatch');
    const deliveryOption: DeliveryOption = {
      EmailTemplate: null,
      Method: DeliveryMethod.PDFExport,
      SaveEmailTemplate: false
    };
    const generateStatementsAction = new fromPageActions.GenerateStatements({
      method: deliveryOption.Method,
      emailTemplate: deliveryOption.EmailTemplate
    });

    // act
    component.handleGenerateStatementsClick(deliveryOption);

    // assert
    expect(store.dispatch).toHaveBeenCalledWith(generateStatementsAction);
  });

  it('should dispatch the GenerateStatements action when Generate is clicked and Secure Email Delivery chosen', () => {
    // arrange
    jest.spyOn(store, 'dispatch');
    const deliveryOption: DeliveryOption = {
      EmailTemplate: {
        EmailBody: 'Your Statement Name is ready for review.',
        EmailSubject: 'Your Statement Name is ready for review.',
        StatementId: 'e1ab354e-fe7c-4d0d-bc10-883c58720809'
      },
      Method: DeliveryMethod.Email,
      SaveEmailTemplate: false
    };

    const generateStatementsAction = new fromPageActions.GenerateStatements({
      method: deliveryOption.Method,
      emailTemplate: deliveryOption.EmailTemplate
    });

    // act
    component.handleGenerateStatementsClick(deliveryOption);

    // assert
    expect(store.dispatch).toHaveBeenCalledWith(generateStatementsAction);
  });

  it('should not show the Statement History button when statement does not have a last generated date and the history feature flag is disabled', () => {
    // arrange
    component.statement = generateMockStatement();
    component.statement.LastGeneratedDate = null;
    component.totalRewardsHistoryFeatureFlag.value = false;

    // act
    fixture.detectChanges();

    // assert
    const historyButton = fixture.nativeElement.querySelector('.statement-history');
    expect(historyButton).toBeFalsy();
  });

  it('should not show the Statement History button when statement has a last generated date but the history feature flag is disabled', () => {
    // arrange
    component.statement = generateMockStatement();
    component.totalRewardsHistoryFeatureFlag.value = false;

    // act
    fixture.detectChanges();

    // assert
    const historyButton = fixture.nativeElement.querySelector('.statement-history');
    expect(historyButton).toBeFalsy();
  });

  it('should not show the Statement History button when statement does not have a last generated date and the history feature flag is enabled', () => {
    // arrange
    component.statement = generateMockStatement();
    component.statement.LastGeneratedDate = null;
    component.totalRewardsHistoryFeatureFlag.value = true;

    // act
    fixture.detectChanges();

    // assert
    const historyButton = fixture.nativeElement.querySelector('.statement-history');
    expect(historyButton).toBeFalsy();
  });

  it('should show the Statement History button when statement has a last generated date and the history feature flag is enabled', () => {
    // arrange
    component.statement = generateMockStatement();
    component.totalRewardsHistoryFeatureFlag.value = true;

    // act
    fixture.detectChanges();

    // assert
    const historyButton = fixture.nativeElement.querySelector('.statement-history');
    expect(historyButton).toBeTruthy();
  });
});
