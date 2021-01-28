import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { PfValidators} from 'libs/forms/validators';
import { DataViewConfig, SimpleDataView } from 'libs/models/payfactors-api';

@Component({
  selector: 'pf-data-grid-save-view-modal',
  templateUrl: './pf-data-grid-save-view-modal.component.html'
})
export class PfDataGridSaveViewModalComponent implements OnInit {
  @Output() saved = new EventEmitter();
  @Output() closed = new EventEmitter();
  @Output() opened = new EventEmitter();
  @Input() saving = false;

  @Input() errorSaving = false;
  @Input() savedViews: SimpleDataView[];
  @Input() modalOpen$: Observable<boolean>;
  @Input() viewSaving: boolean;

  public filterForm: FormGroup;
  public attemptedSave = false;


  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  close() {
    this.closed.emit();
  }

  save() {
    this.attemptedSave = true;
    if (this.filterForm.valid) {
      this.saved.emit(this.filterForm.controls['name'].value);
    }
  }

  buildForm() {
    this.filterForm = this.formBuilder.group({
      name: ['', [PfValidators.required, Validators.maxLength(100), this.notBlackListed().bind(this)]]
    });
  }

  notBlackListed() {
    return function(c: FormControl) {
      const blackList = this.savedViews ? this.savedViews.map(uf => uf.Name.toLowerCase()) : [];
      const blackListed = blackList && c.value ? !!blackList.find(bl => bl === c.value.toLowerCase()) : false;
      return blackListed ? {'notBlackListed': {valid: false}} : null;
    };
  }
}
