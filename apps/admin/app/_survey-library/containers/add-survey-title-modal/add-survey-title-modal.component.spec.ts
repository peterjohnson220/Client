import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { AddSurveyTitleModalComponent } from './add-survey-title-modal.component';
import * as fromSurveyTitleActions from '../../actions/survey-titles.actions';
import { SurveyLibraryStateService } from '../../services/survey-library-state.service';
import * as fromSurveyLibraryReducer from '../../reducers';


describe('Add Survey Titles modal', () => {
  let component: AddSurveyTitleModalComponent;
  let fixture: ComponentFixture<AddSurveyTitleModalComponent>;
  let store: Store<fromSurveyLibraryReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        })
      ],
      declarations: [AddSurveyTitleModalComponent],
      providers: [FormBuilder, SurveyLibraryStateService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(AddSurveyTitleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch a SaveSurveyTitle action with a request object on submit', () => {
    // Arrange
    component.surveyPublisherId = 3;
    component.addSurveyTitleForm.controls['newSurveyName'].setValue('test survey');
    component.addSurveyTitleForm.controls['newSurveyCode'].setValue('test survey code');
    const expectedRequest = {
      SurveyPublisherId: 3,
      SurveyName: 'test survey',
      SurveyCode: 'test survey code'
    };
    const expectedAction = new fromSurveyTitleActions.SaveSurveyTitle(expectedRequest);

    // Act
    component.handleFormSubmit();

    fixture.detectChanges();

    // Assert
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});

