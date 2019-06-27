import { Component, Input } from '@angular/core';

import { ExchangeJobAssociation } from 'libs/features/peer/job-association/models/exchange-job-association.model';

@Component({
  selector: 'pf-peer-association-color-block',
  templateUrl: './peer-association-color-block.component.html',
  styleUrls: ['./peer-association-color-block.component.scss']
})
export class PeerAssociationColorBlockComponent {
  @Input() unsavedExchangeJobAssociations: ExchangeJobAssociation[] = [];
  @Input() companyJobId: number;
  @Input() isAssociated: boolean;
  @Input() isPendingPeerUserReview: boolean;

  constructor() { }

  getAssociationClass(): string {
    if (this.isPendingPeerUserReview) {
      return 'pending';
    } else if (this.isAssociated || this.unsavedExchangeJobAssociationsContainAssociations()) {
      return 'associated';
    }
    return 'not-associated';
  }

  unsavedExchangeJobAssociationsContainAssociations(): boolean {
    for (let i = 0; i < this.unsavedExchangeJobAssociations.length; i++) {
      const eja = this.unsavedExchangeJobAssociations[i];
      if (eja.CompanyJobs.map(cj => cj.CompanyJobId).sort().indexOf(this.companyJobId) >= 0) {
        return true;
      }
    }
    return false;
  }

  getAssociationLabel(): string {
    const associationClass = this.getAssociationClass();
    if (associationClass === 'pending') {
      return 'Pending Review';
    } else if (associationClass === 'associated') {
      return 'Associated';
    } else {
      return 'Not Associated';
    }
  }

}
