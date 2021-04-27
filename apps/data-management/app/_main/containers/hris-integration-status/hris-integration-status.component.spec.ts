import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HrisIntegrationStatusComponent } from './hris-integration-status.component';

describe('HrisIntegrationStatusComponent', () => {
  let component: HrisIntegrationStatusComponent;
  let fixture: ComponentFixture<HrisIntegrationStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HrisIntegrationStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrisIntegrationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
