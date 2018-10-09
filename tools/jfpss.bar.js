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
    components/jframes/jframes.js
  }
  var jhtmls = {};
  define = function(creator) {
    jhtmls = creator(jhtmls);
  };
  define.amd = true;
  components/jhtmls/jhtmls.js
  var jfpss = {};
  define = function(creator) {
    jfpss = creator(jfpss);
  };
  define.amd = true;
  ;(function(exportName) {
  /**
   * @file jfpss
   *
   * FPS JS Library
   * @author
   *   zswang (http://weibo.com/zswang)
   * @version 0.0.8
   */
  if (typeof jframes === 'undefined') {
    throw new Error('jframes is not defined.')
  }
  var exports = exports || {}
  var running // 是否正在运行
  var starttime // 开始时间
  var recordtime // 记录时间
  var fps // 帧数
  var records // 帧率记录
  var configs // 配置信息
  var guid
  var config = function(options) {
    configs = configs || {
      lifespan: 3000,
      recordspan: 1000,
      maxRecords: 10,
      precision: 0,
    }
    options = options || {}
    for (var key in options) {
      configs[key] = options[key]
    }
  }
  /**
   * 启动帧率检测
   * @param {Object} options 配置项
   *  @field {number} lifespan 最多生命周期，当小于 0 时，则不会自动结束，单位 ms，默认 3000
   *  @field {number} recordspan 每次记录的间隔，当小于 0 时，不记录，单位 ms，默认 1000
   *  @field {number} maxRecords 最大记录数
   *  @field {number} precision 保留小数位数
   */
  var startup = function(options) {
    if (running) {
      return
    }
    config(options)
    var now = new Date()
    starttime = now
    recordtime = now
    fps = 0
    guid = 0
    records = []
    running = jframes.request(function(frame) {
      if (!running) {
        return
      }
      var now = new Date()
      fps++
      if (now - recordtime >= configs.recordspan) {
        records.unshift({
          index: guid++,
          fps: (fps * (1000 / (now - recordtime))).toFixed(configs.precision),
        })
        recordtime = now
        while (records.length > configs.maxRecords) {
          records.pop()
        }
        if (configs.onrecord) {
          configs.onrecord({
            records: records.slice(),
            median: median,
          })
        }
        fps = 0
      }
      if (configs.lifespan < 0 || now - starttime <= configs.lifespan) {
        frame.next()
      } else {
        shutdown()
      }
    })
  }
  /**
   * 计算中位数
   */
  var median = function() {
    if (!records) {
      return
    }
    var temp = records.slice()
    temp.sort(function(a, b) {
      return a.fps - b.fps
    })
    temp = temp[parseInt(temp.length / 2)]
    if (temp) {
      return temp.fps
    }
  }
  /**
   * 终止帧率检测
   */
  var shutdown = function() {
    if (!running) {
      return
    }
    jframes.release(running)
    if (configs.onshutdown) {
      configs.onshutdown({
        records: records.slice(),
        median: median,
      })
    }
    running = null
    configs = null
    records = null
  }
  exports.config = config
  exports.startup = startup
  exports.shutdown = shutdown
  if (typeof define === 'function') {
    if (define.amd || define.cmd) {
      define(function() {
        return exports
      })
    }
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports
  } else {
    window[exportName] = exports
  }
})('jfpss')
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
  createStyle( "#jfpss-bar {\n  position: fixed;\n  left: 10px;\n  top: 10px;\n  z-index: 100000;\n  font-family: monospace;\n  width: 120px;\n  height: 40px;\n  background: rgb(25, 82, 28);\n}\n#jfpss-bar svg {\n  position: absolute;\n  left: 0;\n  bottom: 0;\n}\n#jfpss-bar svg #history-diagram {\n  stroke: lightgreen;\n  fill: green;\n  shape-rendering: crispEdges;\n}\n#jfpss-bar .fps,\n#jfpss-bar .frame {\n  padding: 3px;\n  position: absolute;\n}\n#jfpss-bar .fps {\n  right: 0;\n  top: 0;\n  font-size: 14px;\n  color: yellow;\n}\n#jfpss-bar .frame {\n  left: 0;\n  top: 0;\n  font-size: 12px;\n  color: lightgreen;\n}" );
  var div = document.createElement('div');
  div.innerHTML = "  <div id=\"jfpss-bar\">\n    <svg width=\"120\" height=\"20\" viewBox=\"0 0 120 20\" preserveAspectRatio=\"none\">\n      <path id=\"history-diagram\"></path>\n    </svg>\n    <div class=\"fps\">59.5</div>\n    <div class=\"frame\">12</div>\n  </div>" ;
  document.body.appendChild(div);
}();