import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDataPageComponent } from './manage-data.page';

describe('ManageDataPageComponent', () => {
  let component: ManageDataPageComponent;
  let fixture: ComponentFixture<ManageDataPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDataPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
