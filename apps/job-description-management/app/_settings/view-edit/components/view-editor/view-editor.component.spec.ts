import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditorComponent } from './view-editor.component';
import { generateMockJobDescriptionView } from '../../../shared/models';

describe('Job Description Management - Settings - View Editor', () => {
  let instance: ViewEditorComponent;
  let fixture: ComponentFixture<ViewEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEditorComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ViewEditorComponent);
    instance = fixture.componentInstance;
    instance.templateViewCopy = generateMockJobDescriptionView();
  });

  it('should stop emit a add hidden element id event with a toggle obj, when handling a control click, and the control is not hidden', () => {
    spyOn(instance.addHiddenElementId, 'emit');
    const controlId = 123;
    const mockJobDescriptionView = generateMockJobDescriptionView();
    const expectedToggleObj = {
      ViewName: mockJobDescriptionView.Name,
      TemplateId: mockJobDescriptionView.TemplateId,
      ElementId: controlId
    };
    instance.templateView = mockJobDescriptionView;
    instance.templateViewCopy = mockJobDescriptionView;

    instance.handleControlClicked(controlId);

    expect(instance.addHiddenElementId.emit).toHaveBeenCalledWith(expectedToggleObj);
  });

  it('should stop emit a remove hidden element id event with a toggle obj, when handling a control click, and the control is hidden', () => {
    spyOn(instance.removeHiddenElementId, 'emit');
    const controlId = 123;
    const mockJobDescriptionView = {...generateMockJobDescriptionView(), HiddenElementIds: [controlId]};
    const expectedToggleObj = {
      ViewName: mockJobDescriptionView.Name,
      TemplateId: mockJobDescriptionView.TemplateId,
      ElementId: controlId
    };
    instance.templateView = mockJobDescriptionView;
    instance.templateViewCopy = mockJobDescriptionView;

    instance.handleControlClicked(controlId);

    expect(instance.removeHiddenElementId.emit).toHaveBeenCalledWith(expectedToggleObj);
  });

  it('should be a hidden element if the control id is in the the hidden element ids', () => {
    const controlId = 123;
    const mockJobDescriptionView = {...generateMockJobDescriptionView(), HiddenElementIds: [controlId]};
    instance.templateView = mockJobDescriptionView;
    instance.templateViewCopy = mockJobDescriptionView;

    const result = instance.isHiddenControl(controlId);

    expect(result).toBe(true);
  });

  it('should not be a hidden element if the control id is not in the the hidden element ids', () => {
    const controlId = 123;
    const mockJobDescriptionView = {...generateMockJobDescriptionView(), HiddenElementIds: [777]};
    instance.templateView = mockJobDescriptionView;
    instance.templateViewCopy = mockJobDescriptionView;

    const result = instance.isHiddenControl(controlId);

    expect(result).toBe(false);
  });

});
