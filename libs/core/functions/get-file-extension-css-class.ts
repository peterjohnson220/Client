export function getFileExtensionCssClass(extension: string): string {
    switch (extension) {
        case 'xlsx':
        case 'xls':
        case 'xlsb':
        case 'xlsm':
        case 'xltx':
        case 'xltm':
        case 'xla':
            return 'fa-file-excel';
        case 'docx':
        case 'docm':
        case 'dotx':
        case 'dotm':
        case 'docb':
        case 'doc':
            return 'fa-file-word';
        case 'ppt':
        case 'pptx':
            return 'fa-file-word';
        case 'pdf':
            return 'fa-file-pdf';
        case 'jpg':
        case 'jpeg':
        case 'png':
            return 'fa-file-image';
        case 'zip':
        case 'zipx':
        case '7z':
            return 'fa-file-archive';
        case 'msg':
            return 'fa-envelope';
        case 'csv':
        case 'txt':
        case 'xml':
        case 'exe':
        case 'mht':
        case 'mdb':
        case 'partial':
        default:
            return 'fa-file-alt';
    }
}
