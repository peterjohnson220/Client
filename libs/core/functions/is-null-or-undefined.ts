export function isNullOrUndefined(x: any): boolean {
    if (x == null) {
        return true;
    }

    if (x === null) {
        return true;
    }

    if (typeof x === 'undefined') {
        return true;
    }
}
