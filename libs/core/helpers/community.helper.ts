export function escapeSpecialHtmlCharacters(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;').
        replace(/</g, '&lt;').
        replace(/>/g, '&gt;');
 }
