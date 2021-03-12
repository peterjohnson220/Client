import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoaderDashboardPageComponent } from './loader-dashboard.page';
import { AbstractFeatureFlagService, FeatureFlagContext } from 'libs/core';

describe('LoaderDashboardPageComponent', () => {
  let component: LoaderDashboardPageComponent;
  let fixture: ComponentFixture<LoaderDashboardPageComponent>;

  class MockAbstractFeatureFlagService {
    bindEnabled(key: string, defaultValue?: boolean, context?: FeatureFlagContext) {
      jest.fn();
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaderDashboardPageComponent ],
      providers: [
        {
          provide: AbstractFeatureFlagService,
          useClass: MockAbstractFeatureFlagService
        },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
