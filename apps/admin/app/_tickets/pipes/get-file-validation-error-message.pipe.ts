import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'getFileValidationErrorMessage'
})
export class GetFileValidationErrorMessagePipe implements PipeTransform {
    transform(value: string): string {
      switch (value) {
        case 'invalidFileExtension':
          return 'File is not a valid extension.';
        case 'invalidMaxFileSize':
          return 'File cannot exceed 600Mb.';
        default:
          return 'File upload failed. Please try again.';
      }
    }
  }
