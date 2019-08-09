import { Component, Input } from '@angular/core';

import { CompanyStructure } from 'libs/models/structures/company-structure.model';

import { JobBasedRangeStructuresConstants } from '../../constants/structures.constants';

@Component({
  selector: 'pf-structure-favorite-hexagon',
  templateUrl: './structure-favorite-hexagon.component.html',
  styleUrls: ['./structure-favorite-hexagon.component.scss']
})
export class StructureFavoriteHexagonComponent {
  @Input() structureFavorite: CompanyStructure;

  structureFavoriteStockThumbnail = JobBasedRangeStructuresConstants.STRUCTURE_FAVORITE_STOCK_THUMBNAIL;
}
