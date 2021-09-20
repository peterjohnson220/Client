import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { HtmlToPdfGenerationRequest } from '../../../models/payfactors-api/html-to-pdf-generation/request';

@Injectable({
  providedIn: 'root',
})
export class HtmlToPdfGenerationApiService {
  private endpoint = 'PdfGeneration';

  constructor(private payfactorsApiService: PayfactorsApiService) {}

  startPdfGeneration(request: HtmlToPdfGenerationRequest): Observable<string> {
    return this.payfactorsApiService.post<string>(`${this.endpoint}/StartPdf`, request);
  }
}
