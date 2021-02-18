export class ControlDataConfig {
  static richTextQuillConfig = {
    toolbar: {
      container: [
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline'],
        [{ 'align': [] }],
        [{ 'color': [] }, { 'background': [] }],
        ['clean']
      ]
    }
  };

  static smartListQuillConfig = {
    toolbar: {
      container: [
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'bullet' }, { 'list': 'ordered'}],
        [{ 'color': [] }, { 'background': [] }],
        ['clean']
      ]
    }
  };
}
