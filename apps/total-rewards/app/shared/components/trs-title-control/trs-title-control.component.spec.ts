import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrsTitleControlComponent } from './trs-title-control.component';

describe('TrsTitleControlComponent', () => {
  let component: TrsTitleControlComponent;
  let fixture: ComponentFixture<TrsTitleControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrsTitleControlComponent ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrsTitleControlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.titleStyles = {} as any;
    component.controlData = {} as any;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
