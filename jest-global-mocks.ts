// Add missing URL methods
// https://developer.mozilla.org/en-US/docs/Web/API/URL
// TODO: Remove when https://github.com/jsdom/jsdom/issues/1721 is fixed
URL.revokeObjectURL = jest.fn();
URL.createObjectURL = jest.fn();
(<any> global).URL = URL;

// polyfill requestAnimationFrame support
(<any> global).requestAnimationFrame = callback => setTimeout(callback, 0);

Object.defineProperty(window, 'CSS', {value: null});
Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});
Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display: 'none',
      appearance: ['-webkit-appearance']
    };
  }
});
/**
 * ISSUE: https://github.com/angular/material2/issues/7101
 * Workaround for JSDOM missing transform property
 */
Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});
