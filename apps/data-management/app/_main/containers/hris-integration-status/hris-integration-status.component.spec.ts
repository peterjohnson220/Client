import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrisIntegrationStatusComponent } from './hris-integration-status.component';

describe('HrisIntegrationStatusComponent', () => {
  let component: HrisIntegrationStatusComponent;
  let fixture: ComponentFixture<HrisIntegrationStatusComponent>;

  beforeEach(async(() => {
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
