import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SaveFilterModalComponent } from './save-filter-modal.component';

describe('User Filter Feature - Save Filter Modal', () => {
  let instance: SaveFilterModalComponent;
  let fixture: ComponentFixture<SaveFilterModalComponent>;

  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [ SaveFilterModalComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(SaveFilterModalComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit a dismissed event when handling the modal dismissal', () => {
    spyOn(instance.dismissed, 'emit');

    instance.handleModalDismiss();

    expect(instance.dismissed.emit).toHaveBeenCalled();
  });

  it('should emit a save filter event with the form data when handling the modal submit', () => {
    spyOn(instance.saveFilter, 'emit');
    instance.nameFilterForm.patchValue({
      name: 'Mercer 2018 Surveys',
      setAsDefault: false
    });
    const expectedEventData = {
      Name: 'Mercer 2018 Surveys',
      SetAsDefault: false
    };

    instance.handleModalSubmit();

    expect(instance.saveFilter.emit).toHaveBeenCalledWith(expectedEventData);
  });
});
