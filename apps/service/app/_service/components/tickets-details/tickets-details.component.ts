import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { FileRestrictions, SelectEvent } from '@progress/kendo-angular-upload';

import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import { AsyncStateObj } from 'libs/models/state';
import { UploadedFile } from 'libs/models/service';
import { Files } from 'libs/constants';

import * as fromServicePageReducer from '../../reducers';
import * as fromServicePageActions from '../../actions/service-page.actions';
import { ServicePageConfig, UserTicket } from '../../models';

@Component({
  selector: 'pf-tickets-details',
  templateUrl: './tickets-details.component.html',
  styleUrls: ['./tickets-details.component.scss']
})
export class TicketsDetailsComponent implements OnChanges, OnDestroy {
  @Input() jobDetailsFilters: PfDataGridFilter[];
  @Input() selectedTicketId: number;
  @Output() onClose = new EventEmitter();

  ticket$: Observable<AsyncStateObj<UserTicket>>;

  ticketSubscription: Subscription;

  fileUploadMax = ServicePageConfig.MaxFileUploads;
  ticket: UserTicket;
  uploadSaveUrl: string;
  uploadedFilesData: UploadedFile[] = [];
  errorMessage = '';
  uploadError = false;

  public uploadRestrictions: FileRestrictions = {
    allowedExtensions: Files.VALID_FILE_EXTENSIONS,
    maxFileSize: Files.MAX_SIZE_LIMIT
  };

  constructor(private store: Store<fromServicePageReducer.State>) {
    this.ticket$ = this.store.pipe(select(fromServicePageReducer.getSelectedTicketDetails));
    this.ticketSubscription = this.ticket$.subscribe((t) => {
      if (t.obj && t.obj.TicketId === this.selectedTicketId) {
        this.ticket = t.obj;
        this.uploadSaveUrl = `/odata/Ticket/AddAttachment/${this.ticket.TicketId}`;
        this.errorMessage = '';
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedTicketId && (changes.selectedTicketId.previousValue !== changes.selectedTicketId.currentValue)) {
      this.uploadedFilesData = [];
      this.store.dispatch(new fromServicePageActions.GetUserTicket(this.selectedTicketId));
    }
  }

  ngOnDestroy() {
    this.ticketSubscription.unsubscribe();
  }

  close() {
    this.onClose.emit(null);
  }

  onFileSelect(e: SelectEvent) {
    if (e.files.length > this.fileUploadMax - this.ticket.Attachments.length) {
      this.uploadError = true;
      this.errorMessage = 'The maximum number of files is ' + this.fileUploadMax + '.';
      e.preventDefault();
    }
  }

  private getFileExtension(fileName: string) {
    const fileExtenstion = fileName.split('.');
    return fileExtenstion[1];
  }
}
