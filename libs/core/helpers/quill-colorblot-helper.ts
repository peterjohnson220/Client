import * as quill from 'quill';
const Quill = quill.default || quill;
const Inline = Quill.import('blots/inline');

// this blot is a work around for a bug with Quill.
// Colored text in the editor would get deleted when spellchecked.
// The browser's spellcheck returns colored text using a 'font' tag and quill uses 'span'
// https://github.com/quilljs/quill/issues/2096
export class CustomColor extends Inline {
  constructor(domNode, value) {
    super(domNode, value);

    domNode.style.color = domNode.color;

    const span = this.replaceWith(new Inline(Inline.create()));

    span.children.forEach(child => {
      if (child.attributes) { child.attributes.copy(span); }
      if (child.unwrap) { child.unwrap(); }
    });

    this.remove();

    return span;
  }
}


