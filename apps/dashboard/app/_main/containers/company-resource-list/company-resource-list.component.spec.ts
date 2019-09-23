import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CompanyResourceListComponent } from './company-resource-list.component';


describe('CompanyResourceListComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CompanyResourceListComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  });

  it('should take companyResources as an Input property', () => {
    const fixture = TestBed.createComponent(CompanyResourceListComponent);
    const instance = fixture.componentInstance;

    expect(instance.companyResources).not.toBeDefined();
  });

});
