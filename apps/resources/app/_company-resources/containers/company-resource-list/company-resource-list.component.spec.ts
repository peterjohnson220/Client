import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CompanyResourceListComponent } from './company-resource-list.component';
import { Store, StoreModule } from '@ngrx/store';
import * as fromRootState from 'libs/state/state';


describe('CompanyResourceListComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
      ],
      declarations: [
        CompanyResourceListComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  });

  it('should take companyResources as an Input property', () => {
    const fixture = TestBed.createComponent(CompanyResourceListComponent);
    const instance = fixture.componentInstance;

    expect(instance.folderResources).not.toBeDefined();
    expect(instance.orphanedResources).not.toBeDefined();
  });

});
