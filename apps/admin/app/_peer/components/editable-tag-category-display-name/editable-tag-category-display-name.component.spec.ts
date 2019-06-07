import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { of } from 'rxjs/internal/observable/of';

import { PfCommonModule } from 'libs/core';
import { PfValidatableDirective } from 'libs/forms/directives';

import { EditableTagCategoryDisplayNameComponent } from './editable-tag-category-display-name.component';

describe('Admin - Peer - Editable Tag Category Display Name', () => {
  let fixture: ComponentFixture<EditableTagCategoryDisplayNameComponent>;
  let instance: EditableTagCategoryDisplayNameComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        PfCommonModule
      ],
      declarations: [
        PfValidatableDirective,
        EditableTagCategoryDisplayNameComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(EditableTagCategoryDisplayNameComponent);
    instance = fixture.componentInstance;

    instance.value = 'MOCK_VALUE';
    instance.saving$ = of(false);
    instance.errorSaving$ = of(false);
  });

  it('should match snapshot', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should show edit form when toggleEdit is triggered`, () => {
    fixture.detectChanges();

    instance.toggleEdit();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();


  });
});
