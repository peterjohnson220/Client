import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { generateMockWorkbook } from 'libs/features/surveys/reports/models';

import { TagWorkbookModalComponent } from './tag-workbook-modal.component';
import { generateMockSaveWorkbookTagObj } from '../../models';

describe('Data Insights - Tag Workbook Modal Component', () => {
  let instance: TagWorkbookModalComponent;
  let fixture: ComponentFixture<TagWorkbookModalComponent>;
  let ngbModal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [ TagWorkbookModalComponent ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), dismissAll: jest.fn() },
        },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TagWorkbookModalComponent);
    instance = fixture.componentInstance;
    ngbModal = TestBed.inject(NgbModal);

    fixture.detectChanges();
  });

  it('should use the modal service to open the modal when open is called', () => {
    spyOn(ngbModal, 'open');
    instance.open();

    expect(ngbModal.open).toHaveBeenCalled();
  });

  it('should reset the saveWorkbookTagObj to null, when opening', () => {
    instance.open();

    expect(instance.saveWorkbookTagObj).toBeNull();
  });

  it('should emit a save clicked event with the saveWorkbookTagObj, when handling a save click', () => {
    spyOn(instance.saveClicked, 'emit');
    const mockSaveWorkbookTagObj = generateMockSaveWorkbookTagObj();
    instance.saveWorkbookTagObj = mockSaveWorkbookTagObj;

    instance.handleSaveClicked();

    expect(instance.saveClicked.emit).toHaveBeenCalledWith(mockSaveWorkbookTagObj);
  });

  it('should use the modal service to dismiss the modal, when close is called', () => {
    spyOn(ngbModal, 'dismissAll');

    instance.close();

    expect(ngbModal.dismissAll).toHaveBeenCalled();
  });

  it('should build a saveWorkbookTagObj, when handling the tag value changed', () => {
    instance.selectedWorkbook = generateMockWorkbook();

    instance.handleTagValueChanged('New Tag from Value');

    expect(instance.saveWorkbookTagObj).toEqual({
      WorkbookId: '123456789',
      Tag: 'New Tag from Value'
    });
  });

  it('should build a saveWorkbookTagObj, when handling the filter value changed', () => {
    instance.selectedWorkbook = generateMockWorkbook();

    instance.handleTagFilterChanged('New Tag from Filter');

    expect(instance.saveWorkbookTagObj).toEqual({
      WorkbookId: '123456789',
      Tag: 'New Tag from Filter'
    });
  });

  it('should return false for noFilteredTags, when we dont have a saveWorkbookTagObj', () => {
    instance.saveWorkbookTagObj = null;

    expect(instance.noFilteredTags).toBe(false);
  });

  it('should return false for noFilteredTags, when the saveWorkbookTagObj tag does exist in the collection of tags', () => {
    instance.saveWorkbookTagObj = {...generateMockSaveWorkbookTagObj(), Tag: 'Tag1'};
    instance.tags = ['Tag1', 'Tag2', 'Tag3'];

    expect(instance.noFilteredTags).toBe(false);
  });

  it('should ignore case, when looking up the saveWorkbookTagObj tag', () => {
    instance.saveWorkbookTagObj = {...generateMockSaveWorkbookTagObj(), Tag: 'TAG1'};
    instance.tags = ['Tag1', 'Tag2', 'Tag3'];

    expect(instance.noFilteredTags).toBe(false);
  });

  it('should return true for noFilteredTags, when the saveWorkbookTagObj tag does not exist in the collection of tags', () => {
    instance.saveWorkbookTagObj = {...generateMockSaveWorkbookTagObj(), Tag: 'Tag4'};
    instance.tags = ['Tag1', 'Tag2', 'Tag3'];

    expect(instance.noFilteredTags).toBe(true);
  });

});
