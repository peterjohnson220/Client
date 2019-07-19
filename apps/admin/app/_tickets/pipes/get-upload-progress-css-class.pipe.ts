
import { Pipe, PipeTransform } from '@angular/core';
import { FileState } from '@progress/kendo-angular-upload';


@Pipe({
  name: 'getUploadProgressCssClass'
})
export class GetUploadProgressCssClassPipe implements PipeTransform {
  transform(value: FileState): string {
    switch (value) {
      case FileState.Failed:
        return 'upload-error';
      case FileState.Uploaded:
        return 'upload-complete';
      default:
        return '';
    }
  }
}
