import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'pf-export-delete-modal',
  templateUrl: './export-delete-modal.component.html',
  styleUrls: ['./export-delete-modal.component.scss']
})
export class ExportDeleteModalComponent {
  @Input() reportName: string;
  @Input() showDeleteModal$: Observable<boolean>;
  @Output() deleteScheduledExport = new EventEmitter();
  @Output() cancelClicked = new EventEmitter();

  onDismiss(): void {
    this.cancelClicked.emit();
  }

  onSubmit(): void {
    this.deleteScheduledExport.emit();
  }


}
