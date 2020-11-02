import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { StandardReportComponent } from './standard-report.component';

describe('Data Insights - Standard Report Component', () => {
  let router: Router;
  let instance: StandardReportComponent;
  let fixture: ComponentFixture<StandardReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardReportComponent ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(StandardReportComponent);
    instance = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should match snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });
});
