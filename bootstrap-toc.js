// inspiration:
// * https://jsfiddle.net/gableroux/S2SMK/
// * http://gregfranko.com/jquery.tocify.js/
$(function() {
  var $toc = $('#toc');

  // essentially a media query for Bootstrap's col-sm-* breakpoint – make the table of contents "sticky" on wider screen sizes
  if ($(window).width() >= 768) {
    $toc.addClass('sticky');
  }

  var generateUniqueIdBase = function(el) {
    var text = $(el).text();
    var anchor = text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    return anchor || el.tagName.toLowerCase();
  };

  var generateUniqueId = function(el) {
    var anchorBase = generateUniqueIdBase(el);
    for (var i = 0; ; i++) {
      var anchor = anchorBase;
      if (i > 0) {
        // add suffix
        anchor += '-' + i;
      }
      // check if ID already exists
      if (!document.getElementById(anchor)) {
        return anchor;
      }
    }
  };

  var generateAnchor = function(el) {
    if (el.id) {
      return el.id;
    } else {
      var anchor = generateUniqueId(el);
      el.id = anchor;
      return anchor;
    }
  };

  var getContext = function($startingContext, navLevel) {
    var $context = $startingContext;

    // `i` is just a safety valve, so we don't accidentally get an endless loop
    var i = 0;
    // this is the maximum number of times it can walk up or down the tree
    while (i < 10) {
      var prevNav = $context.children('li:last')[0];
      if (prevNav) {
        var $prevNav = $(prevNav);
        var prevNavLevel = $prevNav.data('nav-level');
        if (navLevel > prevNavLevel) {
          // create a new level of the tree
          var $childList = $('<ul></ul>');
          $prevNav.append($childList);
          $context = $childList;
        } else if (navLevel < prevNavLevel) {
          // walk up the tree
          var $parentContext = $context.parent('li').parent('ul');
          if ($parentContext.length) {
            $context = $parentContext;
          } else {
            // we've reached the top-level element
            break;
          }
        } else {
          // matching level
          break;
        }
      } else {
        // no previous element
        break;
      }

      i++;
    }

    return $context;
  };

  var init = function() {
    var $context = $('<ul></ul>');
    $toc.append($context);

    $('h1,h2,h3,h4').each(function(i, el) {
      var anchor = generateAnchor(el);
      var text = $(el).text();
      var $newNav = $('<li><a href="#' + anchor + '">' + text + '</a></li>');
      var navLevel = parseInt(el.tagName.charAt(1), 10);
      $newNav.data('nav-level', navLevel);

      $context = getContext($context, navLevel);
      $context.append($newNav);
    });
  };


  init();
  $('.sticky').Stickyfill();
});
