import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { generateMockUserContext } from 'libs/models';

import { UserMenuAvatarComponent } from './user-menu-avatar.component';

describe('User Menu Avatar', () => {
  let fixture: ComponentFixture<UserMenuAvatarComponent>;
  let instance: UserMenuAvatarComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserMenuAvatarComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(UserMenuAvatarComponent);
    instance = fixture.componentInstance;
  });
  it('should show the user avatar when one exists', () => {

    instance.userContext = generateMockUserContext();
    instance.avatarSource = 'source';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the users initials when user picture is set to default avatar', () => {

    instance.userContext = generateMockUserContext();
    instance.userContext.UserPicture = 'default_user.png';
    instance.avatarSource = 'source';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the users initials when user picture is null', () => {

    instance.userContext = generateMockUserContext();
    instance.userContext.UserPicture = null;
    instance.avatarSource = 'source';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});

