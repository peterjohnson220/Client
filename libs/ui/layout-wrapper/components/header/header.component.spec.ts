import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

describe('header', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let instance: HeaderComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(HeaderComponent);
    instance = fixture.componentInstance;
  });

  it('should show the logo', () => {

    instance.payfactorsLogo = 'payfactorsLogoUrl';
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});

