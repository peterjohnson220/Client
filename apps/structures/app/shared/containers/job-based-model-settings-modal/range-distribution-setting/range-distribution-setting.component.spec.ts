import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RangeDistributionSettingComponent } from './range-distribution-setting.component';

describe('RangeDistributionTypeComponent', () => {
  let component: RangeDistributionSettingComponent;
  let fixture: ComponentFixture<RangeDistributionSettingComponent>;

  beforeEach(waitForAsync(() => {
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
