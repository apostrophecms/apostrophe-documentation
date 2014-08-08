$('body').on('click', '[data-search-button]').click(function() {
  $('[data-search]').toggle();
  return false;
});

// document.addEventListener('DOMContentLoaded', function() {
//   var h1 = document.querySelectorAll('h1');
//   if(h1[0].innerText.length > 30) {
//     h1[0].classList.add('long');
//   }
// });

// Not yet
// $(function() {
//   // Turn internal headings into an additional sidebar section
//   // Grab the ones that markdown gave IDs
//   var $headings = $('h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]');
//   var $sidebar = $('.sidebar');
//   var links = [];
//   $headings.each(function() {
//     var $heading = $(this);
//     var text = $heading.text();
//     var name = $heading.attr('id');
//     links.push({ text: text, name: name });
//   });
//   if (links.length) {
//     var $ul = $('<ul class="internal-links"></ul>');
//     $.each(links, function(i, link) {
//       var $li = $('<li></li>');
//       var $link = $('<a></a>');
//       $link.attr('href', '#' + link.name);
//       $link.attr('data-name', link.name);
//       $link.text(link.text);
//       $li.append($link);
//       $ul.append($li);
//     });
//     $sidebar.append($ul);
//   }
//   // marked doesn't produce real named anchors by default,
//   // so implement our own pretty scroll
//   $('.sidebar a[data-name]').on('click', function() {
//     var name = $(this).attr('data-name');
//     $('html, body').animate({
//       scrollTop: $("#" + name).offset().top - 50
//     }, 500);
//     return false;
//   });
// });
