import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { AsyncContainerComponent } from './async-container.component';

describe('Async Container', () => {
  let fixture: ComponentFixture<AsyncContainerComponent>;
  let instance: AsyncContainerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AsyncContainerComponent,
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(AsyncContainerComponent);
    instance = fixture.componentInstance;
  });

  it('should show the pf-loading-mask, when it is loading', () => {

    instance.loading = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the pf-loading-mask, when there is a loading error', () => {

    instance.loadingError = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should not show the pf-loading-mask, when it is not loading and has not had a loading error', () => {

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
