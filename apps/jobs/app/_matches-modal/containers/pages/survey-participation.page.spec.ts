import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { SurveyParticipationPageComponent } from './survey-participation.page';
import * as fromRootState from 'libs/state/state';
import * as fromReducers from '../../reducers';

import { DragulaModule } from 'ng2-dragula';

describe( 'SurveyParticipationPageComponent', () => {
  let fixture: ComponentFixture<SurveyParticipationPageComponent>;
  let instance: SurveyParticipationPageComponent;
  let store: Store<fromReducers.State>;
  const queryStringParams = { 'companyJobId': 1 };

  beforeEach(async( () => {
    TestBed.configureTestingModule( {
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          surveyParticipationReducers: combineReducers(fromReducers.reducers)
        }),
        DragulaModule.forRoot()
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParams: { keys: queryStringParams } }
          }
        }
      ],
      declarations: [
        SurveyParticipationPageComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.get(Store);
    fixture = TestBed.createComponent(SurveyParticipationPageComponent);
    instance = fixture.componentInstance;
  }));

  it( 'should show survey participation modal page', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
