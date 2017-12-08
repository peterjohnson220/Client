import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { generateMockUserContext, generateMockNavigationLink } from 'libs/models';

import { UserMenuComponent } from './user-menu.component';

describe('User Menu', () => {
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

  it('should show the app users name', () => {

    instance.userContext = generateMockUserContext();
    instance.dropdownNavigationLinks = [];

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a list of dropdown navigation links, when provided', () => {

    instance.userContext = generateMockUserContext();

    const dropDownLink1 = generateMockNavigationLink();
    const dropDownLink2 = { ...dropDownLink1, Name: 'I am a Link 2', Url: 'https://www.google.com' };
    const dropDownLink3 = { ...dropDownLink1, Name: 'I am a Link 3', Url: 'https://www.angular.io' };

    instance.dropdownNavigationLinks = [dropDownLink1, dropDownLink2, dropDownLink3];

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should prepend /ng/ to the dropdown url, when the navigation link is an NgAppLink', () => {

    instance.userContext = generateMockUserContext();

    const dropDownLink1 = { ...generateMockNavigationLink(), Name: 'I am an Ng AppLink', Url: 'company-admin', NgAppLink: true };

    instance.dropdownNavigationLinks = [dropDownLink1];

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show an icon for log out', () => {

    instance.userContext = generateMockUserContext();

    const dropDownLink1 = { ...generateMockNavigationLink(), Name: 'Log Out', Url: 'logout', NgAppLink: false };

    instance.dropdownNavigationLinks = [dropDownLink1];

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a divider for referrals', () => {

    instance.userContext = generateMockUserContext();

    const dropDownLink1 = { ...generateMockNavigationLink(), Name: 'Referrals', Url: 'referrals', NgAppLink: false };

    instance.dropdownNavigationLinks = [dropDownLink1];

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a divider for log out', () => {

    instance.userContext = generateMockUserContext();

    const dropDownLink1 = { ...generateMockNavigationLink(), Name: 'Log Out', Url: 'logout', NgAppLink: false };

    instance.dropdownNavigationLinks = [dropDownLink1];

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
