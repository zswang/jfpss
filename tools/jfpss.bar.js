void function() {
  var bar = document.getElementById('jfpss-bar');
  if (bar) {
    return;
  }

  
  ;
  
  ;
  

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

  createStyle("");

  var div = document.createElement('div');
  div.innerHTML = "";
  document.body.appendChild(div);

  
}();