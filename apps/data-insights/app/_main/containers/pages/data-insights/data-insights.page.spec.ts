import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { StoreModule, combineReducers, Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import { SettingsService } from 'libs/state/app-context/services';

import * as fromDataInsightsMainReducer from '../../../reducers';
import * as fromDataInsightsPageActions from '../../../actions/data-insights-page.actions';
import { DataInsightsPageComponent } from './data-insights.page';

describe('Data Insights - Data Insights Page Component', () => {
  let instance: DataInsightsPageComponent;
  let fixture: ComponentFixture<DataInsightsPageComponent>;
  let ngbModal: NgbModal;
  let store: Store<fromDataInsightsMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataInsights_main: combineReducers(fromDataInsightsMainReducer.reducers),
        })
      ],
      declarations: [ DataInsightsPageComponent ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), dismissAll: jest.fn() }
        },
        { provide: SettingsService, useClass: SettingsService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(DataInsightsPageComponent);
    instance = fixture.componentInstance;
    ngbModal = TestBed.inject(NgbModal);
    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  it('should dispatch an SaveStandardReportsDisplaySetting action when clicking on carret down icon', () => {
    spyOn(store, 'dispatch');
    instance.showStandardReportsSection = true;
    const expectedAction = new fromDataInsightsPageActions.SaveStandardReportsDisplaySetting({ settingValue: false });

    instance.toggleStandardReportsDisplay();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
