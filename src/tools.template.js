void function() {
  var bar = document.getElementById('jfpss-bar');
  if (bar) {
    return;
  }

  /*<include lib/jframes/src/jframes.js>*/
  ;
  /*<include lib/jhtmls/src/jhtmls.js>*/
  ;
  /*<include src/jfpss.js>*/

  var createStyle = function (css) {
    var style;
    if (document.createStyleSheet) {
      style = document.createStyleSheet();
    } else {
      style = document.createElement('style');
      document.getElementsByTagName('head')[0].appendChild(style);
    }
    if (css) {
      updateStyle(style, css);
    }
    return style;
  }

  var updateStyle = function (style, css) {
    if (!style) return;
    if (document.createStyleSheet) {
      style.cssText = css;
    } else {
      var textNode = style.firstChild;
      if (!textNode) {
        textNode = document.createTextNode(css);
        style.appendChild(textNode);
      } else {
        textNode.nodeValue = css;
      }
    }
  }

  createStyle(function() {/*!<!--include src/tools.html style-->*/});

  var div = document.createElement('div');
  div.innerHTML = function() {/*!<!--include src/tools.html html-->*/};
  document.body.appendChild(div);

  /*<include src/tools.html js>*/
}();