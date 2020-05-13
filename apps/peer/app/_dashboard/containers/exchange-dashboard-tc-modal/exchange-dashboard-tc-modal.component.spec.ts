import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store } from '@ngrx/store';

import { generateMockTermsConditionsSubmissionModel } from 'libs/models';
import * as fromRootState from 'libs/state/state';

import { ExchangeDashboardTCModalComponent } from './exchange-dashboard-tc-modal.component';
import * as fromExchangeDashboardTCActions from '../../actions/exchange-dashboard-tc-modal.actions';


describe('Exchange Dashboard TC Modal', () => {
  let fixture: ComponentFixture<ExchangeDashboardTCModalComponent>;
  let instance: ExchangeDashboardTCModalComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
      ],
      providers: [
        {
          provide: ActivatedRoute
        }
      ],
      declarations: [
        ExchangeDashboardTCModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ExchangeDashboardTCModalComponent);
    instance = fixture.componentInstance;
  });

  it('should call LoadTermsAndConditions action on init', () => {
    const action = new fromExchangeDashboardTCActions.LoadTermsAndConditions(instance.termAndConditionsFeatureName);

    instance.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch SubmittingTermsAndConditionsResponse when calling submitTC', () => {
    const termsConditionsSubmissionModel = generateMockTermsConditionsSubmissionModel();
    const action = new fromExchangeDashboardTCActions.SubmitTermsAndConditionsResponse(termsConditionsSubmissionModel);

    instance.tcId = termsConditionsSubmissionModel.TCId;
    instance.submitTC(true);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
