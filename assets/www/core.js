function initCore() {
    parseQueryString();
    loadColors();
    $('.translate').map(function() {
        $(this).text(t($(this).text()));
    });
}
function parseQueryString() {
    var qs = window.location.search.substring(1);
    var parts = qs.split("&");
    window.prsi_color_scheme = parts[0];
    window.prsi_language = parts[1];
}
function loadColors() {
    var link = $('<link>');
    link.attr({
        type: 'text/css',
        rel: 'stylesheet',
        href: 'colors_' + window.prsi_color_scheme + '.css'
    });
    $('head').append(link);
}
function t(txt) {
  var text = texts[txt];
  if (!text) alert(txt);
  var formatted = text[window.prsi_language];
  for(arg in arguments) {
    if (arg > 0) formatted = formatted.replace("{" + arg + "}", arguments[arg]);
  }
  return formatted;        
}
function buttonIntent(button_id, intent_url) {
    $('div#' + button_id).click(function() {
        window.plugins.webintent.startActivity(
          {
             action: WebIntent.ACTION_VIEW,
             url: intent_url
          }, 
          function() {},
          function() { alert('Failed to navigate to intent'); }
        )
    });
}
function loadText(file_name, div_ID) {
  var filename = file_name + '_' + window.prsi_language + '.txt';
  $.get(filename.toLowerCase(), function(data) {
      var lines = data.split('\r\n');
      var txt = '';
      var div = '';
      var title = false;
      for (ix in lines) {
        var line = lines[ix];
        if (/^=\s/.test(line)) { 
            title = true;
            div += line.replace(/^=\s+(.*)/, '$1');
            continue;
        }
        if (!/^$/.test(line)) {
          if (/^\[.*\]$/.test(line)) {
              line = line.replace(/^\[(.*)\|(.*)\]$/, 
                        '<div class="button" id="button_' + ix +'">$1</div>' + 
                        '<script>buttonIntent("button_' + ix + '", "$2");</script>');
          }
          if (div != '') div += '<br/>';
          div += line;
          continue;
        }
        if (div != '') {
          txt = txt
              + '<div class="'
              + (title ? 'about_title' : 'about_ref')
              + '">' + div + '</div>';
        }
        title = false;
        div = '';
      };
      if (div != '') {
        txt = txt
            + '<div class="'
            + (title ? 'about_title' : 'about_ref')
            + '">' + div + '</div>';
      }
      $('div#' + div_ID).html(txt);
  }, 'text');
}

