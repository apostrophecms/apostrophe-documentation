$( function() {
  $('body').on('focus', 'input.gsc-input', function(e) {
    // $(this).toggleClass('active');
    $('[data-search]').show();
  });
});

// document.addEventListener('DOMContentLoaded', function() {
//   var h1 = document.querySelectorAll('h1');
//   if(h1[0].innerText.length > 30) {
//     h1[0].classList.add('long');
//   }
// });

$(function() {
  // Turn internal headings into an additional sidebar section
  // Grab the ones that markdown gave anchors
  var $headings = $('h2:has(a[name]),h3:has(a[name])');
  var $sidebar = $('.sidebar');
  var links = [];
  var seen = {};
  $headings.each(function() {
    var $heading = $(this);
    var text = $heading.text();
    // Don't show the parens of a function or link
    // to all the syntaxes, just the name is enough
    text = text.replace(/\(.*$/, '');
    if (seen[text]) {
      return;
    }
    seen[text] = true;
    var name = $heading.find('a').attr('name');
    var level = $heading.prop('tagName');
    level = level.replace(/h/i, '');
    links.push({ text: text, name: name, level: level });
  });
  if (links.length) {
    var $ul = $('<ul class="internal-links"></ul>');
    $.each(links, function(i, link) {
      var $li = $('<li></li>');
      $li.addClass('h' + link.level);
      var $link = $('<a></a>');
      $link.attr('href', '#' + link.name);
      $link.attr('data-name', link.name);
      $link.text(link.text);
      $li.append($link);
      $ul.append($li);
    });
    $sidebar.append($ul);
  }
});
