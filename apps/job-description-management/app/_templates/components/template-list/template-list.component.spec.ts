import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbDropdown, NgbModal, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';

import * as fromTemplateReducers from '../../reducers';
import {TemplateListComponent} from './template-list.component';
import {generateMockTemplateListItem} from '../../models';

describe('Job Description Management - Templates - Template List',
  () => {
  let instance: TemplateListComponent;
  let fixture: ComponentFixture<TemplateListComponent>;
  let store: Store<fromTemplateReducers.State>;
  let modal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbPopoverModule,
        StoreModule.forRoot({
          ...fromRootState.reducers,
          jobdescriptionmanagement_templates: combineReducers
            (fromTemplateReducers.reducers),
      })
    ],
    declarations: [
      TemplateListComponent, NgbDropdown
    ],
      providers: [
      {
        provide: NgbModal,
        useValue: {open: jest.fn()}
      }
    ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(TemplateListComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    modal = TestBed.get(NgbModal);
  });

    it('should emit openDeleteModal', () => {
      spyOn(instance.openDeleteModal, 'emit');

      const mockedTemplateListItem = generateMockTemplateListItem(1);
      const testEvent = new Event('click');

      instance.handleDeleteClick(testEvent, mockedTemplateListItem);

      expect(instance.openDeleteModal.emit).toHaveBeenLastCalledWith(        mockedTemplateListItem);
  });

    it('should emit openCopyModal', () => {
      spyOn(instance.openCopyModal, 'emit');

      const mockedTemplateListItem = generateMockTemplateListItem(1);
      const testEvent = new Event('click');

      instance.handleCopyClick(testEvent, mockedTemplateListItem);

      expect(instance.openCopyModal.emit).toHaveBeenLastCalledWith(        mockedTemplateListItem);
    });
});
