import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PayfactorsApiService } from '../payfactors-api.service';

import {EmptyObservable} from 'rxjs/observable/EmptyObservable';
import { Subject } from 'rxjs';
import 'rxjs/add/observable/of';

//TO BE CHANGED TO MARKETING IMAGE MODEL
//import { TermsConditionsSubmissionModel } from '../../../models';

@Injectable()
export class MarketingImageService {

  //TO BE CHANGED TO MARKETING IMAGE Endpoint
  private endpoint = 'MarketingImage';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  postFile(fileToUpload: any): Observable<any> {
    //TODO
    console.log("MarketingImageService.postFile called!");
    const ready: Subject<any> = new Subject<any>();


    const result: any = {
      active: true
    };
    if (fileToUpload) {
      console.log(JSON.stringify(result));
      ready.next(JSON.stringify(result));
    }


    return Observable.of(JSON.stringify(result));
}

/*postTermsConditionsResponse(userResponse: TermsConditionsSubmissionModel): Observable<any> {
  return this.payfactorsApiService.post<TermsConditionsSubmissionModel>(`${this.endpoint}.CreateTCResponse`,
    {
      TCId: userResponse.TCId,
      Accepted: userResponse.Accepted
    }
  );
}*/

}
