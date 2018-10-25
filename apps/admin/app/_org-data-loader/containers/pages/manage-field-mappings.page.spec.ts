import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { PfCommonUIModule } from 'libs/ui/common';
import { OrgDataFieldMappingsApiService } from 'libs/data/payfactors-api/org-data-loader';

import { MappingModel } from '../../models';
import * as fromOrgDataLoaderReducer from '../../reducers';
import * as fromOrgDataFieldMappingsActions from '../../actions/org-data-field-mappings.actions';
import { ManageFieldMappingsPageComponent } from './manage-field-mappings.page';

describe('ManageFieldMapperPageComponent', () => {
  let component: ManageFieldMappingsPageComponent;
  let fixture: ComponentFixture<ManageFieldMappingsPageComponent>;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          orgDataLoader: combineReducers(fromOrgDataLoaderReducer.reducers)
        }),
        FormsModule, PfCommonUIModule
      ],
      declarations: [ ManageFieldMappingsPageComponent ],
      providers: [
        {
          provide: OrgDataFieldMappingsApiService
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);

    spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(ManageFieldMappingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    component.selectedCompany = 13;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a message on save', () => {
    component.saveMessage = 'Saved Successfully';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should not show a message when the mappings have not been saved yet', () => {
    component.saveMessage = '';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should disable the save button when not all mappings are complete', () => {
    component.paymarketMappingComplete = true;
    component.jobMappingComplete = true;
    component.structureMappingComplete = true;
    component.structureMappingMappingComplete = true;
    component.employeeMappingComplete = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should enable the save button when all mappings are complete', () => {
    component.paymarketMappingComplete = true;
    component.jobMappingComplete = true;
    component.structureMappingComplete = true;
    component.structureMappingMappingComplete = true;
    component.employeeMappingComplete = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should add a paymarket mapping to the list of mappings when the paymarket mapping is complete ' +
    'and no paymarket mapping exists yet', () => {
    const evt = {complete: true, mappings: ['Paymarket__Paymarket']};
    component.mappings = [];
    component.onPaymarketMappingComplete(evt);

    fixture.detectChanges();

    const expectedValue: MappingModel = {
      LoaderType: 'Paymarkets',
      Mappings: ['Paymarket__Paymarket']
    };

    expect(component.mappings).toEqual([expectedValue]);
  });

  it('should replace a paymarket mapping in the list of mappings when the paymarket mapping is complete ' +
    'and a paymarket mapping exists', () => {
    const evt = {complete: true, mappings: ['Country__Country Code']};
    component.mappings = [{LoaderType: 'Paymarkets', Mappings: ['Paymarket__Paymarket']}];
    component.onPaymarketMappingComplete(evt);

    fixture.detectChanges();

    const expectedValue: MappingModel = {
      LoaderType: 'Paymarkets',
      Mappings: ['Country__Country Code']
    };

    expect(component.mappings).toEqual([expectedValue]);
  });

  it('should add a job mapping to the list of mappings when the job mapping is complete ' +
    'and no job mapping exists yet', () => {
    const evt = {complete: true, mappings: ['Job_Code__Job Code']};
    component.mappings = [];
    component.onJobMappingComplete(evt);

    fixture.detectChanges();

    const expectedValue: MappingModel = {
      LoaderType: 'Jobs',
      Mappings: ['Job_Code__Job Code']
    };

    expect(component.mappings).toEqual([expectedValue]);
  });

  it('should replace a job mapping in the list of mappings when the job mapping is complete ' +
    'and a job mapping exists', () => {
    const evt = {complete: true, mappings: ['Job_Title__Job Title']};
    component.mappings = [{LoaderType: 'Jobs', Mappings: ['Job_Code__Job Code']}];
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
    const evt = {complete: true, mappings: ['Structure_Code__Structure Code']};
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
    const evt = {complete: true, mappings: ['Grade_Code__Grade Code']};
    component.mappings = [{LoaderType: 'Structures', Mappings: ['Structure_Code__Structure Code']}];
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
    const evt = {complete: true, mappings: ['Job_Code__Job Code']};
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
    const evt = {complete: true, mappings: ['Structure_Code__Structure Code']};
    component.mappings = [{LoaderType: 'StructureMapping', Mappings: ['Job_Code__Job Code']}];
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
    const evt = {complete: true, mappings: ['Base__Salary']};
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
    const evt = {complete: true, mappings: ['First_Name__First Name']};
    component.mappings = [{LoaderType: 'Employees', Mappings: ['Base__Salary']}];
    component.onEmployeeMappingComplete(evt);

    fixture.detectChanges();

    const expectedValue: MappingModel = {
      LoaderType: 'Employees',
      Mappings: ['First_Name__First Name']
    };

    expect(component.mappings).toEqual([expectedValue]);
  });

  it('should call SavingFieldMappings action when SaveMappings has been called', () => {
    component.mappings = [{LoaderType: 'Employees', Mappings: ['Base__Salary']}];
    component.selectedCompany = 13;
    const expectedPayload = {
      mappings: component.mappings,
      companyId: component.selectedCompany
    };

    spyOn(fromOrgDataFieldMappingsActions, 'SavingFieldMappings');

    component.SaveMappings();

    fixture.detectChanges();

    expect(fromOrgDataFieldMappingsActions.SavingFieldMappings).toHaveBeenCalledWith(expectedPayload);
  });
});
