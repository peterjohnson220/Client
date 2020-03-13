import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TrsChartControlComponent } from './trs-chart-control.component';

describe('TrsChartControlComponent', () => {
  let component: TrsChartControlComponent;
  let fixture: ComponentFixture<TrsChartControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrsChartControlComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrsChartControlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.controlData = { Title: 'test title' } as any;
    component.employee = { compensationData: [] };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render the supplied title', () => {
    component.controlData = { Title: 'test title' } as any;
    component.employee = { compensationData: [] };
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.includes('test title')).toBeTruthy();
  });
});
