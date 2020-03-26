import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { NotificationService, NotificationSettings } from '@progress/kendo-angular-notification';

import { LoaderFieldMappingsApiService } from 'libs/data/payfactors-api/data-loads/index';
import * as fromLoaderSettingsActions from 'libs/features/org-data-loader/state/actions/loader-settings.actions';
import { ConfigSettingsSelectorFactory } from 'libs/state/app-context/services';
import * as fromRootState from 'libs/state/state';
import { LoaderEntityStatus } from 'libs/features/org-data-loader/models';
import { generateMockConfigurationGroup, GenerateMockEmailRecipient, MappingModel } from 'libs/models/data-loads';
import {CompanySelectorComponent} from 'libs/features/company/components';

import * as fromOrgDataLoaderReducer from '../../reducers';
import * as fromOrgDataFieldMappingsActions from '../../actions/org-data-field-mappings.actions';
import { ManageFieldMappingsPageComponent } from './manage-field-mappings.page';
import { LoaderType } from '../../constants';
import { of } from 'rxjs';

describe('ManageFieldMapperPageComponent', () => {
  let component: ManageFieldMappingsPageComponent;
  let fixture: ComponentFixture<ManageFieldMappingsPageComponent>;
  let store: Store<fromRootState.State>;

  class MockNotificationService {
    show: (settings: NotificationSettings) => void;

    constructor() {
      this.show = jest.fn();
    }
  }

  let mockSftpDomainSelector = jest.fn();
  let mockSftpPortSelector = jest.fn();

  class MockConfigSettingsSelectorFactory {
    getConfigSettingsSelector(key: string) {
      let selector: jest.Mock;
      switch (key) {
        case 'SftpDomain':
          selector = mockSftpDomainSelector;
          break;
        case 'SftpPort':
          selector = mockSftpPortSelector;
          break;
      }
      return selector;
    }
  }

  beforeEach(() => {
    mockSftpDomainSelector = jest.fn();
    mockSftpPortSelector = jest.fn();
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          orgDataLoader: combineReducers(fromOrgDataLoaderReducer.reducers)
        }),
        RouterTestingModule
      ],
      declarations: [ManageFieldMappingsPageComponent, CompanySelectorComponent],
      providers: [
        {
          provide: ConfigSettingsSelectorFactory,
          useClass: MockConfigSettingsSelectorFactory
        },
        {
          provide: LoaderFieldMappingsApiService,
        },
        {
          provide: NotificationService,
          useClass: MockNotificationService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    store = TestBed.get(Store);

    spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(ManageFieldMappingsPageComponent);
    component = fixture.componentInstance;
    component.selectedCompany = {CompanyId: 13, CompanyName: 'Test'};
    component.visibleLoaderOptions = {
      clientFileName: true,
      selectFile: true
    };
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide the field mapper when a company has not been selected', () => {
    component.selectedCompany = undefined;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the field mapper when a company has been selected', () => {
    component.selectedCompany = {CompanyId: 13, CompanyName: 'Test'};
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  /**
   * toast notification tests disabled because test needs to be able to mock out the store,
   * which costs more to implement than the tests are worth now
   *
   * thinking about how we can fix this going forward...
   */
  xit('should display toast on save mappings success', inject([NotificationService], fakeAsync((service: NotificationService) => {
    // arrange
    const action = new fromOrgDataFieldMappingsActions.LoadingFieldMappingsSuccess([]);

    // act
    store.dispatch(action);

    tick();

    // assert
    expect(service.show).toHaveBeenCalledTimes(1);
  })));

  xit('should display toast on save mappings error', inject([NotificationService], fakeAsync((service: NotificationService) => {
    // arrange
    const action = new fromOrgDataFieldMappingsActions.LoadingFieldMappingsError();

    // act
    store.dispatch(action);

    tick();

    // assert
    expect(service.show).toHaveBeenCalledTimes(1);
  })));

  xit('should display toast on save settings success', inject([NotificationService], fakeAsync((service: NotificationService) => {
    // arrange
    const action = new fromLoaderSettingsActions.SavingLoaderSettingsSuccess();

    // act
    store.dispatch(action);

    tick();

    // assert
    expect(service.show).toHaveBeenCalledTimes(1);
  })));

  xit('should display toast on save settings error', inject([NotificationService], fakeAsync((service: NotificationService) => {
    // arrange
    const action = new fromLoaderSettingsActions.SavingLoaderSettingsError();

    // act
    store.dispatch(action);

    tick();

    // assert
    expect(service.show).toHaveBeenCalledTimes(1);
  })));

  it('should disable the save button when not all mappings are complete', () => {
    component.paymarketMappingComplete = true;
    component.jobMappingComplete = true;
    component.structureMappingComplete = true;
    component.structureMappingMappingComplete = true;
    component.employeeMappingComplete = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should disable the save button when no delimiter is specified', () => {
    component.delimiter = '';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should enable the save button when all mappings are complete AND a delimiter is specified', () => {
    component.paymarketMappingComplete = true;
    component.jobMappingComplete = true;
    component.structureMappingComplete = true;
    component.structureMappingMappingComplete = true;
    component.employeeMappingComplete = true;
    component.delimiter = ',';
    component.emailRecipients$ = of([GenerateMockEmailRecipient()]);
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should add a paymarket mapping to the list of mappings when the paymarket mapping is complete ' +
    'and no paymarket mapping exists yet', () => {
      const evt: LoaderEntityStatus = {
        complete: true,
        loaderType: LoaderType.PayMarkets,
        mappings: ['Paymarket__Paymarket'],
      };
      component.mappings = [];
      component.onPaymarketMappingComplete(evt);

      fixture.detectChanges();

      const expectedValue: MappingModel = {
        LoaderType: LoaderType.PayMarkets,
        Mappings: ['Paymarket__Paymarket']
      };

      expect(component.mappings).toEqual([expectedValue]);
    });

  it('should replace a paymarket mapping in the list of mappings when the paymarket mapping is complete ' +
    'and a paymarket mapping exists', () => {
      const evt: LoaderEntityStatus = {
        complete: true,
        loaderType: LoaderType.PayMarkets,
        mappings: ['Country__Country Code'],
      };
      component.mappings = [{ LoaderType: 'PayMarkets', Mappings: ['Paymarket__Paymarket'] }];
      component.onPaymarketMappingComplete(evt);

      fixture.detectChanges();

      const expectedValue: MappingModel = {
        LoaderType: LoaderType.PayMarkets,
        Mappings: ['Country__Country Code']
      };

      expect(component.mappings).toEqual([expectedValue]);
    });

  it('should add a job mapping to the list of mappings when the job mapping is complete ' +
    'and no job mapping exists yet', () => {
      const evt: LoaderEntityStatus = {
        complete: true,
        loaderType: LoaderType.Jobs,
        mappings: ['Job_Code__Job Code'],
      };
      component.mappings = [];
      component.onJobMappingComplete(evt);

      fixture.detectChanges();

      const expectedValue: MappingModel = {
        LoaderType: LoaderType.Jobs,
        Mappings: ['Job_Code__Job Code']
      };

      expect(component.mappings).toEqual([expectedValue]);
    });

  it('should replace a job mapping in the list of mappings when the job mapping is complete ' +
    'and a job mapping exists', () => {
      const evt: LoaderEntityStatus = {
        complete: true,
        loaderType: LoaderType.Jobs,
        mappings: ['Job_Title__Job Title'],
      };
      component.mappings = [{ LoaderType: 'Jobs', Mappings: ['Job_Code__Job Code'] }];
      component.onJobMappingComplete(evt);

      fixture.detectChanges();

      const expectedValue: MappingModel = {
        LoaderType: 'Jobs',
        Mappings: ['Job_Title__Job Title']
      };

      expect(component.mappings).toEqual([expectedValue]);
    });

  it('should add a structure mapping to the list of mappings when the structure mapping is complete ' +
    'and no structure mapping exists yet', () => {
      const evt: LoaderEntityStatus = {
        complete: true,
        loaderType: LoaderType.Structures,
        mappings: ['Structure_Code__Structure Code'],
      };
      component.mappings = [];
      component.onStructureMappingComplete(evt);

      fixture.detectChanges();

      const expectedValue: MappingModel = {
        LoaderType: 'Structures',
        Mappings: ['Structure_Code__Structure Code']
      };

      expect(component.mappings).toEqual([expectedValue]);
    });

  it('should replace a structure mapping in the list of mappings when the structure mapping is complete ' +
    'and a structure mapping exists', () => {
      const evt: LoaderEntityStatus = {
        complete: true,
        loaderType: LoaderType.Structures,
        mappings: ['Grade_Code__Grade Code'],
      };
      component.mappings = [{ LoaderType: 'Structures', Mappings: ['Structure_Code__Structure Code'] }];
      component.onStructureMappingComplete(evt);

      fixture.detectChanges();

      const expectedValue: MappingModel = {
        LoaderType: 'Structures',
        Mappings: ['Grade_Code__Grade Code']
      };

      expect(component.mappings).toEqual([expectedValue]);
    });

  it('should add a structuremapping mapping to the list of mappings when the structuremapping mapping is complete ' +
    'and no structuremapping mapping exists yet', () => {
      const evt: LoaderEntityStatus = {
        complete: true,
        loaderType: LoaderType.StructureMapping,
        mappings: ['Job_Code__Job Code'],
      };
      component.mappings = [];
      component.onStructureMappingMappingComplete(evt);

      fixture.detectChanges();

      const expectedValue: MappingModel = {
        LoaderType: 'StructureMapping',
        Mappings: ['Job_Code__Job Code']
      };

      expect(component.mappings).toEqual([expectedValue]);
    });

  it('should replace a structuremapping mapping in the list of mappings when the structuremapping mapping is complete ' +
    'and a structuremapping mapping exists', () => {
      const evt: LoaderEntityStatus = {
        complete: true,
        loaderType: LoaderType.StructureMapping,
        mappings: ['Structure_Code__Structure Code'],
      };
      component.mappings = [{ LoaderType: 'StructureMapping', Mappings: ['Job_Code__Job Code'] }];
      component.onStructureMappingMappingComplete(evt);

      fixture.detectChanges();

      const expectedValue: MappingModel = {
        LoaderType: 'StructureMapping',
        Mappings: ['Structure_Code__Structure Code']
      };

      expect(component.mappings).toEqual([expectedValue]);
    });

  it('should add a employee mapping to the list of mappings when the employee mapping is complete ' +
    'and no employee mapping exists yet', () => {
      const evt: LoaderEntityStatus = {
        complete: true,
        loaderType: LoaderType.Employees,
        mappings: ['Base__Salary'],
      };
      component.mappings = [];
      component.onEmployeeMappingComplete(evt);

      fixture.detectChanges();

      const expectedValue: MappingModel = {
        LoaderType: 'Employees',
        Mappings: ['Base__Salary']
      };

      expect(component.mappings).toEqual([expectedValue]);
    });

  it('should replace a employee mapping in the list of mappings when the employee mapping is complete ' +
    'and an employee mapping exists', () => {
      const evt: LoaderEntityStatus = {
        complete: true,
        loaderType: LoaderType.Employees,
        mappings: ['First_Name__First Name'],
      };
      component.mappings = [{ LoaderType: 'Employees', Mappings: ['Base__Salary'] }];
      component.onEmployeeMappingComplete(evt);

      fixture.detectChanges();

      const expectedValue: MappingModel = {
        LoaderType: 'Employees',
        Mappings: ['First_Name__First Name']
      };

      expect(component.mappings).toEqual([expectedValue]);
    });

  it('should call SavingFieldMappings action when SaveMappings has been called', () => {
    component.mappings = [{ LoaderType: 'Employees', Mappings: ['Base__Salary'] }];
    component.selectedCompany = {CompanyId: 13, CompanyName: 'Test'};
    component.selectedConfigGroup = generateMockConfigurationGroup();
    const expectedPayload = {
      mappings: component.mappings,
      companyId: component.selectedCompany.CompanyId,
      loaderConfigurationGroupId: 1
    };

    spyOn(fromOrgDataFieldMappingsActions, 'SavingFieldMappings');

    component.SaveMappings();

    fixture.detectChanges();

    expect(fromOrgDataFieldMappingsActions.SavingFieldMappings).toHaveBeenCalledWith(expectedPayload);
  });

  it('should not call SavingFieldMappings action when there are no mappings', () => {
    component.mappings = [];

    fixture.detectChanges();

    spyOn(fromOrgDataFieldMappingsActions, 'SavingFieldMappings');
    component.selectedCompany = {CompanyId: 13, CompanyName: 'Test'};
    component.SaveMappings();

    expect(fromOrgDataFieldMappingsActions.SavingFieldMappings).not.toHaveBeenCalled();
  });

  it('should add the delimiter to loaderSettingsToSave array on Save when company setting does not exist' +
    ' and dispatch SavingLoaderSettings action', () => {
      component.existingCompanyLoaderSettings = [
        { LoaderSettingsId: 1, KeyName: 'IsEmployeesFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 2, KeyName: 'IsStructureMappingsFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 3, KeyName: 'IsEmployeesLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 4, KeyName: 'IsJobsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 5, KeyName: 'IsPaymarketsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 6, KeyName: 'IsStructuresLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 7, KeyName: 'IsStructureMappingsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 8, KeyName: 'IsActive', KeyValue: 'true' },
        { LoaderSettingsId: 9, KeyName: 'ValidateOnly', KeyValue: 'false' }
      ];
      component.delimiter = '|';
      component.isEmployeesFullReplace = true;
      component.isStructureMappingsFullReplace = true;
      component.selectedCompany = {CompanyId: 13, CompanyName: 'Test'};
      component.selectedConfigGroup = generateMockConfigurationGroup();
      fixture.detectChanges();

      const expectedPayload = {
        settings: [{ LoaderSettingId: undefined, KeyName: 'Delimiter', KeyValue: '|' }],
        companyId: 13,
        loaderConfigurationGroupId: 1,
      };
      spyOn(fromLoaderSettingsActions, 'SavingLoaderSettings');

      component.SaveMappings();

      expect(fromLoaderSettingsActions.SavingLoaderSettings).toHaveBeenCalledWith(expectedPayload);
    });

  it('should add the delimiter to loaderSettingsToSave array on Save when the delimiter is different from the company setting' +
    ' and dispatch SavingLoaderSettings action', () => {
      component.existingCompanyLoaderSettings = [
        { LoaderSettingsId: 1, KeyName: 'Delimiter', KeyValue: ',' },
        { LoaderSettingsId: 2, KeyName: 'IsEmployeesFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 3, KeyName: 'IsStructureMappingsFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 4, KeyName: 'IsEmployeesLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 5, KeyName: 'IsJobsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 6, KeyName: 'IsPaymarketsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 7, KeyName: 'IsStructuresLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 8, KeyName: 'IsStructureMappingsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 9, KeyName: 'IsActive', KeyValue: 'true' },
        { LoaderSettingsId: 10, KeyName: 'ValidateOnly', KeyValue: 'false' }
      ];
      component.delimiter = '|';
      component.isEmployeesFullReplace = true;
      component.isStructureMappingsFullReplace = true;
      component.selectedCompany = {CompanyId: 13, CompanyName: 'Test'};
      component.selectedConfigGroup = generateMockConfigurationGroup();
      fixture.detectChanges();

      const expectedPayload = { settings: [{ LoaderSettingId: undefined, KeyName: 'Delimiter', KeyValue: '|' }], companyId: 13, loaderConfigurationGroupId: 1 };
      spyOn(fromLoaderSettingsActions, 'SavingLoaderSettings');

      component.SaveMappings();

      expect(fromLoaderSettingsActions.SavingLoaderSettings).toHaveBeenCalledWith(expectedPayload);
    });

  it('should add the dateFormat to loaderSettingsToSave array on Save when company setting does not exist' +
    ' and dispatch SavingLoaderSettings action', () => {
      component.existingCompanyLoaderSettings = [
        { LoaderSettingsId: 1, KeyName: 'IsEmployeesFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 2, KeyName: 'IsStructureMappingsFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 3, KeyName: 'IsEmployeesLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 4, KeyName: 'IsJobsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 5, KeyName: 'IsPaymarketsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 6, KeyName: 'IsStructuresLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 7, KeyName: 'IsStructureMappingsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 8, KeyName: 'IsActive', KeyValue: 'true' },
        { LoaderSettingsId: 9, KeyName: 'ValidateOnly', KeyValue: 'false' }
      ];
      component.delimiter = '';
      component.dateFormat = 'MM/dd/yyyy';
      component.isEmployeesFullReplace = true;
      component.isStructureMappingsFullReplace = true;
      component.selectedCompany = {CompanyId: 13, CompanyName: 'Test'};
      component.selectedConfigGroup = generateMockConfigurationGroup();
      fixture.detectChanges();

      const expectedPayload = {
        settings: [{ LoaderSettingId: undefined, KeyName: 'DateFormat', KeyValue: 'MM/dd/yyyy' }],
        companyId: 13,
        loaderConfigurationGroupId: 1 };
      spyOn(fromLoaderSettingsActions, 'SavingLoaderSettings');

      component.SaveMappings();

      expect(fromLoaderSettingsActions.SavingLoaderSettings).toHaveBeenCalledWith(expectedPayload);
    });

  it('should add the dateFormat to loaderSettingsToSave array on Save when the dateFormat is different from the company setting' +
    ' and dispatch SavingLoaderSettings action', () => {
      component.existingCompanyLoaderSettings = [
        { LoaderSettingsId: 1, KeyName: 'DateFormat', KeyValue: 'MM-dd-yyyy' },
        { LoaderSettingsId: 2, KeyName: 'IsEmployeesFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 3, KeyName: 'IsStructureMappingsFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 4, KeyName: 'IsEmployeesLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 5, KeyName: 'IsJobsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 6, KeyName: 'IsPaymarketsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 7, KeyName: 'IsStructuresLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 8, KeyName: 'IsStructureMappingsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 9, KeyName: 'IsActive', KeyValue: 'true' },
        { LoaderSettingsId: 10, KeyName: 'ValidateOnly', KeyValue: 'false' }
      ];
      component.dateFormat = 'MM/dd/yyyy';
      component.delimiter = '';
      component.isEmployeesFullReplace = true;
      component.isStructureMappingsFullReplace = true;
      component.selectedCompany = {CompanyId: 13, CompanyName: 'Test'};
      component.selectedConfigGroup = generateMockConfigurationGroup();
      fixture.detectChanges();

      const expectedPayload = {
        settings: [{ LoaderSettingId: undefined, KeyName: 'DateFormat', KeyValue: 'MM/dd/yyyy' }],
        companyId: 13,
        loaderConfigurationGroupId: 1};
      spyOn(fromLoaderSettingsActions, 'SavingLoaderSettings');

      component.SaveMappings();

      expect(fromLoaderSettingsActions.SavingLoaderSettings).toHaveBeenCalledWith(expectedPayload);
    });

  it('should add the IsEmployeesFullReplace to loaderSettingsToSave array on Save when company setting changes' +
    ' and dispatch SavingLoaderSettings action', () => {
      component.existingCompanyLoaderSettings = [
        { LoaderSettingsId: 1, KeyName: 'IsEmployeesFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 2, KeyName: 'IsStructureMappingsFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 3, KeyName: 'IsEmployeesLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 4, KeyName: 'IsJobsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 5, KeyName: 'IsPaymarketsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 6, KeyName: 'IsStructuresLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 7, KeyName: 'IsStructureMappingsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 8, KeyName: 'IsActive', KeyValue: 'true' },
        { LoaderSettingsId: 9, KeyName: 'ValidateOnly', KeyValue: 'false' }
      ];
      component.delimiter = '';
      component.isEmployeesFullReplace = false;
      component.isStructureMappingsFullReplace = true;
      component.selectedCompany = {CompanyId: 13, CompanyName: 'Test'};
      component.selectedConfigGroup = generateMockConfigurationGroup();
      fixture.detectChanges();

      const expectedPayload = {
        settings: [{ LoaderSettingId: undefined, KeyName: 'IsEmployeesFullReplace', KeyValue: 'false' }],
        companyId: 13,
        loaderConfigurationGroupId: 1
      };
      spyOn(fromLoaderSettingsActions, 'SavingLoaderSettings');

      component.SaveMappings();

      expect(fromLoaderSettingsActions.SavingLoaderSettings).toHaveBeenCalledWith(expectedPayload);
    });

  it('should add the IsStructureMappingsFullReplace to loaderSettingsToSave array on Save when company setting changes' +
    ' and dispatch SavingLoaderSettings action', () => {
      component.existingCompanyLoaderSettings = [
        { LoaderSettingsId: 1, KeyName: 'IsEmployeesFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 2, KeyName: 'IsStructureMappingsFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 3, KeyName: 'IsEmployeesLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 4, KeyName: 'IsJobsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 5, KeyName: 'IsPaymarketsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 6, KeyName: 'IsStructuresLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 7, KeyName: 'IsStructureMappingsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 8, KeyName: 'IsActive', KeyValue: 'true' },
        { LoaderSettingsId: 9, KeyName: 'ValidateOnly', KeyValue: 'false' }
      ];
      component.delimiter = '';
      component.isEmployeesFullReplace = true;
      component.isStructureMappingsFullReplace = false;
      component.selectedCompany = {CompanyId: 13, CompanyName: 'Test'};
      component.selectedConfigGroup = generateMockConfigurationGroup();
      fixture.detectChanges();

      const expectedPayload = {
        settings: [{ LoaderSettingId: undefined, KeyName: 'IsStructureMappingsFullReplace', KeyValue: 'false' }],
        companyId: 13,
        loaderConfigurationGroupId: 1
      };
      spyOn(fromLoaderSettingsActions, 'SavingLoaderSettings');

      component.SaveMappings();

      expect(fromLoaderSettingsActions.SavingLoaderSettings).toHaveBeenCalledWith(expectedPayload);
    });

  it('should add the IsEmployeesLoadEnabled to loaderSettingsToSave array on Save when company setting changes' +
    ' and dispatch SavingLoaderSettings action', () => {
      component.existingCompanyLoaderSettings = [
        { LoaderSettingsId: 1, KeyName: 'IsEmployeesFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 2, KeyName: 'IsStructureMappingsFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 3, KeyName: 'IsEmployeesLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 4, KeyName: 'IsJobsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 5, KeyName: 'IsPaymarketsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 6, KeyName: 'IsStructuresLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 7, KeyName: 'IsStructureMappingsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 8, KeyName: 'IsActive', KeyValue: 'true' },
        { LoaderSettingsId: 9, KeyName: 'ValidateOnly', KeyValue: 'false' }
      ];
      component.delimiter = '';
      component.isEmployeesLoadEnabled = true;
      component.selectedCompany = {CompanyId: 13, CompanyName: 'Test'};
    component.selectedConfigGroup = generateMockConfigurationGroup();
      fixture.detectChanges();

      const expectedPayload = {
        settings: [{ LoaderSettingId: undefined, KeyName: 'IsEmployeesLoadEnabled', KeyValue: 'true' }],
        companyId: 13,
        loaderConfigurationGroupId: 1
      };
      spyOn(fromLoaderSettingsActions, 'SavingLoaderSettings');

      component.SaveMappings();

      expect(fromLoaderSettingsActions.SavingLoaderSettings).toHaveBeenCalledWith(expectedPayload);
    });

  it('should add the IsJobsLoadEnabled to loaderSettingsToSave array on Save when company setting changes' +
    ' and dispatch SavingLoaderSettings action', () => {
      component.existingCompanyLoaderSettings = [
        { LoaderSettingsId: 1, KeyName: 'IsEmployeesFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 2, KeyName: 'IsStructureMappingsFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 3, KeyName: 'IsEmployeesLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 4, KeyName: 'IsJobsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 5, KeyName: 'IsPaymarketsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 6, KeyName: 'IsStructuresLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 7, KeyName: 'IsStructureMappingsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 8, KeyName: 'IsActive', KeyValue: 'true' },
        { LoaderSettingsId: 9, KeyName: 'ValidateOnly', KeyValue: 'false' }
      ];
      component.delimiter = '';
      component.isJobsLoadEnabled = true;
      component.selectedCompany = {CompanyId: 13, CompanyName: 'Test'};
    component.selectedConfigGroup = generateMockConfigurationGroup();
      fixture.detectChanges();

      const expectedPayload = {
        settings: [{ LoaderSettingId: undefined, KeyName: 'IsJobsLoadEnabled', KeyValue: 'true' }],
        companyId: 13,
        loaderConfigurationGroupId: 1
      };
      spyOn(fromLoaderSettingsActions, 'SavingLoaderSettings');

      component.SaveMappings();

      expect(fromLoaderSettingsActions.SavingLoaderSettings).toHaveBeenCalledWith(expectedPayload);
    });

  it('should add the IsPaymarketsLoadEnabled to loaderSettingsToSave array on Save when company setting changes' +
    ' and dispatch SavingLoaderSettings action', () => {
      component.existingCompanyLoaderSettings = [
        { LoaderSettingsId: 1, KeyName: 'IsEmployeesFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 2, KeyName: 'IsStructureMappingsFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 3, KeyName: 'IsEmployeesLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 4, KeyName: 'IsJobsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 5, KeyName: 'IsPaymarketsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 6, KeyName: 'IsStructuresLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 7, KeyName: 'IsStructureMappingsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 8, KeyName: 'IsActive', KeyValue: 'true' },
        { LoaderSettingsId: 9, KeyName: 'ValidateOnly', KeyValue: 'false' }
      ];
      component.delimiter = '';
      component.isPaymarketsLoadEnabled = true;
      component.selectedCompany = {CompanyId: 13, CompanyName: 'Test'};
      component.selectedConfigGroup = generateMockConfigurationGroup();
      fixture.detectChanges();

      const expectedPayload = {
        settings: [{ LoaderSettingId: undefined, KeyName: 'IsPaymarketsLoadEnabled', KeyValue: 'true' }],
        companyId: 13,
        loaderConfigurationGroupId: 1
      };
      spyOn(fromLoaderSettingsActions, 'SavingLoaderSettings');

      component.SaveMappings();

      expect(fromLoaderSettingsActions.SavingLoaderSettings).toHaveBeenCalledWith(expectedPayload);
    });

  it('should add the IsStructuresLoadEnabled to loaderSettingsToSave array on Save when company setting changes' +
    ' and dispatch SavingLoaderSettings action', () => {
      component.existingCompanyLoaderSettings = [
        { LoaderSettingsId: 1, KeyName: 'IsEmployeesFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 2, KeyName: 'IsStructureMappingsFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 3, KeyName: 'IsEmployeesLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 4, KeyName: 'IsJobsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 5, KeyName: 'IsPaymarketsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 6, KeyName: 'IsStructuresLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 7, KeyName: 'IsStructureMappingsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 8, KeyName: 'IsActive', KeyValue: 'true' },
        { LoaderSettingsId: 9, KeyName: 'ValidateOnly', KeyValue: 'false' }
      ];
      component.delimiter = '';
      component.isStructuresLoadEnabled = true;
      component.selectedCompany = {CompanyId: 13, CompanyName: 'Test'};
      component.selectedConfigGroup = generateMockConfigurationGroup();
      fixture.detectChanges();

      const expectedPayload = {
        settings: [{ LoaderSettingId: undefined, KeyName: 'IsStructuresLoadEnabled', KeyValue: 'true' }],
        companyId: 13,
        loaderConfigurationGroupId: 1
      };
      spyOn(fromLoaderSettingsActions, 'SavingLoaderSettings');

      component.SaveMappings();

      expect(fromLoaderSettingsActions.SavingLoaderSettings).toHaveBeenCalledWith(expectedPayload);
    });

  it('should add the IsStructureMappingsLoadEnabled to loaderSettingsToSave array on Save when company setting changes' +
    ' and dispatch SavingLoaderSettings action', () => {
      component.existingCompanyLoaderSettings = [
        { LoaderSettingsId: 1, KeyName: 'IsEmployeesFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 2, KeyName: 'IsStructureMappingsFullReplace', KeyValue: 'true' },
        { LoaderSettingsId: 3, KeyName: 'IsEmployeesLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 4, KeyName: 'IsJobsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 5, KeyName: 'IsPaymarketsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 6, KeyName: 'IsStructuresLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 7, KeyName: 'IsStructureMappingsLoadEnabled', KeyValue: 'false' },
        { LoaderSettingsId: 8, KeyName: 'IsActive', KeyValue: 'true' },
        { LoaderSettingsId: 9, KeyName: 'ValidateOnly', KeyValue: 'false' }
      ];
      component.delimiter = '';
      component.isStructureMappingsLoadEnabled = true;
      component.selectedCompany = {CompanyId: 13, CompanyName: 'Test'};
      component.selectedConfigGroup = generateMockConfigurationGroup();
      fixture.detectChanges();

      const expectedPayload = {
        settings: [{ LoaderSettingId: undefined, KeyName: 'IsStructureMappingsLoadEnabled', KeyValue: 'true' }],
        companyId: 13,
        loaderConfigurationGroupId: 1
      };
      spyOn(fromLoaderSettingsActions, 'SavingLoaderSettings');

      component.SaveMappings();

      expect(fromLoaderSettingsActions.SavingLoaderSettings).toHaveBeenCalledWith(expectedPayload);
    });

  it('should not dispatch SavingLoaderSettings when there are no settings to be saved', () => {
    component.existingCompanyLoaderSettings = [
      { LoaderSettingsId: 1, KeyName: 'Delimiter', KeyValue: ',' },
      { LoaderSettingsId: 2, KeyName: 'IsEmployeesFullReplace', KeyValue: 'true' },
      { LoaderSettingsId: 3, KeyName: 'IsStructureMappingsFullReplace', KeyValue: 'true' },
      { LoaderSettingsId: 3, KeyName: 'IsEmployeesLoadEnabled', KeyValue: 'false' },
      { LoaderSettingsId: 4, KeyName: 'IsJobsLoadEnabled', KeyValue: 'false' },
      { LoaderSettingsId: 5, KeyName: 'IsPaymarketsLoadEnabled', KeyValue: 'false' },
      { LoaderSettingsId: 6, KeyName: 'IsStructuresLoadEnabled', KeyValue: 'false' },
      { LoaderSettingsId: 7, KeyName: 'IsStructureMappingsLoadEnabled', KeyValue: 'false' },
      { LoaderSettingsId: 8, KeyName: 'IsActive', KeyValue: 'true' },
      { LoaderSettingsId: 9, KeyName: 'ValidateOnly', KeyValue: 'false' }
    ];
    component.delimiter = ',';
    component.isEmployeesFullReplace = true;
    component.isStructureMappingsFullReplace = true;
    component.selectedConfigGroup = generateMockConfigurationGroup();
    fixture.detectChanges();

    spyOn(fromLoaderSettingsActions, 'SavingLoaderSettings');

    component.SaveMappings();

    expect(fromLoaderSettingsActions.SavingLoaderSettings).not.toHaveBeenCalled();
  });

});
