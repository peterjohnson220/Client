import {  NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import spyOn = jest.spyOn;

import { WindowCommunicationService } from 'libs/core/services';

import { SurveysPageComponent } from './surveys.page';

describe('Project - Add Data - Surveys Page', () => {
  let fixture: ComponentFixture<SurveysPageComponent>;
  let instance: SurveysPageComponent;
  let windowCommunicationService: WindowCommunicationService;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: WindowCommunicationService,
          useValue: {
            postMessage: jest.fn()
          }
        }
      ],
      declarations: [
        SurveysPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    windowCommunicationService = TestBed.get(WindowCommunicationService);

    fixture = TestBed.createComponent(SurveysPageComponent);
    instance = fixture.componentInstance;
  });

  it('should use the window communication service to post a message, when handling cancel clicked', () => {
    spyOn(windowCommunicationService, 'postMessage');
    const expectedMessage = 'Survey Search - Cancel Clicked';

    instance.handleCancelClicked();

    expect(windowCommunicationService.postMessage).toHaveBeenCalledWith(expectedMessage);
  });
});
