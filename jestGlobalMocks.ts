// Add missing URL methods
// https://developer.mozilla.org/en-US/docs/Web/API/URL
// TODO: Remove when https://github.com/jsdom/jsdom/issues/1721 is fixed
URL.revokeObjectURL = jest.fn();
URL.createObjectURL = jest.fn();
(<any> global).URL = URL;

// polyfill requestAnimationFrame support
(<any> global).requestAnimationFrame = callback => setTimeout(callback, 0);
