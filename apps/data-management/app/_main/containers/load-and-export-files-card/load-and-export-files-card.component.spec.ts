import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { SettingsService } from 'libs/state/app-context/services';
import * as fromRootState from 'libs/state/state';

import { LoadAndExportFilesCardComponent } from './load-and-export-files-card.component';

describe('Data Management - Main - Load And Export File Card', () => {
  let instance: LoadAndExportFilesCardComponent;
  let fixture: ComponentFixture<LoadAndExportFilesCardComponent>;
  let store: Store<fromRootState.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          pf_admin: combineReducers(fromRootState.reducers),
        })
      ],
      providers: [
        {
          provide: SettingsService,
          useValue: { selectCompanySetting: () => of(true)}
        }
      ],
      declarations: [ LoadAndExportFilesCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(LoadAndExportFilesCardComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('no access should not show anything', () => {
    instance.canImportOrgData = false;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('has access should show', () => {
    instance.canImportOrgData = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
