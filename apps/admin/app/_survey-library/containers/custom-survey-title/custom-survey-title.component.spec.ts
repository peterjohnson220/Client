import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import * as fromRootState from 'libs/state/state';
import { SaveCustomCompanySurveyTitleRequestModel } from 'libs/models/payfactors-api/survey-library/request';

import { CustomSurveyTitleComponent } from './custom-survey-title.component';
import * as fromSurveyTitlesActions from '../../actions/survey-titles.actions';
import * as fromSurveyLibraryReducer from '../../reducers';

describe('Custom Survey Title Component', () => {
  let component: CustomSurveyTitleComponent;
  let fixture: ComponentFixture<CustomSurveyTitleComponent>;
  let store: Store<fromSurveyLibraryReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        })
      ],
      declarations: [CustomSurveyTitleComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSurveyTitleComponent);
    component = fixture.componentInstance;
    component.SurveyTitleCompany = {
      CustomSurveyName: 'custom name 1',
      CompanyId: 13,
      CompanyName: 'TestCompany',
      SurveyYear: 2000,
      SurveyYearId: 1
    };
    component.SurveyTitleId = 1;
    fixture.detectChanges();
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');
  });

  it('should dispatch a SaveCustomTitle action when a new title has been entered', () => {
    // Arrange
    component.newSurveyTitle = 'custom name 2';

    const expectedRequest: SaveCustomCompanySurveyTitleRequestModel = {
      CompanyId: 13,
      CustomSurveyName: 'custom name 2'
    };

    const expectedAction = new fromSurveyTitlesActions.SaveCustomTitle({surveyTitleId: 1, request: expectedRequest});

    // Act
    component.saveCustomSurveyTitle();

    // Assert
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should not dispatch a SaveCustomTitle action when the custom title remained the same', () => {
    // Arrange
    component.newSurveyTitle = 'custom name 1';

    // Act
    component.saveCustomSurveyTitle();

    // Assert
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
