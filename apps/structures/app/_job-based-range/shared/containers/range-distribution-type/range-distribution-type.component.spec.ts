import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeDistributionTypeComponent } from './range-distribution-type.component';

describe('RangeDistributionTypeComponent', () => {
  let component: RangeDistributionTypeComponent;
  let fixture: ComponentFixture<RangeDistributionTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeDistributionTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeDistributionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
