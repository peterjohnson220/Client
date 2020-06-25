import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Router } from '@angular/router';
import { StoreModule, Store, combineReducers } from '@ngrx/store';

import { OrgDataEntityType } from 'libs/constants';
import { generateMockCredentialsPackage } from 'libs/models';
import * as fromRootState from 'libs/state/state';

import * as fromDataManagementMainReducer from '../../reducers';
import { generateMockExistingConnectionSummary, PfTestCredentialsPackage} from '../../models';

import { HrisAuthenticationCardComponent } from './hris-authentication-card.component';

describe('Data Management - Main - Hris Authentication Card', () => {
  let instance: HrisAuthenticationCardComponent;
  let fixture: ComponentFixture<HrisAuthenticationCardComponent>;
  let store: Store<fromDataManagementMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          transferDataMain: combineReducers(fromDataManagementMainReducer.reducers),
        })
      ],
      providers: [],
      declarations: [
        HrisAuthenticationCardComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrisAuthenticationCardComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should emit a validation event when form is submitted', () => {
    // arrange
    const spy = jest.spyOn(instance.validateCredentials, 'emit');
    const mockConnectionSummary = generateMockExistingConnectionSummary();
    instance.connectionSummary = mockConnectionSummary;
    const mockCredsPackage = generateMockCredentialsPackage() as PfTestCredentialsPackage;
    mockCredsPackage.UserName = 'MockUserName';
    mockCredsPackage.Password = 'MockPassword';
    mockCredsPackage.syncEmployees = mockConnectionSummary.selectedEntities.includes(OrgDataEntityType.Employees);
    mockCredsPackage.syncJobs = mockConnectionSummary.selectedEntities.includes(OrgDataEntityType.Jobs);
    mockCredsPackage.syncPaymarkets = mockConnectionSummary.selectedEntities.includes(OrgDataEntityType.PayMarkets);
    mockCredsPackage.syncStructures = mockConnectionSummary.selectedEntities.includes(OrgDataEntityType.Structures);
    mockCredsPackage.syncStructureMappings = mockConnectionSummary.selectedEntities.includes(OrgDataEntityType.StructureMappings);
    const mockFormValues = {
      username: 'MockUserName',
      password: 'MockPassword'
    };

    // act
    instance.submitFormEvent(mockFormValues);

    // assert
    expect(spy).toHaveBeenCalledWith(mockCredsPackage);
  });

  it('should emit credentials when next is clicked', () => {
    // arrange
    const spy = jest.spyOn(instance.saveClicked, 'emit');
    const mockCredsPackage = generateMockCredentialsPackage() as PfTestCredentialsPackage;
    (instance as any).creds = mockCredsPackage;

    // act
    instance.save();

    // assert
    expect(spy).toHaveBeenCalledWith(mockCredsPackage);
  });
});
