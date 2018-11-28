
riot.route('/projects/*', function(tagName) {
  if(riot.enableFadeIn) $('content').removeClass('not-opacity');

  riot.enableFadeIn = true;

  $(document).trigger("custom:close");

  var projectId = tagName;
  setTimeout(function() {
    $('content').addClass('not-opacity');
    riot.mount('header', 'util-header', {status: 'canvas'});
    riot.mount('content', 'page-canvas', {id: projectId});
    riot.update();
  }, 400);
})


riot.route('/top', function(tagName) {

  if(riot.enableFadeIn) $('content').removeClass('not-opacity');

  riot.enableFadeIn = true;

  $(document).trigger("custom:close");

  setTimeout(function() {
    $('content').addClass('not-opacity');
    riot.mount('header', 'util-header');
    riot.mount('content', 'page-top', {content: 'content'});
    riot.update();
  }, 400);
})


riot.route('/login', function(tagName) {

  $('header').hide();
  $('.wrap-content').addClass('full-height');

  if(riot.enableFadeIn) $('content').removeClass('not-opacity');

  riot.enableFadeIn = true;

  $(document).trigger("custom:close");

  setTimeout(function() {
    $('content').addClass('not-opacity');
    riot.mount('header', 'util-header');
    riot.mount('content', 'page-login', {content: 'content'});
    riot.update();
  }, 400);
})

riot.route(function(tagName) {
  
  if(riot.enableFadeIn) $('content').removeClass('not-opacity');

  riot.enableFadeIn = true;

  $(document).trigger("custom:close");

  setTimeout(function() {
    $('content').addClass('not-opacity');
    riot.mount('header', 'util-header');
    riot.mount('content', 'page-top', {content: 'content'});
    riot.update();
  }, 400);
});

riot.route.start(true);

var tags = riot.mount('app');
