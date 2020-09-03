import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import * as fromRootState from 'libs/state/state';

import { EntityUploadComponent } from './entity-upload.component';
import { getEntityChoicesForOrgLoader } from '../../models';

describe('EntityUploadComponent', () => {
  let component: EntityUploadComponent;
  let fixture: ComponentFixture<EntityUploadComponent>;
  let mainStore: MockStore<fromRootState.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntityUploadComponent],
      providers: [provideMockStore({})],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EntityUploadComponent);
    component = fixture.componentInstance;
    mainStore = TestBed.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show entities that are selected', () => {
    component.entities = getEntityChoicesForOrgLoader();
    component.entities[1].isChecked = true;

    const selected = component.selectedEntities();
    expect(selected).toHaveLength(1);
    expect(selected[0].DisplayText).toBe('Jobs');
  });

  it('should evaluate HasAnyFiles() correctly on file upload', () => {
    component.entities = getEntityChoicesForOrgLoader();

    expect(component.HasAnyFiles()).toBe(false);

    component.entities[1].isChecked = true;
    component.entities[1].File = {
      arrayBuffer(): Promise<ArrayBuffer> {
        return Promise.resolve(undefined);
      }, stream(): ReadableStream {
        return undefined;
      }, text(): Promise<string> {
        return Promise.resolve('');
      }, lastModified: 1234, name: 'testfile', size: 1234, type: 'asdf', slice: jest.fn() };

    expect(component.HasAnyFiles()).toBe(true);

  });

});
