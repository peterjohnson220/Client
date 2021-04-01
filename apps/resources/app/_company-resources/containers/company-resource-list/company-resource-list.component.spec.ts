import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { StoreModule } from '@ngrx/store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SettingsService } from 'libs/state/app-context/services';
import * as fromRootState from 'libs/state/state';

import { CompanyResourceListComponent } from './company-resource-list.component';

describe('CompanyResourceListComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule,
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
      ],
      declarations: [
        CompanyResourceListComponent
      ],
      providers: [
        SettingsService
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
