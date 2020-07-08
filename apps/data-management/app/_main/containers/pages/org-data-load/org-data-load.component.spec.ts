import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { LoadTypes, CompositeDataLoadTypes } from 'libs/constants';
import * as fromCompanyReducer from 'libs/features/company/reducers';
import { CompanySettingsEnum, ConfigurationGroup, generateMockUserContext } from 'libs/models';

import * as fromOrganizationalDataActions from '../../../actions/organizational-data-page.action';
import { EntityUploadComponent } from '../../../components';
import { getEntityChoicesForOrgLoader } from '../../../models';
import { OrgDataLoadComponent } from './';

describe('OrgDataLoadComponent', () => {
  let instance: OrgDataLoadComponent;
  let fixture: ComponentFixture<OrgDataLoadComponent>;
  let store: Store<fromCompanyReducer.State>;
  const companies = [{ CompanyId: 1, CompanyName: 'Test1', CombinedDetail: 'Test1 (1)' }, { CompanyId: 2, CompanyName: 'abc2', CombinedDetail: 'abc2 (2)' }];
  const companySetting_ManualOrgDataLoadLink_True = [
    {Key: CompanySettingsEnum.ManualOrgDataLoadLink, DisplayName: 'Manual Org Data Load Link', Value: 'true', Visible: true, DataType: 'string'}];
  const companySetting_ManualOrgDataLoadLink_False = [
    {Key: CompanySettingsEnum.ManualOrgDataLoadLink, DisplayName: 'Manual Org Data Load Link', Value: 'false', Visible: true, DataType: 'string'}];


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgbTooltipModule],
      declarations: [OrgDataLoadComponent, EntityUploadComponent],
      providers: [provideMockStore({})],
      schemas: [NO_ERRORS_SCHEMA]
    });


    store = TestBed.inject(Store);
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


  it('should increment step on btn click with valid info for step 2', () => {
    instance.stepIndex = 2;
    instance.loadOptions = getEntityChoicesForOrgLoader();
    instance.loadOptions[1].isChecked = true;
    // @ts-ignore
    instance.tooltip = { open: jest.fn() };
    const ret = instance.areStepsValid();
    expect(ret).toBe(true);

    instance.nextBtnClick();
    expect(instance.tooltip.open).toBeCalled();
    expect(instance.stepIndex).toBe(3);

  });

  it('should show company selector page for admins', () => {
    instance.userContext = generateMockUserContext();
    instance.companySettings = companySetting_ManualOrgDataLoadLink_True;
    instance.setInitValues();
    expect(instance.stepIndex).toBe(1);
    expect(instance.selectedCompany).toBe(null);

  });

  it('should not show company selector for users', () => {

    instance.companies = companies;
    instance.userContext = generateMockUserContext();
    instance.userContext.AccessLevel = 'User';
    instance.userContext.CompanyId = 2;
    instance.companySettings = companySetting_ManualOrgDataLoadLink_True;
    instance.setInitValues();
    expect(instance.stepIndex).toBe(2);
    expect(instance.selectedCompany).toBe(companies[1]);
  });

  it('should show page when manualorgdataloadlink company setting is true for users', () => {
    instance.userContext = generateMockUserContext();
    instance.userContext.AccessLevel = 'User';
    instance.companySettings = companySetting_ManualOrgDataLoadLink_True;
    expect(instance.validateAccess()).toBe(false);
  });

  it('should not show page when manualorgdataloadlink company setting is false for users', () => {
    instance.userContext = generateMockUserContext();
    instance.userContext.AccessLevel = 'User';
    instance.companySettings = companySetting_ManualOrgDataLoadLink_False;
    expect(instance.validateAccess()).toBe(true);
  });

  it('should step back when clicking button', () => {
    instance.userContext = generateMockUserContext();
    instance.loadOptions = getEntityChoicesForOrgLoader();

    instance.stepIndex = 2;
    instance.goBack();
    expect(instance.stepIndex).toBe(1);

    // @ts-ignore
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
    const configGroup: ConfigurationGroup = {
      GroupName: 'abc',
      CompanyId: 13,
      LoaderConfigurationGroupId: 34,
      LoadType: LoadTypes.Manual,
      PrimaryCompositeDataLoadType: CompositeDataLoadTypes.OrgData
    };
    instance.AddAndSetSelectedMapping(configGroup);
    expect(instance.selectedMapping.LoaderConfigurationGroupId).toEqual(configGroup.LoaderConfigurationGroupId);
  });

  it('should dispatch action on click with valid company', () => {
    instance.selectedCompany = companies[0];
    instance.orgDataExportAction();
    const action = new fromOrganizationalDataActions.PublishDownloadOrgDataMessage(companies[0].CompanyId);
    expect(store.dispatch).toHaveBeenCalledWith(action);

  });

});
