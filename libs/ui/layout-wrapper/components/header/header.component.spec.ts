import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { generateMockUserContext, generateMockNavigationLink, generateMocKHomePageLink} from 'libs/models';

import { HeaderComponent } from './header.component';

describe('User Menu', () => {
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

  it('should show the header', () => {

    instance.userContext = generateMockUserContext();
    instance.dropdownNavigationLinks = [];

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show homepage link, when provided', () => {

    instance.userContext = generateMockUserContext();
    const dropDownLink1 = generateMockNavigationLink();

    instance.dropdownNavigationLinks = [dropDownLink1];
    instance.homePageLink = generateMocKHomePageLink();
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
