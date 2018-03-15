import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IdSelector } from '@ngrx/entity/src/models';

export interface Card<TDataItem> {
  IsSelected: boolean;
  IsDisabled: boolean;
}

export interface CardEntityState<T> extends EntityState<T> {
  loading: boolean;
  loadingError: boolean;
}

export interface CardEntityAdapter<T> extends EntityAdapter<T> {
  aldreadySelected(id: number | string): boolean;
}

// export declare function createCardEntityAdapter<TDataItem>(
//   idSelector: IdSelector<TDataItem>,
//   disabledExpression: (dataItem: TDataItem) => boolean
// ): CardEntityAdapter<TDataItem> {
//   const entityAdapter: EntityAdapter<TDataItem> = createEntityAdapter<TDataItem>({
//     selectId: idSelector
//   });
//   return {
//     ...entityAdapter,
//     aldreadySelected(id: number | string): boolean {
//       return entityAdapter.getSelectors().selectIds.some(id);
//     }
//   };
// }
//
// export const adapter: EntityAdapter<ExistingCompany> = createEntityAdapter<ExistingCompany>({
//   selectId: (existingCompany: ExistingCompany) => existingCompany.CompanyId
// });
//
// const initialState: State = adapter.getInitialState({
//   loading: false,
//   loadingError: false
// });
