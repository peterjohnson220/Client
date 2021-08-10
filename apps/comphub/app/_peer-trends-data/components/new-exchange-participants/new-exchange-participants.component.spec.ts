import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExchangeParticipantsComponent } from './new-exchange-participants.component';
import { PfCommonUIModule } from 'libs/ui/common';

describe('NewExchangeParticipantsComponent', () => {
  let component: NewExchangeParticipantsComponent;
  let fixture: ComponentFixture<NewExchangeParticipantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewExchangeParticipantsComponent ],
      imports: [ PfCommonUIModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewExchangeParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
