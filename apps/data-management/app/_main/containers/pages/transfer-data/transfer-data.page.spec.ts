import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferDataPageComponent } from './transfer-data.page';

describe('TransferDataPageComponent', () => {
  let component: TransferDataPageComponent;
  let fixture: ComponentFixture<TransferDataPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferDataPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferDataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
