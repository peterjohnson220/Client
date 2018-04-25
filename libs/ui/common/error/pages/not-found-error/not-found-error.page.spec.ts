import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { NotFoundErrorPageComponent } from './not-found-error.page';

describe('Not Found Error Page', () => {
  let fixture: ComponentFixture<NotFoundErrorPageComponent>;
  let instance: NotFoundErrorPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NotFoundErrorPageComponent,
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(NotFoundErrorPageComponent);
    instance = fixture.componentInstance;
  });

  it('should show the error message', () => {

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
