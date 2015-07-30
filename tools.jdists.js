void
function() {
  var bar = document.getElementById('jfpss-bar');
  if (bar) {
    return;
  }
  var jframes;
  if (window.jframes) { // 优先使用全局 jframes
    jframes = window.jframes;
  } else {
    jframes = {};
    var define = function(creator) {
      jframes = creator(jframes);
    };
    define.amd = true;
    /*<jdists import="components/jframes/jframes.js" />*/
  }

  var jhtmls = {};
  define = function(creator) {
    jhtmls = creator(jhtmls);
  };
  define.amd = true;
  /*<jdists import="components/jhtmls/jhtmls.js" />*/

  var jfpss = {};
  define = function(creator) {
    jfpss = creator(jfpss);
  };
  define.amd = true;
  /*<jdists import="src/jfpss.js" />*/

  function createStyle(css) {
    var style;
    if (document.createStyleSheet) {
      style = document.createStyleSheet();
    }
    else {
      style = document.createElement('style');
      document.getElementsByTagName('head')[0].appendChild(style);
    }
    if (css) {
      updateStyle(style, css);
    }
    return style;
  }

  function updateStyle(style, css) {
    if (!style) return;
    if (document.createStyleSheet) {
      style.cssText = css;
    }
    else {
      var textNode = style.firstChild;
      if (!textNode) {
        textNode = document.createTextNode(css);
        style.appendChild(textNode);
      }
      else {
        textNode.nodeValue = css;
      }
    }
  }

  createStyle( /*<jdists import="src/tools.html?css" encoding="quoted" />*/ );

  var div = document.createElement('div');
  div.innerHTML = /*<jdists import="src/tools.html?html" encoding="quoted" />*/ ;
  document.body.appendChild(div);

  /*<jdists file="src/tools.html?js" />*/
}();