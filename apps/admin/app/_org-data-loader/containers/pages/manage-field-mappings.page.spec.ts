import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NotificationService, NotificationSettings } from '@progress/kendo-angular-notification';
import { of } from 'rxjs';

import { LoaderFieldMappingsApiService } from 'libs/data/payfactors-api/data-loads/index';
import {CompanySelectorComponent} from 'libs/features/company/company-selector/components';
import { LoaderEntityStatus } from 'libs/features/org-data-loader/models';
import * as fromLoaderSettingsActions from 'libs/features/org-data-loader/state/actions/loader-settings.actions';
import { GenerateMockEmailRecipient, MappingModel } from 'libs/models/data-loads';
import { ConfigSettingsSelectorFactory } from 'libs/state/app-context/services';
import * as fromRootState from 'libs/state/state';
import { CompanySettingsApiService } from 'libs/data/payfactors-api';

import * as fromOrgDataLoaderReducer from '../../reducers';
import * as fromOrgDataFieldMappingsActions from '../../actions/org-data-field-mappings.actions';
import { ManageFieldMappingsPageComponent } from './manage-field-mappings.page';
import { LoaderType } from '../../constants';
import { AbstractFeatureFlagService, FeatureFlagContext } from 'libs/core/services/feature-flags';

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

  class MockCompanySettingsApiService {
    constructor() {
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

  class MockAbstractFeatureFlagService {
    bindEnabled(key: string, defaultValue?: boolean, context?: FeatureFlagContext) {
      jest.fn();
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
        {
          provide: CompanySettingsApiService,
          useClass: MockCompanySettingsApiService,
        },
        {
          provide: AbstractFeatureFlagService,
          useClass: MockAbstractFeatureFlagService
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(ManageFieldMappingsPageComponent);
    component = fixture.componentInstance;
    component.selectedCompany = {CompanyId: 13, CompanyName: 'Test', CombinedDetail: 'Test (13)'};
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
    component.selectedCompany = {CompanyId: 13, CompanyName: 'Test', CombinedDetail: 'Test (13)'};
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

});
