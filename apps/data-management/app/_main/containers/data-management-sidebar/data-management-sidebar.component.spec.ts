import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Router } from '@angular/router';

import { DataManagementSidebarComponent } from './data-management-sidebar.component';

describe('DataManagementSidebarComponent', () => {
  let component: DataManagementSidebarComponent;
  let fixture: ComponentFixture<DataManagementSidebarComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataManagementSidebarComponent ],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
            isActive: jest.fn()
          },
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(DataManagementSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
