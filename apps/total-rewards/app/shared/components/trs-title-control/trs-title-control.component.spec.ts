import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrsTitleControlComponent } from './trs-title-control.component';

describe('TrsTitleControlComponent', () => {
  let component: TrsTitleControlComponent;
  let fixture: ComponentFixture<TrsTitleControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrsTitleControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrsTitleControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
