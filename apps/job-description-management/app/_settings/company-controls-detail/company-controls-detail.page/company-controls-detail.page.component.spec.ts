import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyControlsDetailPageComponent } from './company-controls-detail.page.component';

describe('CompanyControlsDetailPageComponent', () => {
  let component: CompanyControlsDetailPageComponent;
  let fixture: ComponentFixture<CompanyControlsDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyControlsDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyControlsDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
