import { enableProdMode, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { CompanySettingsEnum } from 'libs/models';

import * as fromOrgDataAutoloaderReducer from '../../reducers';
import { FileMappingComponent } from '../../components';
import { EntityChoice, getEntityChoicesForOrgLoader } from '../../models';

describe('FileMappingComponent', () => {
  let component: FileMappingComponent;
  let fixture: ComponentFixture<FileMappingComponent>;
  let store: Store<fromRootState.State>;
  const customFields = [{ Key: '1', Value: 'Test' }, { Key: '2', Value: 'Test' }];
  const companySetting_EnableJobRangeStructureRangeTypes_False = [
    { Key: CompanySettingsEnum.EnableJobRangeStructureRangeTypes,
      DisplayName: 'Enable JobRange Structure RangeTypes', Value: 'false', Visible: true, DataType: 'string'}];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          orgDataLoader: combineReducers(fromOrgDataAutoloaderReducer.reducers)
        }),
        RouterTestingModule
      ],
      declarations: [FileMappingComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(FileMappingComponent);
    component = fixture.componentInstance;
    component.entities = getEntityChoicesForOrgLoader(true);
    component.entities.forEach(e => { e.customFields.Jobs = customFields, e.customFields.Employees = customFields; });
    component.selectedCompany = { CompanyId: 1, CompanyName: 'test', CombinedDetail: 'test (1)' };
    component.companySettings = companySetting_EnableJobRangeStructureRangeTypes_False;
    fixture.detectChanges();
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show tab enable', () => {
    component.entities[0].isChecked = true;
    const enabled = component.enabledTabs('PayMarkets');
    expect(enabled).toBe(true);
  });

  it('should select a tab', () => {
    component.entities[1].isSelectedTab = true;
    const selectedTab = component.selectedTab('Jobs');
    expect(selectedTab).toBe(true);
  });
});
