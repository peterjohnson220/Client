import {SimpleChange} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/compiler/src/core';

import {Store} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';

import {OrgDataEntityType} from 'libs/constants/hris-api';

import {TransferScheduleCardComponent} from './transfer-schedule-card.component';
import * as fromTransferSchedulePageActions from '../../actions/transfer-schedule.actions';
import * as fromTransferScheduleReducers from '../../reducers/transfer-schedule.reducer';

describe('TransferScheduleCardComponent', () => {
  let component: TransferScheduleCardComponent;
  let fixture: ComponentFixture<TransferScheduleCardComponent>;
  let store: MockStore<any>;

  const initialState = { data_management: { transferSchedule: fromTransferScheduleReducers.initialState} };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({initialState})
      ],
      declarations: [ TransferScheduleCardComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferScheduleCardComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should show an empty form if summary has never been saved', () => {
    component.transferSchedule = {
      entityMappingType_ID: 1,
      entityMappingTypeCode: OrgDataEntityType.Employees,
      entityMappingTypeName: 'Employees',
      supported: true,
      expression: null
    };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(component.active).toBe(true);
    expect(fixture).toMatchSnapshot();
  });

  it('should show a saveable form if the summary has been saved before', () => {
    component.transferSchedule = {
      entityMappingType_ID: 1,
      entityMappingTypeCode: OrgDataEntityType.Employees,
      entityMappingTypeName: 'Employees',
      supported: true,
      expression: '* * * * *',
      active: 1,
      syncSchedule_ID: 1
    };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a disable action correctly', () => {
    spyOn(store, 'dispatch');

    component.transferSchedule = {
      entityMappingType_ID: 1,
      entityMappingTypeCode: OrgDataEntityType.Employees,
      entityMappingTypeName: 'Employees',
      supported: true,
      expression: '* * * * *',
      active: 1,
      syncSchedule_ID: 1
    };
    component.newExpression = '0 0 * * *';
    component.ngOnChanges({transferSchedule: new SimpleChange(null, component.transferSchedule, true)});
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    component.toggleSchedule();

    const expectedAction = new fromTransferSchedulePageActions.DisableTransferSchedule(1);

    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('should dispatch an enable action correctly', () => {
    spyOn(store, 'dispatch');

    component.transferSchedule = {
      entityMappingType_ID: 1,
      entityMappingTypeCode: OrgDataEntityType.Employees,
      entityMappingTypeName: 'Employees',
      supported: true,
      expression: '* * * * *',
      active: 0,
      syncSchedule_ID: 1
    };
    component.newExpression = '0 0 * * *';
    component.ngOnChanges({transferSchedule: new SimpleChange(null, component.transferSchedule, true)});
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    component.toggleSchedule();

    const expectedAction = new fromTransferSchedulePageActions.EnableTransferSchedule(1);

    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('should dispatch a save when disabling a schedule that does not exist yet', () => {
    spyOn(store, 'dispatch');

    component.transferSchedule = {
      entityMappingType_ID: 1,
      entityMappingTypeCode: OrgDataEntityType.Employees,
      entityMappingTypeName: 'Employees',
      supported: true,
      expression: null
    };
    component.ngOnChanges({transferSchedule: new SimpleChange(null, component.transferSchedule, true)});
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    component.toggleSchedule();

    const expectedAction = new fromTransferSchedulePageActions.SaveTransferSchedule({
      SyncSchedule_ID: 0,
      Active: false,
      EntityMappingType_ID: 1,
      Expression: '59 23 31 12 *'
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction);
  });

  it('should not dispatch an action when enabling a junk schedule', () => {
    spyOn(store, 'dispatch');

    component.transferSchedule = {
      entityMappingType_ID: 1,
      entityMappingTypeCode: OrgDataEntityType.Employees,
      entityMappingTypeName: 'Employees',
      supported: true,
      active: 0,
      expression: '59 23 31 12 *',
    };
    component.ngOnChanges({transferSchedule: new SimpleChange(null, component.transferSchedule, true)});
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    component.toggleSchedule();

    expect(store.dispatch).toHaveBeenCalledTimes(0);
  });

  it('should not save if no changes were made', () => {
    spyOn(store, 'dispatch');

    component.save();

    expect(store.dispatch).toHaveBeenCalledTimes(0);

    component.transferSchedule = {
      entityMappingType_ID: 1,
      entityMappingTypeCode: OrgDataEntityType.Employees,
      entityMappingTypeName: 'Employees',
      supported: true,
      expression: null
    };
    component.ngOnChanges({transferSchedule: new SimpleChange(null, component.transferSchedule, true)});
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    component.save();

    expect(store.dispatch).toHaveBeenCalledTimes(0);
  });

  it('should not save if a new expression was not set', () => {
    spyOn(store, 'dispatch');

    component.transferSchedule = {
      entityMappingType_ID: 1,
      entityMappingTypeCode: OrgDataEntityType.Employees,
      entityMappingTypeName: 'Employees',
      supported: true,
      active: 1,
      expression: '* * * * *'
    };
    component.ngOnChanges({transferSchedule: new SimpleChange(null, component.transferSchedule, true)});
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    component.setCronExpression({expression: '* * * * *', force: false});
    component.setCronExpression({expression: '* * * * 1', force: false});
    component.setCronExpression({expression: '* * * * *', force: false});

    component.save();

    expect(store.dispatch).toHaveBeenCalledTimes(0);
  });

  it('should save if a new expression was set', () => {
    spyOn(store, 'dispatch');

    component.transferSchedule = {
      entityMappingType_ID: 1,
      entityMappingTypeCode: OrgDataEntityType.Employees,
      entityMappingTypeName: 'Employees',
      supported: true,
      active: 1,
      expression: '* * * * *'
    };
    component.ngOnChanges({transferSchedule: new SimpleChange(null, component.transferSchedule, true)});
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    component.setCronExpression({expression: '* * * * 1', force: false});
    component.save();

    const expectedAction = new fromTransferSchedulePageActions.SaveTransferSchedule({
      Expression: '* * * * 1',
      EntityMappingType_ID: 1,
      SyncSchedule_ID: 0,
      Active: true
    });

    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction);
  });

  it('should create a junk schedule if we disable with no real schedule', () => {
    spyOn(store, 'dispatch');

    component.transferSchedule = {
      entityMappingType_ID: 1,
      entityMappingTypeCode: OrgDataEntityType.Employees,
      entityMappingTypeName: 'Employees',
      supported: true,
      expression: null
    };
    component.ngOnChanges({transferSchedule: new SimpleChange(null, component.transferSchedule, true)});

    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    component.toggleSchedule();
  });

  it('should soft enable a schedule when a disabled schedule is edited', () => {
    component.editMode = false;
    component.active = false;

    component.setEditMode();
    expect(component.editMode).toEqual(true);
    expect(component.active).toEqual(true);
  });
});
