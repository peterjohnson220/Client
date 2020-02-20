import { Observable } from 'rxjs';

import { DataViewDataRequest, DataViewEntityResponseWithCount, SaveDataViewRequest } from '../payfactors-api/reports';

export interface IDataViewService {
  getDataViewConfig(pageViewId: string, name: string): Observable<any>;
  getDataWithCount(request: DataViewDataRequest): Observable<DataViewEntityResponseWithCount>;
  updateDataView(request: SaveDataViewRequest): Observable<any>;
  getViewsByUser(pageViewId: string): Observable<any>;
}
