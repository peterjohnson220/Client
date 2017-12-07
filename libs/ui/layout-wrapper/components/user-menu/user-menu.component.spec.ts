import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { generateMockUserContext, generateMockNavigationLink } from 'libs/models';
import { UserMenuComponent} from './user-menu.component';

describe('user-menu', () => {
  let fixture: ComponentFixture<UserMenuComponent>;
  let instance: UserMenuComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserMenuComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(UserMenuComponent);
    instance = fixture.componentInstance;
  });

  it('should show the app users name and picture', () => {
    const context = generateMockUserContext();

    instance.navigationLinks = [];

    instance.avatarUrl = context.UserPicture;
    instance.appUser.firstName = context.FirstName;
    instance.appUser.lastName = context.LastName;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a list of dropdown navigation links', () => {

    const dropDownLink1 = generateMockNavigationLink();
    const dropDownLink2 = { ...dropDownLink1, Name: 'I am a Link 2', Url: 'https://www.google.com' };
    const dropDownLink3 = { ...dropDownLink1, Name: 'I am a Link 3', Url: 'https://www.angular.io' };

    instance.navigationLinks = [dropDownLink1, dropDownLink2, dropDownLink3];

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});

