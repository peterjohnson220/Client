import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { CompanyStructureView } from 'libs/models/structures/company-structure-view.model';

@Component({
  selector: 'pf-structure-card',
  templateUrl: './structure-card.component.html',
  styleUrls: ['./structure-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StructureCardComponent implements OnInit {
  @Input() structureView: CompanyStructureView;

  structurePaymarket: string;
  displayActionsOverlay: boolean;
  hoverStructureContainer: boolean;

  ngOnInit(): void {
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
}
