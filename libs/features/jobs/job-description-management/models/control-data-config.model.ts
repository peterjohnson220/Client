export class ControlDataConfig {
  static richTextQuillConfig = {
    toolbar: {
      container: [
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'link'],
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
        ['bold', 'italic', 'underline', 'link'],
        [{ 'list': 'bullet' }, { 'list': 'ordered'}],
        [{ 'color': [] }, { 'background': [] }],
        ['clean']
      ]
    }
  };
}
