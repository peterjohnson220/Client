import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { ServerErrorPageComponent } from './server-error-page.component';

describe('Server Error Page', () => {
  let fixture: ComponentFixture<ServerErrorPageComponent>;
  let instance: ServerErrorPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ServerErrorPageComponent,
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ServerErrorPageComponent);
    instance = fixture.componentInstance;
  });

  it('should show the error message', () => {

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});

