import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';

import { generateMockUserContext } from 'libs/models';

import { UserVoiceIndicatorComponent } from './user-voice-indicator.component';
import * as fromRootState from 'libs/state/state';
import * as fromUserVoiceReducer from '../../reducers';
import * as fromUserVoiceActions from '../../actions/user-voice.actions';


describe('User Voice Indicator', () => {
  let fixture: ComponentFixture<UserVoiceIndicatorComponent>;
  let instance: UserVoiceIndicatorComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          layoutWrapper: combineReducers(fromUserVoiceReducer.reducers),
        }),
      ],
      declarations: [
        UserVoiceIndicatorComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(UserVoiceIndicatorComponent);
    instance = fixture.componentInstance;
    instance.userContext$ = of(generateMockUserContext());
  });

  it('should dispatch a LoadingUserVoice upon Init', () => {
    const action = new fromUserVoiceActions.LoadingUserVoice();

    instance.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should contain user voice url with sidebar Url ', () => {
    const sideBarUrl = '/payfactors/UserVoice/Redirect';
    const result = instance.getSidebarHref(sideBarUrl);

    expect(result).toContain(sideBarUrl);
  });
});
