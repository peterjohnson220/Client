import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PageWithTitleBarAndGridComponent } from './page-with-title-bar-and-grid.component';

// Host Component for testing transclusion
@Component({
  template: `
    <pf-page-with-title-bar-and-grid>
      <ng-container page-title>I am a page title</ng-container>
      <ng-container page-actions><button>I am a page action</button></ng-container>
      <ng-container page-content><h1>I am the page content</h1></ng-container>
      <ng-container grid-actions><button>I am a grid action</button></ng-container>
      <ng-container grid-content>I am the grid content</ng-container>
    </pf-page-with-title-bar-and-grid>`
})
class TestHostComponent {}


describe('Page With Title Bar and Grid', () => {
  let fixture: ComponentFixture<PageWithTitleBarAndGridComponent>;
  let instance: PageWithTitleBarAndGridComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        PageWithTitleBarAndGridComponent, TestHostComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(PageWithTitleBarAndGridComponent);
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


  it('should show the back button, when provided an locationBack parameter', () => {

    instance.locationBack = true;

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
