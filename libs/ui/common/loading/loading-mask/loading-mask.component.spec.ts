import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { LoadingMaskComponent } from './loading-mask.component';

describe('Loading Mask', () => {
  let fixture: ComponentFixture<LoadingMaskComponent>;
  let instance: LoadingMaskComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoadingMaskComponent,
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(LoadingMaskComponent);
    instance = fixture.componentInstance;
  });

  it('should show the pf-loading-indicator, when there is no loading error', () => {

    instance.error = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the pf-error-indicator and reload button, when there is a loading error', () => {

    instance.error = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the pf-error-indicator and no reload button, when there is a loading error and hiding reload button', () => {

    instance.error = true;
    instance.hideReloadButton = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should emit a reload event', () => {
    spyOn(instance.reload, 'emit');

    instance.reload.emit();

    expect(instance.reload.emit).toHaveBeenCalled();
  });
});
