import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { BrowserDetectionService } from 'libs/core';
import { generateMockCompanyFormData, generateMockCompanySetting } from 'libs/models';
import { generateMockCompanyIndustriesResponse, generateMockSystemUserGroupsResponse } from 'libs/models/payfactors-api';
import { generateMockCustomCompanySetting, generateMockCustomCompanySettingsWithDefaults } from '../../../models';
import { CompanyPageComponent } from './company.page';
import { CompanyFormComponent } from '../../company-form';

describe('CompanyPageComponent', () => {
  let component: CompanyPageComponent;
  let fixture: ComponentFixture<CompanyPageComponent>;
  let store: Store<fromRootState.State>;
  let route: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
        }),
      ],
      declarations: [
        CompanyPageComponent,
        CompanyFormComponent
      ],
      providers: [
        FormBuilder,
        BrowserDetectionService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                companyId: 1
              }
            }
          }
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    route = TestBed.inject(ActivatedRoute);
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(CompanyPageComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reduce settings to CustomCompanySettings on handleSaveClicked', () => {
    let companyFormComponent: CompanyFormComponent;
    let companyFormComponentFixture: ComponentFixture<CompanyFormComponent>;
    companyFormComponentFixture = TestBed.createComponent(CompanyFormComponent);
    companyFormComponent = companyFormComponentFixture.componentInstance;

    companyFormComponent.createForm();
    companyFormComponent.companyFormData = generateMockCompanyFormData();
    companyFormComponent.industries = [generateMockCompanyIndustriesResponse()];
    companyFormComponent.systemUserGroups = [generateMockSystemUserGroupsResponse()];
    companyFormComponent.buildFormData();

    // remove validators in order set controls as valid
    const controls = companyFormComponent.companyForm.controls;
    for (const control in controls) {
      if (Object.prototype.hasOwnProperty.call(controls, control)) {
        controls[control].clearValidators();
        controls[control].updateValueAndValidity({ onlySelf: true });
      }
    }
    companyFormComponent.companyForm.controls = controls;
    companyFormComponent.companyForm.updateValueAndValidity();

    component.companyForm = companyFormComponentFixture.componentInstance;

    const mockCompanySetting: any = generateMockCompanySetting();
    const mockCustomCompanySetting = generateMockCustomCompanySetting();
    const settings = mockCompanySetting.concat(mockCustomCompanySetting);

    const isStandardSettingInList = settings.filter(s => s.Type === undefined).length > 0;
    expect(isStandardSettingInList).toBeTruthy();

    component.handleSaveClicked(settings);

    const mockCustomSettingsWithDefaults = generateMockCustomCompanySettingsWithDefaults();
    expect(component.customCompanySettingsObj).toEqual(mockCustomSettingsWithDefaults);
  });

});
