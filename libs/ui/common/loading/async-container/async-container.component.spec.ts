import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { AsyncContainerComponent } from './async-container.component';

// Host Component for testing transclusion
@Component({
  template: `
    <pf-async-container><h1>Transclusion Works!</h1></pf-async-container>`
})
class TestHostComponent {}


describe('Async Container', () => {
  let fixture: ComponentFixture<AsyncContainerComponent>;
  let instance: AsyncContainerComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AsyncContainerComponent, TestHostComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(AsyncContainerComponent);
    instance = fixture.componentInstance;
  });

  it('should not show the .loading-blanket, when it is not loading, and there is no loading error', () => {

    instance.loading = false;
    instance.loadingError = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the pf-loading-indicator, when we are loading', () => {

    instance.loading = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the pf-error-indicator and reload button, when there is a loading error', () => {

    instance.loadingError = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the pf-error-indicator and no reload button, when there is a loading error and hiding reload button', () => {

    instance.loadingError = true;
    instance.hideReloadButton = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should transclude', () => {
    const hostComponent = TestBed.createComponent(TestHostComponent);

    // Hiding Mask
    instance.loading = false;

    fixture.detectChanges();

    expect(hostComponent).toMatchSnapshot();
  });

  it('should emit a reload event, when the reload button is clicked', () => {

    // Reload button shows when there is an error
    instance.loadingError = true;

    // Spy on the emit method for the reload EventEmitter
    spyOn(instance.reload, 'emit');

    fixture.detectChanges();

    // Find the reload button in the template and trigger a click
    const reloadButton = fixture.debugElement.query(By.css('button'));
    reloadButton.triggerEventHandler('click', null);

    expect(instance.reload.emit).toHaveBeenCalled();
  });

});
