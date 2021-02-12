// https://stackoverflow.com/questions/20428877/javascript-remove-doesnt-work-in-ie

// Create Element.remove() function if not exist
if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function () {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}