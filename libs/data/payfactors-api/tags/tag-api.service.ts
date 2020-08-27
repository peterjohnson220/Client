import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { MappingHelper } from '../../../core/helpers';
import { AddTagCategoriesRequest,
         TagInformationRequest,
         UpsertTagCategoryRequest,
         SaveTagInformationRequest } from '../../../models/peer/requests';
import { TagInformation } from '../../../models/peer';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class TagApiService {
  private endpoint = 'Tag';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getTagCategories(exchangeId: number, listState: any): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(`${this.endpoint}/GetTagCategories`, {
        params: { exchangeId: exchangeId, listState: JSON.stringify(listState) }
      },
      MappingHelper.mapListAreaResultToGridDataResult
    );
  }

  validateNewTagCategoryName(tagCategoryName: string): Observable<any> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/IsValidTagCategoryName`,
      { params: { tagCategoryName: tagCategoryName } });
  }

  createTagCategory(upsertRequest: UpsertTagCategoryRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/CreateTagCategory`, upsertRequest);
  }

  addTagCategoriesToExchange(addTagCategoriesRequest: AddTagCategoriesRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/AddTagCategoriesToExchange`, addTagCategoriesRequest);
  }

  getTagInformation(tagInformationRequest: TagInformationRequest): Observable<TagInformation[]> {
    return this.payfactorsApiService.get<TagInformation[]>(`${this.endpoint}/GetTagInformation`,
      { params: { entityType: tagInformationRequest.EntityType, entityId: tagInformationRequest.EntityId } });
  }

  saveTagInformation(saveTagInformationRequest: SaveTagInformationRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/SaveTagInformation`, saveTagInformationRequest);
  }
}
