import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeDistributionSettingComponent } from './range-distribution-setting.component';

describe('RangeDistributionTypeComponent', () => {
  let component: RangeDistributionSettingComponent;
  let fixture: ComponentFixture<RangeDistributionSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeDistributionSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeDistributionSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
