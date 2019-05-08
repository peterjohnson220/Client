import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TicketAttachment } from '../../models';

@Component({
  selector: 'pf-attachment-detail-card',
  templateUrl: './attachment-detail-card.component.html',
  styleUrls: ['./attachment-detail-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttachmentDetailCardComponent {
    @Input() ticketAttachments: TicketAttachment[];

    constructor() {}

    public openDocumentPreview(attachment: TicketAttachment): void {
    }
}
