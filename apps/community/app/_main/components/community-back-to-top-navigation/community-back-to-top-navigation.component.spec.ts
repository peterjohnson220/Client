import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { CommunityBackToTopNavigationComponent } from './community-back-to-top-navigation.component';

describe('CommunityBackToTopNavigationComponent', () => {
  let fixture: ComponentFixture<CommunityBackToTopNavigationComponent>;
  let instance: CommunityBackToTopNavigationComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        CommunityBackToTopNavigationComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CommunityBackToTopNavigationComponent);
    instance = fixture.componentInstance;
  });
  it('should show back to top button', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
  it('call onClick should emit back to top', () => {
    spyOn(instance.backToTopClicked, 'emit');
    instance.onClick();
    expect(instance.backToTopClicked.emit).toHaveBeenCalled();
  });
});
