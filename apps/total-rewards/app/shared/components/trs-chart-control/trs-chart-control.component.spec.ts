import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrsChartControlComponent } from './trs-chart-control.component';

describe('TrsChartControlComponent', () => {
  let component: TrsChartControlComponent;
  let fixture: ComponentFixture<TrsChartControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrsChartControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrsChartControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
