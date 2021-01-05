import { ChangeDetectionStrategy, Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { PfValidators } from 'libs/forms/validators';
import { MultiSelectFilter } from 'libs/features/search/search/models';

import { SaveFilterModalData } from '../../models';

@Component({
  selector: 'pf-save-filter-modal',
  templateUrl: './save-filter-modal.component.html',
  styleUrls: ['./save-filter-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaveFilterModalComponent implements OnInit, OnChanges {
  @Input() savingFilterConflict: boolean;
  @Input() savingFilterError: boolean;
  @Input() savingFilters: boolean;
  @Input() isOpen$: Observable<boolean>;
  @Input() modalData: SaveFilterModalData;
  @Input() setAsDefaultLabel = 'Default';
  @Input() legacyImplementation: boolean;
  @Output() saveFilter = new EventEmitter<SaveFilterModalData>();
  @Output() dismissed = new EventEmitter();

  nameFilterForm: FormGroup;
  showErrorMessages: boolean;
  isEditMode: boolean;
  filtersToSave: MultiSelectFilter[];

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.modalData) {
      this.updateModalData();
    }
  }

  createForm(): void {
    this.nameFilterForm = this.fb.group({
      'name': ['', [PfValidators.required, Validators.maxLength(255)]],
      'setAsDefault': [false]
    });
  }

  // Events
  handleModalSubmit() {
    this.showErrorMessages = true;
    let modalData = {
      Name: this.nameFilterForm.value.name,
      SetAsDefault: !!this.nameFilterForm.value.setAsDefault,
      SearchFiltersToSave: this.filtersToSave
    };
    if (this.isEditMode) {
      modalData = Object.assign({ SavedFilter: this.modalData.SavedFilter }, modalData);
    }
    this.saveFilter.emit(modalData);
  }

  handleModalDismiss() {
    this.dismissed.emit();
  }

  private updateModalData(): void {
    this.isEditMode = !!this.modalData && !!this.modalData.Name;
    if (this.isEditMode) {
      this.nameFilterForm.get('name').setValue(this.modalData.Name);
      this.nameFilterForm.get('setAsDefault').setValue(this.modalData.SetAsDefault);
    }
    if (!!this.modalData && !!this.modalData.SearchFiltersToSave) {
      this.filtersToSave = this.modalData.SearchFiltersToSave;
    }
  }
}
