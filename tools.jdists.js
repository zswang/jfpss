void function() {
  var bar = document.getElementById('jfpss-bar');
  if (bar) {
    return;
  }

  /*<include file="components/jframes/jframes.js" />*/
  ;
  /*<include file="components/jhtmls/jhtmls.js" />*/
  ;
  /*<include file="src/jfpss.js" />*/

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

  createStyle(/*<include file="src/tools.html" block="css" encoding="string" />*/);

  var div = document.createElement('div');
  div.innerHTML = /*<include file="src/tools.html" block="html" encoding="string" />*/;
  document.body.appendChild(div);

  /*<include file="src/tools.html" block="js" />*/
}();