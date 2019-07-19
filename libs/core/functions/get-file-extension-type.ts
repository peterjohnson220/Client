export function getFileExtensionType(file: string): string {
    const re = /(?:\.([^.]+))?$/;
    return re.exec(file)[1];
}
