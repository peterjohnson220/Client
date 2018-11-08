import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { SavedFilter } from '../../models/saved-filter.model';

@Component({
  selector: 'pf-filter-actions',
  templateUrl: './filter-actions.component.html',
  styleUrls: ['./filter-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterActionsComponent {
  @Input() loadingSavedFilters: boolean;
  @Input() savedFilters: SavedFilter[];
  @Input() deletingSavedFilter: boolean;
  @Input() filterIdToDelete: string;
  @Input() canSaveFilters: boolean;

  @Output() reset = new EventEmitter();
  @Output() save = new EventEmitter();
  @Output() deleteSavedFilter = new EventEmitter<{ filterId: string}>();
  @Output() deleteSavedFilterConfirmed = new EventEmitter();
  @Output() cancelDeleteSavedFilter = new EventEmitter<{ filterId: string}>();
  @Output() savedFilterSelected = new EventEmitter<SavedFilter>();

  constructor() { }

  handleResetClicked() {
    this.reset.emit();
  }

  handleSaveClicked() {
    if (this.canSaveFilters) {
      this.save.emit();
    }
  }

  handleSavedFilterClicked(savedFilter: SavedFilter) {
    this.savedFilterSelected.emit(savedFilter);
  }

  handleDeleteSavedFilter(deleteSavedFilterObj: {filterId: string}) {
    this.deleteSavedFilter.emit(deleteSavedFilterObj);
  }

  handleCancelDeleteSavedFilter() {
    this.cancelDeleteSavedFilter.emit();
  }

  handleDeleteSavedFilterConfirmed() {
    this.deleteSavedFilterConfirmed.emit();
  }
}
