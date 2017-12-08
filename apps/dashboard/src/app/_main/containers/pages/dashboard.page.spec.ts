import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DashboardPageComponent } from './dashboard.page';

describe('dashboard', () => {
  let fixture: ComponentFixture<DashboardPageComponent>;
  let instance: DashboardPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardPageComponent,
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(DashboardPageComponent);
    instance = fixture.componentInstance;
  });

  it('should show correct html', () => {

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
