export function appendOrdinalSuffix(num: number): string {
    const lastDigit = num % 10;
    const lastTwoDigits = num % 100;
    if (lastDigit === 1 && lastTwoDigits !== 11) {
        return num + 'st';
    }
    if (lastDigit === 2 && lastTwoDigits !== 12) {
        return num + 'nd';
    }
    if (lastDigit === 3 && lastTwoDigits !== 13) {
        return num + 'rd';
    }
    return num + 'th';
}
