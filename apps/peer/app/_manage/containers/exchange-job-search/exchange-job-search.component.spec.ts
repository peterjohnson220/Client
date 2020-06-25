import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import * as companyJobsActions from '../../actions/company-jobs.actions';
import * as manageReducers from '../../reducers/';
import { ExchangeJob, generateMockExchangeJob } from 'libs/features/peer/job-association/models/exchange-job.model';

import { ExchangeJobSearchComponent } from './exchange-job-search.component';

describe('ExchangeJobSearchComponent', () => {
  let component: ExchangeJobSearchComponent;
  let fixture: ComponentFixture<ExchangeJobSearchComponent>;
  let store: Store<manageReducers.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_manage: combineReducers(manageReducers.reducers)
        }),
      ],
      declarations: [ExchangeJobSearchComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeJobSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a no results message when no matches are found', () => {
    component.exchangeJobs$ = of([]);
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should search results when matches are found', () => {
    component.exchangeJobs$ = of([ generateMockExchangeJob() ]);
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should fire the expected actions when no search results are found and reload is clicked', () => {
    component.exchangeJobs$ = of([]);
    fixture.detectChanges();

    const reset = fixture.debugElement.nativeElement.querySelector('a.reset');
    reset.click();

    const expectedTitleAction = new companyJobsActions.UpdateExchangeJobsTitleSearchTerm(null);
    const expectedDescriptionAction = new companyJobsActions.UpdateExchangeJobsDescriptionSearchTerm(null);
    const expectedSearchAction = new companyJobsActions.SearchExchangeJobs();

    expect(store.dispatch).toHaveBeenCalledWith(expectedTitleAction);
    expect(store.dispatch).toHaveBeenCalledWith(expectedDescriptionAction);
    expect(store.dispatch).toHaveBeenCalledWith(expectedSearchAction);
  });
});
