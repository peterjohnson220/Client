import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HrisIntegrationSidebarComponent } from './hris-integration-sidebar.component';

describe('HrisIntegrationSidebarComponent', () => {
  let component: HrisIntegrationSidebarComponent;
  let fixture: ComponentFixture<HrisIntegrationSidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HrisIntegrationSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrisIntegrationSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
