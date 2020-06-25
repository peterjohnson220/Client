import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { DragulaModule } from 'ng2-dragula';

import * as fromRootState from 'libs/state/state';

import { SurveyParticipationPageComponent } from '.';
import * as fromReducers from '../../reducers';


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

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(SurveyParticipationPageComponent);
    instance = fixture.componentInstance;
  }));

  it( 'should show survey participation modal page', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
