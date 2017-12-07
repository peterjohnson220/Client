import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LayoutWrapperComponent } from './layout-wrapper';

// Host Component for testing transclusion
@Component({
  template: `
    <pf-layout-wrapper>
      <ng-container mainContent>I am the main content</ng-container>
      <ng-container rightSidebarContent>I am the right sidebar content</ng-container>
    </pf-layout-wrapper>\`
  `
})
class TestHostComponent {
}

describe('Layout Wrapper', () => {
  let fixture: ComponentFixture<LayoutWrapperComponent>;
  let instance: LayoutWrapperComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        LayoutWrapperComponent, TestHostComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(LayoutWrapperComponent);
    instance = fixture.componentInstance;
  });

  it('should transclude', () => {
    const hostComponent = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    expect(hostComponent).toMatchSnapshot();
  });

});
