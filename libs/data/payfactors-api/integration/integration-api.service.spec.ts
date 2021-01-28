import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FileDownloadSuccess } from 'libs/features/file-download/file-download/actions/file-download.actions';
import { UserContext, FileType } from 'libs/models';
import { of } from 'rxjs';

import { CompositeSummaryDownloadRequest } from '../../../models/dashboard';
import { FileApiService } from '../file/file-api.service';
import { PayfactorsApiService } from '../payfactors-api.service';
import { IntegrationApiService } from './integration-api.service';

describe('IntegrationApiService', () => {
  let httpTestingController: HttpTestingController;
  let service: IntegrationApiService;
  const testJwt = 'abcdef.1234567890.fedcba';

  class MockPayfactorsApiService {
    get = (url: string) => of(testJwt);
  }

  class MockFileApiService {
    downloadFile = (downloadUrl: string, fileId: string, options: any) => of(new FileDownloadSuccess({
      fileId,
      fileName: fileId,
      progress: 100,
    }))
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        IntegrationApiService,
        { provide: FileApiService, useClass: MockFileApiService },
        { provide: PayfactorsApiService, useClass: MockPayfactorsApiService },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(IntegrationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch Auth JWTs', () => {
    // arrange
    const error = jest.fn();
    const next = jest.fn();

    // act
    service.fetchAuthToken().subscribe({
      error,
      next,
    });

    // assert
    expect(next).toHaveBeenCalledWith(testJwt);
    expect(error).not.toHaveBeenCalled();
  });

  it('should download composite summary files', () => {
    // arrange
    const fileId = 'testFile';
    const CompanyId = 12345;
    const request: CompositeSummaryDownloadRequest = {
      Id: fileId,
      FileType: FileType.InvalidRecordsFile
    };
    const userContext = <UserContext> {
      CompanyId,
      ConfigSettings: [
        { Name: 'UtilitiesSubDomain', Value: 'utilities' },
      ],
    };
    const expectedAction = new FileDownloadSuccess({
      fileId,
      fileName: fileId,
      progress: 100,
    });
    const error = jest.fn();
    const next = jest.fn();

    // act
    service.compositeSummaryDownload(request, userContext).subscribe({
      error,
      next,
    });

    // assert
    expect(next).toHaveBeenCalledWith(expectedAction);
    expect(error).not.toHaveBeenCalled();
  });
});
