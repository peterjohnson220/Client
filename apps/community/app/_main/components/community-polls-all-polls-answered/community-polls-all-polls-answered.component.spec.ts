import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { generateMockUserContext, generateMockNavigationLink, generateMocKHomePageLink} from 'libs/models';

import { CommunityPollsAllPollsAnsweredComponent } from './community-polls-all-polls-answered.component';

describe('Community Polls All Polls Answered', () => {
  let fixture: ComponentFixture<CommunityPollsAllPollsAnsweredComponent>;
  let instance: CommunityPollsAllPollsAnsweredComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CommunityPollsAllPollsAnsweredComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CommunityPollsAllPollsAnsweredComponent);
    instance = fixture.componentInstance;
  });

  it('should show the thumbs up icon', () => {

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });


});
