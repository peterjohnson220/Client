function InitializeUserVoice () {
  // Include the UserVoice JavaScript SDK (only needed once on a page) 
    UserVoice=window.UserVoice||[];  
  
    var uv=document.createElement('script');
    uv.type='text/javascript';
    uv.async=true;
    uv.src='//widget.uservoice.com/kZejuLhIRXascIvkE3XHQ.js';
    var s=document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(uv,s);
  
  //
  // UserVoice Javascript SDK developer documentation:
  // https://www.uservoice.com/o/javascript-sdk
  //
  
  
  // Set colors
  UserVoice.push(['set', {
    contact_enabled: false,  
    smartvote_enabled: false,
    post_idea_enabled: true,
    accent_color: '#007884',
    trigger_color: 'white',
    trigger_background_color: 'rgba(46, 49, 51, 0.6)',
    strings: {
      post_suggestion_title: 'Provide your own feedback',  
      post_suggestion_menu_label: 'Provide your own feedback',
      post_suggestion_success_body: 'Your feedback has been posted to our feedback forum.'
    }
  }]);
  
  // Add default trigger to the bottom-right corner of the window:
  UserVoice.push(['addTrigger', { mode: 'post_idea', trigger_position: 'bottom-left' }]);
  
  // Or, use your own custom trigger:
  //UserVoice.push(['addTrigger', '#id', { mode: 'smartvote' }]);
  
  // Autoprompt for Satisfaction and SmartVote (only displayed under certain conditions)
  UserVoice.push(['autoprompt', {}]);
  }
  