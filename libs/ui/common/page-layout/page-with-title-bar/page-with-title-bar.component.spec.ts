import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PageWithTitleBarComponent } from './page-with-title-bar.component';
import { RouteTrackingService } from '../../../../core/services';

// Host Component for testing transclusion
@Component({
  template: `
    <pf-page-with-title-bar>
      <ng-container page-title>I am a page title</ng-container>
      <ng-container page-actions><button>I am a page action</button></ng-container>
      <ng-container page-content><h1>I am the page content</h1></ng-container>
    </pf-page-with-title-bar>`
})
class TestHostComponent {}


describe('Page With Title Bar', () => {
  let fixture: ComponentFixture<PageWithTitleBarComponent>;
  let instance: PageWithTitleBarComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        PageWithTitleBarComponent, TestHostComponent
      ],
      providers: [
        {
          provide: RouteTrackingService,
          useValue: {
            goBack: jest.fn()
          }
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(PageWithTitleBarComponent);
    instance = fixture.componentInstance;
  });

  it('should show the back button, when provided a return Url', () => {

    instance.returnUrl = '/returnToThis/Path';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the back button, when provided an absolute Url', () => {

    instance.absoluteUrl = '/redirectToThis/Path';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });


  it('should show no back button when no URL is provided', () => {

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should transclude into slots', () => {

    const hostComponent = TestBed.createComponent(TestHostComponent);

    expect(hostComponent).toMatchSnapshot();
  });

});
