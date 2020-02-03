import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { BaseDataViewModalComponent } from './base-data-view-modal.component';

describe('Data Insights - Base Data View Modal', () => {
  let instance: BaseDataViewModalComponent;
  let fixture: ComponentFixture<BaseDataViewModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BaseDataViewModalComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(BaseDataViewModalComponent);
    instance = fixture.componentInstance;
  });

  it('should emit saveClicked when save is called', () => {
    spyOn(instance.saveClicked, 'emit');

    instance.save();

    expect(instance.saveClicked.emit).toHaveBeenCalled();
  });

  it('should emit cancelClicked when close is called', () => {
    spyOn(instance.cancelClicked, 'emit');

    instance.close();

    expect(instance.cancelClicked.emit).toHaveBeenCalled();
  });
});
