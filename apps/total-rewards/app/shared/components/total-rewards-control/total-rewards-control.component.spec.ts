import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragulaModule } from 'ng2-dragula';


import { TotalRewardsControlComponent } from './total-rewards-control.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TotalRewardsControlComponent', () => {
  let component: TotalRewardsControlComponent;
  let fixture: ComponentFixture<TotalRewardsControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DragulaModule.forRoot()
      ],
      declarations: [ TotalRewardsControlComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalRewardsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
