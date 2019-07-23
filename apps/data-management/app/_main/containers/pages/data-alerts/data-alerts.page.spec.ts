import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataAlertsPageComponent } from './data-alerts.page';

describe('DataAlertsPageComponent', () => {
  let component: DataAlertsPageComponent;
  let fixture: ComponentFixture<DataAlertsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataAlertsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataAlertsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
