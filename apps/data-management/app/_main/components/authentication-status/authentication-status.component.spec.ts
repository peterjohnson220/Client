import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationStatusComponent } from './authentication-status.component';

describe('AuthenticationStatusComponent', () => {
  let component: AuthenticationStatusComponent;
  let fixture: ComponentFixture<AuthenticationStatusComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ AuthenticationStatusComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationStatusComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
