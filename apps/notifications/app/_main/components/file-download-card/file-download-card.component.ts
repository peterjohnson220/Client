import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-file-download-card',
  templateUrl: './file-download-card.component.html',
  styleUrls: ['./file-download-card.component.scss']
})

export class FileDownloadCardComponent {
  @Input() fileDisplayName: string;
  @Input() fileName: string;
  @Input() createdDateTime: Date;
  @Input() downloadPath: string;
  @Input() iconName: 'file-excel' | 'file-pdf';
  @Input() openInNewTab = false;
}
