import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpProgressEvent,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';

import { FileDownloadError, FileDownloadProgress, FileDownloadSuccess } from 'libs/features/file-download/actions/file-download.actions';

@Injectable()
export class FileApiService {

  constructor(
    private http: HttpClient,
  ) {

  }

  downloadFile(url: string, fileId: string, options: any = {}) {
    const httpOptions = {
      ...options,
      responseType: 'blob',
      observe: 'events',
      reportProgress: true,
    };

    return this.http.get<Blob>(url, httpOptions).pipe(
      filter((event: HttpEvent<Blob>) => {
        return event.type === HttpEventType.DownloadProgress || event instanceof HttpResponse;
      }),
      switchMap((event: HttpEvent<Blob>) => {
        let action: Action;

        if (event.type === HttpEventType.DownloadProgress) {
          action = this.processDownloadProgressEvent(event, fileId);
        } else if (event instanceof HttpResponse) {
          action = this.processDownloadHttpResponse(event, fileId);
        }

        return of(action);
      }),
      catchError((error: HttpErrorResponse) => {
        const action = this.processDownloadError(error, fileId);
        return of(action);
      }),
    );
  }

  saveBlobAsFile(blob: Blob, fileName: string, openInNewTab = false) {
    const link = document.createElement('a');
    let success = false;

    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, fileName);
      success = true;
    } else if (link.download !== undefined) {
      const downloadLink = encodeURI(URL.createObjectURL(blob));
      link.setAttribute('href', downloadLink);
      link.style.visibility = 'hidden';

      if (openInNewTab) {
        link.setAttribute('target', '_blank');
      } else {
        link.setAttribute('download', encodeURI(fileName));
      }

      document.body.appendChild(link);

      // Push the download operation on the next tick
      requestAnimationFrame(() => {
        const click = new MouseEvent('click');
        link.dispatchEvent(click);
        document.body.removeChild(link);

        /**
         * Revoke the object url later in time
         * we just need to wait long enough for the save operation to have began,
         * but there's no way to know for certain
         * so timeout the blob URL after 10 seconds, to be safe
         **/
        const blobGarbageCollectionTimeout = 10000;
        setTimeout(() => URL.revokeObjectURL(downloadLink), blobGarbageCollectionTimeout);
      });

      success = true;
    }

    return success;
  }

  getHeaderTokenValue(headers: HttpHeaders, tokenName: string, headerName: string): string {
    const header = headers.get(headerName);
    const headerTokens = typeof header === 'string' ? header.split(';') : [];
    const token = headerTokens.find(ht => ht.split('=')[0].trim() === tokenName);
    const tokenKeyValuePair = typeof token === 'string' ? token.split('=') : [];
    return tokenKeyValuePair.length === 2 ? tokenKeyValuePair[1] : null;
  }

  private processDownloadError({ status }: HttpErrorResponse, fileId: string) {
    let errorText: string;

    if (status === 401) {
      errorText = 'User not authorized to download this file.';
    } else if (status >= 400 && status < 500) {
      errorText = 'File not found.';
    } else if (status >= 500 && status < 600) {
      errorText = 'Server error.';
    } else {
      errorText = 'Unknown error.';
    }

    return new FileDownloadError({
      error: true,
      errorText,
      fileId,
    });
  }

  private processDownloadHttpResponse(response: HttpResponse<Blob>, fileId: string) {
    const blob = response.body;
    let fileName = this.getHeaderTokenValue(response.headers, 'filename', 'Content-Disposition');

    if (fileName === null) {
      // default to fileId so we have something to use
      fileName = fileId;
    }

    const action = this.saveBlobAsFile(blob, fileName) ? new FileDownloadSuccess({
        fileId,
        fileName,
        progress: 100,
      }) : new FileDownloadError({
        error: true,
        errorText: `Unable to save file "${fileName}" to disk`,
        fileId,
        progress: 100,
      });

    return action;
  }

  private processDownloadProgressEvent(event: HttpProgressEvent, fileId: string) {
    const percentComplete = Math.floor(100 * event.loaded / event.total);
    return new FileDownloadProgress({
      fileId,
      progress: percentComplete,
    });
  }
}
