import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySearcherComponent } from './company-searcher.component';

describe('CompanySearcherComponent', () => {
  let component: CompanySearcherComponent;
  let fixture: ComponentFixture<CompanySearcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompanySearcherComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an instructional message when no company is selected', () => {
    component.selectedCompany = null;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should hide the instructional message when a company is selected', () => {
    component.selectedCompany = { CompanyId: 567 } as any;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
