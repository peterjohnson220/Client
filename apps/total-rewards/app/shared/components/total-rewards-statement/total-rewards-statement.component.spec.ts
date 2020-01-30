import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute} from '@angular/router';

import { DragulaModule } from 'ng2-dragula';

import { TotalRewardsStatementComponent } from './total-rewards-statement.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TotalRewardsStatementComponent', () => {
  let component: TotalRewardsStatementComponent;
  let fixture: ComponentFixture<TotalRewardsStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DragulaModule.forRoot()
      ],
      providers: [ ActivatedRoute ],
      declarations: [ TotalRewardsStatementComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalRewardsStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
