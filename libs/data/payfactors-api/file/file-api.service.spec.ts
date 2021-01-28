import { HttpHeaders, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { FileDownloadError, FileDownloadSuccess, FileDownloadProgress } from 'libs/features/file-download/file-download/actions/file-download.actions';
import { FileApiService } from './file-api.service';

describe('FileApiService', () => {
  let httpTestingController: HttpTestingController;
  let service: FileApiService;

  beforeEach(() => {
    // jest config for these tests
    jest.useFakeTimers();

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        FileApiService,
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(FileApiService);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save blobs as files', () => {
    // arrange
    const content = 'Some Text Content';
    const blob = new Blob([ content ], { type: 'text/plain' });
    const fileName = 'test.txt';
    // in a real browser, the path is a GUID pointing to a blob in memory
    // this one is randomly generated, and has no significance
    const blobUrl = `blob:${window.location.origin}/d731c7cf-366d-4b8c-912a-34d63ffef2a0`;

    const a = document.createElement('a');
    jest.spyOn(document, 'createElement').mockReturnValue(a);

    // spy on dispatchEvent so we can check that the click happens as we expect
    const dispatchEventSpy = jest.spyOn(a, 'dispatchEvent');

    // mock out URL.createObjectURL and URL.revokeObjectURL, as this is missing from jsdom
    const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL').mockReturnValue(blobUrl);
    const revokeObjectURLSpy = jest.spyOn(URL, 'revokeObjectURL');

    // act
    const success = service.saveBlobAsFile(blob, fileName);

    jest.runAllTimers();

    // assert
    expect(success).toBeTruthy();
    expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
    expect(revokeObjectURLSpy).toHaveBeenCalledWith(blobUrl);
    expect(dispatchEventSpy).toHaveBeenCalled();
    expect(a.href).toBe(blobUrl);
    expect(a.download).toBe(fileName);
  });

  it('should return false if unable to save a blob as file', () => {
    // arrange
    const content = 'Some Text Content';
    const blob = new Blob([ content ], { type: 'text/plain' });
    const fileName = 'test.txt';

    // use an empty object as a mock for the anchor element, so it will fail the test for download capability
    // @ts-ignore
    jest.spyOn(document, 'createElement').mockReturnValue({});

    // act
    const success = service.saveBlobAsFile(blob, fileName);

    jest.runAllTimers();

    // assert
    expect(success).toBeFalsy();
  });

  it('should create an anchor tag with modified attributes when openInNewTab is true', () => {
    // arrange
    const content = 'Some Text Content';
    const blob = new Blob([ content ], { type: 'text/plain' });
    const fileName = 'test.txt';

    const a = document.createElement('a');
    jest.spyOn(document, 'createElement').mockReturnValue(a);

    // act
    service.saveBlobAsFile(blob, fileName, true);

    jest.runAllTimers();

    // assert
    expect(a.download).toBeFalsy();
    expect(a.target).toBe('_blank');
  });

  it('should return a FileDownloadSuccess action when downloading a file succeeds', () => {
    // arrange
    const content = 'Some Text Content';
    const blob = new Blob([ content ], { type: 'text/plain' });
    const fileName = 'test.txt';
    const url = 'http://domain.com/file';
    const fileId = '12345';
    const errorSpy = jest.fn();
    const nextSpy = jest.fn();
    const headers = new HttpHeaders({
      'content-disposition': `filename=${fileName}`,
    });
    const action = new FileDownloadSuccess({
      fileId,
      fileName,
      progress: 100,
    });

    // act
    service.downloadFile(url, fileId).subscribe({
      error: errorSpy,
      next: nextSpy,
    });

    const request = httpTestingController.expectOne(url);
    request.flush(blob, {
      headers,
    });

    // assert
    expect(nextSpy).toHaveBeenCalledWith(action);
    expect(errorSpy).not.toHaveBeenCalled();

    httpTestingController.verify();
  });

  it('should return a FileDownloadProgress action when progress is made on a file download', () => {
    // arrange
    const url = 'http://domain.com/file';
    const fileId = '12345';
    const errorSpy = jest.fn();
    const nextSpy = jest.fn();
    const loaded = 5000;
    const total = 10000;
    const action = new FileDownloadProgress({
      fileId,
      progress: 100 * loaded / total,
    });
    const progressEvent: HttpProgressEvent = {
      loaded,
      total,
      type: HttpEventType.DownloadProgress,
    };

    // act
    service.downloadFile(url, fileId).subscribe({
      error: errorSpy,
      next: nextSpy,
    });

    const request = httpTestingController.expectOne(url);
    request.event(progressEvent);

    // assert
    expect(nextSpy).toHaveBeenCalledWith(action);
    expect(errorSpy).not.toHaveBeenCalled();

    httpTestingController.verify();
  });

  it('should return a FileDownloadError action when downloading a file fails with an HTTP error', () => {
    // arrange
    const url = 'http://domain.com/file';
    const fileId = '12345';
    const errorSpy = jest.fn();
    const nextSpy = jest.fn();
    const action = new FileDownloadError({
      error: true,
      errorText: 'File not found.',
      fileId,
    });

    // act
    service.downloadFile(url, fileId).subscribe({
      error: errorSpy,
      next: nextSpy,
    });

    const request = httpTestingController.expectOne(url);
    request.flush(null, {
      status: 404,
      statusText: 'File not found',
    });

    // assert
    expect(nextSpy).toHaveBeenCalledWith(action);
    expect(errorSpy).not.toHaveBeenCalled();

    httpTestingController.verify();
  });

  it('should return a FileDownloadError action when downloading a file fails on save', () => {
    // arrange
    const content = 'Some Text Content';
    const blob = new Blob([ content ], { type: 'text/plain' });
    const fileName = 'test.txt';
    const url = 'http://domain.com/file';
    const fileId = '12345';
    const errorSpy = jest.fn();
    const nextSpy = jest.fn();
    const headers = new HttpHeaders({
      'content-disposition': `filename=${fileName}`,
    });
    const action = new FileDownloadError({
      error: true,
      errorText: `Unable to save file "${fileName}" to disk`,
      fileId,
      progress: 100,
    });

    // use an empty object as a mock for the anchor element, so it will fail the test for download capability
    // @ts-ignore
    jest.spyOn(document, 'createElement').mockReturnValue({});

    // act
    service.downloadFile(url, fileId).subscribe({
      error: errorSpy,
      next: nextSpy,
    });

    const request = httpTestingController.expectOne(url);
    request.flush(blob, {
      headers,
    });

    // assert
    expect(nextSpy).toHaveBeenCalledWith(action);
    expect(errorSpy).not.toHaveBeenCalled();

    httpTestingController.verify();
  });

  it('should extract token values from header', () => {
    // arrange
    const headerName = 'headerName';
    const tokenName = 'tokenName';
    const tokenValue = 'value';
    const headers = new HttpHeaders({
      [headerName]: `${tokenName}=${tokenValue}`,
    });

    // act
    const value = service.getHeaderTokenValue(headers, tokenName, headerName);

    // assert
    expect(value).toBe(tokenValue);
  });

  it('should return null when extracting invalid token values from header', () => {
    // arrange
    const headerName = 'headerName';
    const tokenName = 'invalidToken';
    const headers = new HttpHeaders({
      [headerName]: 'notWhatWeAreLookingFor=nope;notThisEither=nuhUh',
    });

    // act
    const value = service.getHeaderTokenValue(headers, tokenName, headerName);

    // assert
    expect(value).toBeNull();
  });

  it('should return null when extracting token values from missing header', () => {
    // arrange
    const headerName = 'invalidHeader';
    const tokenName = 'tokenName';
    const headers = new HttpHeaders({
      notTheRightHeader: 'notWhatWeAreLookingFor=nope;notThisEither=nuhUh',
    });

    // act
    const value = service.getHeaderTokenValue(headers, tokenName, headerName);

    // assert
    expect(value).toBeNull();
  });
});
