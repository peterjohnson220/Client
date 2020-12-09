import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { generateMockCompanySetting } from 'libs/models';
import { generateMockCustomCompanySetting } from '../../models';
import * as fromCompaniesReducer from '../../reducers';
import { CompanyTabsComponent } from './company-tabs.component';
import { CompanySettingsListType } from '../../constants/settings-constants';

describe('CompanyTabsComponent', () => {
  let component: CompanyTabsComponent;
  let fixture: ComponentFixture<CompanyTabsComponent>;
  let store: Store<fromCompaniesReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [
            StoreModule.forRoot({
                ...fromRootState.reducers,
                pf_admin: combineReducers(fromCompaniesReducer.reducers),
            })
        ],
        declarations: [
            CompanyTabsComponent
        ],
        providers: [],
        schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(CompanyTabsComponent);
    component = fixture.componentInstance;
  });

  it('should combine companySettings and customCompanySettings into a list', () => {
    component.companySettings = generateMockCompanySetting();
    component.combineSettings(generateMockCustomCompanySetting());

    const isCustomSettingInList = component.companySettings.filter(s => s.Type === CompanySettingsListType.Custom).length > 0;
    expect(isCustomSettingInList).toBeTruthy();

    const isStandardSettingInList = component.companySettings.filter(s => s.Type === undefined).length > 0;
    expect(isStandardSettingInList).toBeTruthy();
  });
});
