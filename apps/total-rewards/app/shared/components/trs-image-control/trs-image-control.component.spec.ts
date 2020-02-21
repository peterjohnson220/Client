import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrsImageControlComponent } from './trs-image-control.component';

describe('TrsImageControlComponent', () => {
  let component: TrsImageControlComponent;
  let fixture: ComponentFixture<TrsImageControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrsImageControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrsImageControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
