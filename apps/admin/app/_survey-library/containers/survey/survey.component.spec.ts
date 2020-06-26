import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import { SurveyLibraryApiService } from 'libs/data/payfactors-api/survey-library';
import { generateMockUserContext } from 'libs/models';

import { SurveyComponent } from './survey.component';
import * as fromSurveyLibraryReducer from '../../reducers';

describe('Add Survey Titles modal', () => {
  let component: SurveyComponent;
  let fixture: ComponentFixture<SurveyComponent>;
  let store: Store<fromSurveyLibraryReducer.State>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          survey_library: combineReducers(fromSurveyLibraryReducer.reducers)
        })
      ],
      declarations: [SurveyComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id : 1 } } }
        },
        {
          provide: SurveyLibraryApiService,
          useValue: {
            // mock out getFirstSurveyByYearId to return a fake Observable
            getFirstSurveyByYearId: () => ({ subscribe: () => {} })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    activatedRoute = TestBed.inject(ActivatedRoute);
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(SurveyComponent);
    component = fixture.componentInstance;
    component.userContext$ = of(generateMockUserContext());

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an enabled copy button when the survey company does not have survey UDFs', () => {
    component.surveys = [{ CompanyHasSurveyUdfs: false }];
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should show a disabled copy button when the survey company has survey UDFs', () => {
    component.surveys = [{ CompanyHasSurveyUdfs: true }];
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});

