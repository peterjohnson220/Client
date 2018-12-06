import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromMatchesReducers from '../../reducers';
import * as fromMatchesActions from '../../actions/matches.actions';

import { generateMockMatch} from 'libs/models/company';

import { MatchDetailsComponent } from './match-details.component';

describe( 'MatchesDetailsComponent', () => {
  let component: MatchDetailsComponent;
  let fixture: ComponentFixture<MatchDetailsComponent>;
  let store: Store<fromRootState.State>;

  beforeEach(async( () => {
    TestBed.configureTestingModule( {
      imports: [
        StoreModule.forRoot( {
          ...fromRootState.reducers,
          authMain: combineReducers(fromMatchesReducers.reducers)
        })
      ],
      declarations: [MatchDetailsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
  }));

  beforeEach( () => {
    fixture = TestBed.createComponent(MatchDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should match snapshot', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it( 'should show collapsed matches', () => {
    component.match = generateMockMatch();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it( 'should dispatch a show more toggle ', () => {
    component.match = generateMockMatch();
    component.toggleShowMore();

    expect(fixture.componentInstance.showMore).toBeTruthy();
  });
});
