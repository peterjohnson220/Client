import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromCompanyReducer from 'libs/features/company/reducers';
import { generateMockUserContext } from 'libs/models';
import * as fromRootState from 'libs/state/state';

import { OrgDataLoadComponent } from './';
import { getEntityChoicesForOrgLoader } from '../../../models';

describe('OrgDataLoadComponent', () => {
  let instance: OrgDataLoadComponent;
  let fixture: ComponentFixture<OrgDataLoadComponent>;
  let store: Store<fromCompanyReducer.State>;
  const companies = [{ CompanyId: 1, CompanyName: 'Test1' }, { CompanyId: 2, CompanyName: 'abc2' }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_companyselector: combineReducers(fromCompanyReducer.reducers)
        }),
        RouterTestingModule
      ],
      declarations: [OrgDataLoadComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.get(Store);
    fixture = TestBed.createComponent(OrgDataLoadComponent);
    instance = fixture.componentInstance;
    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should increment step on btn click with valid info for step 1 ', () => {

    instance.stepIndex = 1;
    instance.selectedCompany = undefined;
    let ret = instance.areStepsValid();
    expect(ret).toBe(false);

    instance.selectedCompany = { CompanyId: 13, CompanyName: 'test' };
    ret = instance.areStepsValid();
    expect(ret).toBe(true);

    instance.nextBtnClick();
    expect(instance.stepIndex).toBe(2);

  });


  it('should not increment step on btn click with invalid info for step 2', () => {
    instance.stepIndex = 2;
    instance.loadOptions = getEntityChoicesForOrgLoader();
    const ret = instance.areStepsValid();
    expect(ret).toBe(false);
    instance.nextBtnClick();
    expect(instance.stepIndex).toBe(2);
  });

  it('should  increment step on btn click with valid info for step 2', () => {
    instance.stepIndex = 2;
    instance.loadOptions = getEntityChoicesForOrgLoader();
    instance.loadOptions[1].isChecked = true;
    const ret = instance.areStepsValid();
    expect(ret).toBe(true);

    instance.nextBtnClick();
    expect(instance.stepIndex).toBe(3);

  });

  it('should show company selector for admins', () => {
    instance.userContext = generateMockUserContext();

    instance.setInitValues();
    expect(instance.stepIndex).toBe(1);
    expect(instance.selectedCompany).toBe(null);

  });

  it('should not show company selector for users', () => {

    instance.companies = companies;
    instance.userContext = generateMockUserContext();
    instance.userContext.AccessLevel = 'User';
    instance.userContext.CompanyId = 2;
    instance.setInitValues();
    expect(instance.stepIndex).toBe(2);
    expect(instance.selectedCompany).toBe(companies[1]);
  });

  it('should redirect when clicking back from root', () => {
    instance.stepIndex = 2;
    instance.userContext = generateMockUserContext();
    instance.backBtnClick();
    expect(instance.stepIndex).toBe(1);
  });

});
