import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalRewardsItemWellComponent } from './total-rewards-item-well.component';

describe('TotalRewardsItemWellComponent', () => {
  let component: TotalRewardsItemWellComponent;
  let fixture: ComponentFixture<TotalRewardsItemWellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalRewardsItemWellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalRewardsItemWellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
