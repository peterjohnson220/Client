import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { SelectEvent } from '@progress/kendo-angular-upload';

import * as fromRootState from 'libs/state/state';
import { generateDefaultAsyncStateObj } from 'libs/models/state';
import { generateMockUserProfile, UserProfile } from 'libs/models/user-profile';

import * as fromUserSettingsReducer from '../../../reducers';
import * as fromUserProfileActions from '../../../actions/user-profile.actions';
import { UserProfileComponent } from './user-profile.component';

describe('User Settings - User Profile Component', () => {
  let fixture: ComponentFixture<UserProfileComponent>;
  let instance: UserProfileComponent;
  let store: Store<fromUserSettingsReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          userSettings_main: combineReducers(fromUserSettingsReducer.reducers)
        })
      ],
      declarations: [ UserProfileComponent ],
      providers: [
        {
          provide: FormBuilder,
          useValue: { group: jest.fn(), patchValue: jest.fn(), reset: jest.fn() }
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(UserProfileComponent);
    instance = fixture.componentInstance;
    instance.userProfileForm = new FormGroup({
      FirstName: new FormControl(''),
      LastName: new FormControl(''),
      EmailAddress: new FormControl(''),
      Title: new FormControl('')
    });
    instance.userProfile$ = of(generateDefaultAsyncStateObj<UserProfile>(generateMockUserProfile()));

    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  it('should update form values when user profile is loaded', () => {
    spyOn(instance.userProfileForm, 'patchValue');

    const expectedObj = {
      FirstName: 'John',
      LastName: 'Doe',
      EmailAddress: 'johndoe@payfactors.com',
      Title: 'Accountant',
      UserPicture: 'FakePicture.Jpg'
    };
    instance.ngOnInit();

    expect(instance.userProfileForm.patchValue).toHaveBeenCalledWith(expectedObj);
  });

  it('should dispatch save user profile action with updated values when clicking Save', () => {
    spyOn(store, 'dispatch');

    const updatedUserProfile = {
      ...generateMockUserProfile(),
      FirstName: 'J'
    };
    const expectedAction = new fromUserProfileActions.SaveUserProfile(updatedUserProfile);
    instance.userProfileForm.patchValue({
      FirstName: 'J'
    });

    instance.handleSaveClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should update userPictureErrorMessage to invalid file type message when selecting an invalid file type photo', () => {
    const selectEvent = new SelectEvent([{
      extension: '.gif',
      name: 'test.gif',
      validationErrors: ['invalidFileExtension']
    }]);

    instance.handleFileSelect(selectEvent);

    expect(instance.userPictureErrorMessage).toEqual(instance.invalidFileExtensionMessage);
  });

  it('should update userPictureErrorMessage to invalid file size message when selecting an invalid file size ', () => {
    const selectEvent = new SelectEvent([{
      extension: '.png',
      name: 'test.png',
      validationErrors: ['invalidMaxFileSize']
    }]);

    instance.handleFileSelect(selectEvent);

    expect(instance.userPictureErrorMessage).toEqual(instance.invalidFileSizeMessage);
  });

  it('should clear userPictureErrorMessage when selecting an valid file', () => {
    const selectEvent = new SelectEvent([{
      extension: '.png',
      name: 'test.png',
      validationErrors: []
    }]);

    instance.userPictureErrorMessage = instance.invalidFileExtensionMessage;
    instance.handleFileSelect(selectEvent);

    expect(instance.userPictureErrorMessage).toEqual('');
  });
});
