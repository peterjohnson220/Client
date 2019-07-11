import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'getFileExtensionCssClass' })
export class GetFileExtensionCssClassPipe implements PipeTransform {
    transform(value: string): string {
        switch (value) {
            case 'xlsx':
            case 'xls':
            case 'xlsb':
            case 'xlsm':
            case 'xltx':
            case 'xltm':
            case 'xla':
                return 'file-excel';
            case 'docx':
            case 'docm':
            case 'dotx':
            case 'dotm':
            case 'docb':
            case 'doc':
              return 'file-word';
            case 'ppt':
            case 'pptx':
              return 'file-word';
            case 'pdf':
              return 'file-pdf';
            case 'jpg':
            case 'jpeg':
            case 'png':
              return 'file-image';
            case 'zip':
            case 'zipx':
            case '7z':
              return 'file-archive';
            case 'msg':
              return 'envelope';
            case 'csv':
            case 'txt':
            case 'xml':
            case 'exe':
            case 'mht':
            case 'mdb':
            case 'partial':
            default:
              return 'file-alt';
        }
    }
}
