import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import * as fromCompanyReducer from 'libs/features/company/reducers';
import { generateMockUserContext } from 'libs/models';

import * as fromOrganizationalDataActions from '../../../actions/organizational-data-page.action';
import { EntityUploadComponent } from '../../../components';
import { ConfigurationGroup, getEntityChoicesForOrgLoader } from '../../../models';
import { OrgDataLoadComponent } from './';

describe('OrgDataLoadComponent', () => {
  let instance: OrgDataLoadComponent;
  let fixture: ComponentFixture<OrgDataLoadComponent>;
  let store: Store<fromCompanyReducer.State>;
  const companies = [{ CompanyId: 1, CompanyName: 'Test1' }, { CompanyId: 2, CompanyName: 'abc2' }];


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [OrgDataLoadComponent, EntityUploadComponent],
      providers: [provideMockStore({})],
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

    instance.selectedCompany = companies[0];
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

  it('should not increment step on btn click with invalid delimiter info for step 3', () => {
    instance.stepIndex = 3;
    instance.loadOptions = getEntityChoicesForOrgLoader();
    instance.selectedDelimiter = null;
    const ret = instance.areStepsValid();
    expect(ret).toBe(false);
    instance.nextBtnClick();
    expect(instance.stepIndex).toBe(3);
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

  it('should show company selector page for admins', () => {
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

  it('should step back when clicking button', () => {
    instance.userContext = generateMockUserContext();
    instance.loadOptions = getEntityChoicesForOrgLoader();

    instance.stepIndex = 2;
    instance.goBack();
    expect(instance.stepIndex).toBe(1);

    instance.uploadComponent = {
      ClearAllFiles: jest.fn(),
      ClearAllErrorMessages: jest.fn()
    };

    instance.stepIndex = 3;
    instance.goBack();
    expect(instance.stepIndex).toBe(2);
  });

  it('should dispatch a GetOrganizationalHeadersLink on onInit', () => {
    instance.ngOnInit();
    const action = new fromOrganizationalDataActions.GetOrganizationalHeadersLink();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch an action to open message on link on without URL', () => {
    const openEvent: Event = new Event('open');
    spyOn(openEvent, 'preventDefault');
    instance.goToLink(openEvent, null);
    const action = new fromOrganizationalDataActions.SetModalStateOpen(true);
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should open new window with link if has url', () => {
    const openEvent: Event = new Event('open');
    spyOn(openEvent, 'preventDefault');
    spyOn(window, 'open');
    const url = 'www.google.com';
    instance.goToLink(openEvent, url);
    fixture.detectChanges();
    expect(window.open).toHaveBeenCalledWith(url, '_blank');

  });

  it('should add and selected mapping correctly', () => {
    const configGroupd: ConfigurationGroup = { GroupName: 'abc', CompanyId: 13, LoaderConfigurationGroupId: 34 };
    instance.AddAndSetSelectedMapping(configGroupd);
    expect(instance.selectedMapping.LoaderConfigurationGroupId).toEqual(configGroupd.LoaderConfigurationGroupId);
  });

  it('should dispatch action on click with valid company', () => {
    instance.selectedCompany = companies[0];
    instance.orgDataExportAction();
    const action = new fromOrganizationalDataActions.PublishDownloadOrgDataMessage(companies[0].CompanyId);
    expect(store.dispatch).toHaveBeenCalledWith(action);

  });

});
