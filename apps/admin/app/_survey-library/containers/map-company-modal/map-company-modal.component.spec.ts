import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { SurveyLibraryApiService } from 'libs/data/payfactors-api/survey-library';

import { MapCompanyModalComponent } from './map-company-modal.component';
import * as fromSurveyLibraryReducer from '../../reducers';

describe('Custom Survey Title Component', () => {
  let component: MapCompanyModalComponent;
  let fixture: ComponentFixture<MapCompanyModalComponent>;
  let store: Store<fromSurveyLibraryReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        })
      ],
      declarations: [MapCompanyModalComponent],
      providers: [{provide: SurveyLibraryApiService}],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapCompanyModalComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show map companies list when survey does not have UDFs', () => {
    component.hasCompanySurveyUDFs = false;

    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should not show map companies list when survey has UDFs', () => {
    component.hasCompanySurveyUDFs = true;

    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

});
