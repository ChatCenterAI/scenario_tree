
riot.route('/test/*', function(tagName) {
  riot.mount('modal-content', 'page-test', {content: 'content'});
  riot.update();
})

riot.route('/about', function(tagName) {

  if(riot.enableFadeIn) $('content').removeClass('not-opacity');

  riot.enableFadeIn = true;

  $(document).trigger("custom:close");

  setTimeout(function() {
    $('content').addClass('not-opacity');
    riot.mount('content', 'page-about', {content: 'content'});
    riot.update();
  }, 400);
})

riot.route(function(tagName) {
  
  if(riot.enableFadeIn) $('content').removeClass('not-opacity');

  riot.enableFadeIn = true;

  $(document).trigger("custom:close");

  setTimeout(function() {
    $('content').addClass('not-opacity');
    riot.mount('content', 'page-top', {content: 'content'});
    riot.update();
  }, 400);
});

riot.route.start(true);

var tags = riot.mount('app');