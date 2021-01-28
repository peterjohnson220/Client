import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { FileUploadComponent } from './file-upload.component';
import * as fromFileUploadReducer from '../../reducers';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let store: Store<fromFileUploadReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          orgDataLoader: combineReducers(fromFileUploadReducer.reducers)
        })],
      declarations: [FileUploadComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate file extensions', () => {

    // everything is valid
    expect(component.validateFileExtension(new File([], 'anything.broken'))).toBe(true);

    // specific validation
    component.validFileExtensions = ['.csv', 'png'];
    expect(component.validateFileExtension(new File([], 'test.csv'))).toBe(true);
    expect(component.validateFileExtension(new File([], 'test.png'))).toBe(true);
    expect(component.validateFileExtension(new File([], 'test.PnG'))).toBe(true);
    expect(component.validateFileExtension(new File([], 'test.jpg'))).toBe(false);
  });

  it('should validate file starts with', () => {
    // everything is valid
    expect(component.validateFileStartsWith(new File([], 'anything.broken'))).toBe(true);

    // specific validation
    component.validFileStartsWith = 'jobs';
    expect(component.validateFileStartsWith(new File([], 'JoBs.csv'))).toBe(true);
    expect(component.validateFileStartsWith(new File([], 'jobs.test'))).toBe(true);
    expect(component.validateFileStartsWith(new File([], 'employee.test'))).toBe(false);
  });
});
