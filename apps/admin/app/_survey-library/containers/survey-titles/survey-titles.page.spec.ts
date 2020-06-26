import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { SurveyTitlesPageComponent } from './survey-titles.page';
import { SurveyLibraryStateService } from '../../services/survey-library-state.service';
import * as fromSurveyTitlesActions from '../../actions/survey-titles.actions';

class MockSurveyLibraryStateService {
  constructor() {}
}

describe('Survey Titles Page', () => {
  let component: SurveyTitlesPageComponent;
  let fixture: ComponentFixture<SurveyTitlesPageComponent>;
  let store: Store<fromRootState.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        })
      ],
      declarations: [SurveyTitlesPageComponent],
      providers: [{
        provide: ActivatedRoute,
        useValue: {snapshot: {params: {id: 3}}}
      }, {
        provide: SurveyLibraryStateService,
        useClass: MockSurveyLibraryStateService
      }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(SurveyTitlesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch a LoadingSurveyTitles when a search term has been entered', () => {
    // Arrange
    const searchTerm = 'search';
    const expectedFilter = {
      SearchTerm: 'search',
      CompanyId: undefined
    };
    const expectedAction = new fromSurveyTitlesActions.LoadingSurveyTitles({publisherId: 3, filter: expectedFilter});

    // Act
    component.filterChanged(searchTerm);
    fixture.detectChanges();

    // Assert
    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    }, 1000);
  });

  it('should dispatch a LoadingSurveyTitles when a company has been selected', () => {
    // Arrange
    const expectedFilter = {
      SearchTerm: '',
      CompanyId: 13
    };
    const expectedAction = new fromSurveyTitlesActions.LoadingSurveyTitles({publisherId: 3, filter: expectedFilter});

    // Act
    component.companySelectionChange({CompanyId: 13});
    fixture.detectChanges();

    // Assert
    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    }, 1000);
  });
});
