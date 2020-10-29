import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { generateMockCompanySetting } from 'libs/models';
import { generateMockCustomCompanySetting } from '../../models';
import { CompanyTabsComponent } from './company-tabs.component';
import { CompanySettingsListType } from '../../constants/settings-constants';

describe('CompanyTabsComponent', () => {
  let component: CompanyTabsComponent;
  let fixture: ComponentFixture<CompanyTabsComponent>;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
        }),
      ],
      declarations: [
        CompanyTabsComponent
      ],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(CompanyTabsComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should combine companySettings and customCompanySettings into a list', () => {
    component.companySettings = [generateMockCompanySetting()];
    component.combineSettings([generateMockCustomCompanySetting()]);

    const isCompanySettingsCombined = component.companySettings.filter(s => s.Type === CompanySettingsListType.Custom).length > 0;
    expect(isCompanySettingsCombined).toBeTruthy();
  });
});


