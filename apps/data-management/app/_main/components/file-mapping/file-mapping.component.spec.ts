import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {enableProdMode, NO_ERRORS_SCHEMA} from '@angular/core';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import * as fromRootState from 'libs/state/state';

import * as fromOrgDataAutoloaderReducer from '../../reducers';
import {FileMappingComponent} from '../../components';
import {EntityChoice, getEntityChoicesForOrgLoader} from '../../models';

describe('FileMappingComponent', () => {
  let component: FileMappingComponent;
  let fixture: ComponentFixture<FileMappingComponent>;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          orgDataLoader: combineReducers(fromOrgDataAutoloaderReducer.reducers)
        }),
        RouterTestingModule
      ],
      declarations: [ FileMappingComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);

    fixture = TestBed.createComponent(FileMappingComponent);
    component = fixture.componentInstance;
    component.entities = getEntityChoicesForOrgLoader();
    component.selectedCompany = {CompanyId: 1, CompanyName: 'test'};
    fixture.detectChanges();
    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show tab enable', () => {
    component.entities[0].isChecked = true;
    const enabled = component.enabledTabs('PayMarkets');
    expect(enabled).toBe(true);
  });

  it('should select a tab', () => {
    component.entities[1].isSelectedTab = true;
    const selectedTab = component.selectedTab('Jobs');
    expect(selectedTab).toBe(true);
  });
});
