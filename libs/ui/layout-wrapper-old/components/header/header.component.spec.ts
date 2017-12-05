import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { generateMockUserContext, generateMockNavigationLink } from 'libs/models';

import { HeaderComponent } from './header.component';

describe('Header', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let instance: HeaderComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(HeaderComponent);
    instance = fixture.componentInstance;
  });

  it('should show the app users name and picture', () => {

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

});
