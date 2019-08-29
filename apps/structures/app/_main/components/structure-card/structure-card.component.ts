import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CompanyStructureView } from 'libs/models/structures/company-structure-view.model';

import { JobRangeModelingConstants } from '../../constants/structures.constants';

@Component({
  selector: 'pf-structure-card',
  templateUrl: './structure-card.component.html',
  styleUrls: ['./structure-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StructureCardComponent implements OnInit {
  @Input() structureView: CompanyStructureView;
  @Output() favoriteClicked: EventEmitter<CompanyStructureView> = new EventEmitter();

  structurePaymarket: string;
  displayActionsOverlay: boolean;
  hoverStructureContainer: boolean;
  jobRangeModelingLink = JobRangeModelingConstants.JOB_RANGE_MODELING_LINK;

  ngOnInit() {
    this.structurePaymarket = (this.structureView.Structure
      && this.structureView.Structure.CompanyStructureRangeGroups
      && this.structureView.Structure.CompanyStructureRangeGroups.length > 0)
      ? this.structureView.Structure.CompanyStructureRangeGroups[0].PayMarket : '';
  }

  handleMouseOverStructureContainer() {
    this.hoverStructureContainer = true;
    this.displayActionsOverlay = true;
  }

  handleMouseLeaveStructureContainer() {
    this.hoverStructureContainer = false;
    this.displayActionsOverlay = false;
  }

  handleFavoriteClicked(structureView: CompanyStructureView) {
    this.favoriteClicked.emit(structureView);
    this.structureView.IsFavorite = !this.structureView.IsFavorite;
  }
}
