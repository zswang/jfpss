void function() {
  var bar = document.getElementById('jfpss-bar');
  if (bar) {
    return;
  }
  void function(exportName) {
  'use strict';
  var exports = exports || {};
  // 原生动画帧方法 polyfill
  var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(fn) {
      return setTimeout(fn, 1000 / 60);
    };
  var cancelAnimationFrame =
    window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    window.clearTimeout;
  // 上一个请求的原生动画帧 id
  var frameRequestId;
  // 等待执行的帧动作的集合，这些帧的方法将在下个原生动画帧同步执行
  var pendingFrames = [];
  /**
   * 添加一个帧到等待集合中
   *
   * 如果添加的帧是序列的第一个，至少有一个帧需要被执行，则会请求一个原生动画帧来执行
   */
  function pushFrame(frame) {
    if (pendingFrames.push(frame) === 1) {
      frameRequestId = requestAnimationFrame(executePendingFrames);
    }
  }
  /**
   * 执行所有等待帧
   */
  function executePendingFrames() {
    var frames = pendingFrames;
    pendingFrames = [];
    while (frames.length) {
      executeFrame(frames.pop());
    }
    frameRequestId = 0;
  }
  /**
   * @method request
   * @catalog animate
   * @grammar request(action) => {frame}
   * @description 请求一个帧，执行指定的动作。动作回调提供一些有用的信息
   *
   * @param {Function} action
   *
   *     要执行的动作，该动作回调有一个参数 frame，其中：
   *
   *     frame.time {Number}
   *         动作执行时的时间戳（ms）
   *
   *     frame.index {Number}
   *         当前执行的帧的编号（首帧为 0）
   *
   *     frame.dur {Number}
   *         上一帧至当前帧经过的时间，单位 ms
   *
   *     frame.elapsed {Number}
   *         从首帧开始到当前帧经过的时间，单位 ms
   *
   *     frame.action {Number}
   *         指向当前的帧处理函数
   *
   *     frame.next()
   *         表示下一帧继续执行。如果不调用该方法，将不会执行下一帧。
   *
   * @example
   *
   * ```js
   * request(function(frame) {
   *     console.log('平均帧率:' + frame.elapsed / (frame.index + 1));
   *
   *     // 更新或渲染动作
   *
   *     frame.next(); //继续执行下一帧
   * });
   * ```
   */
  function request(action) {
    var frame = initFrame(action);
    pushFrame(frame);
    return frame;
  }
  /**
   * @method release
   * @catalog animate
   * @grammar release(frame)
   * @description 释放一个已经请求过的帧，如果该帧在等待集合里，将移除，下个动画帧不会执行释放的帧
   *
   * @param {frame} frame 使用 request() 返回的帧
   *
   * @example
   *
   * ```js
   * var frame = request(function() {....});
   * release(frame);
   * ```
   */
  function release(frame) {
    var index = pendingFrames.indexOf(frame);
    if (~index) {
      pendingFrames.splice(index, 1);
    }
    if (pendingFrames.length === 0) {
      cancelAnimationFrame(frameRequestId);
    }
  }
  /**
   * 初始化一个帧，主要用于后续计算
   */
  function initFrame(action) {
    var frame = {
      index: 0,
      time: +new Date(),
      elapsed: 0,
      action: action,
      next: function() {
        pushFrame(frame);
      }
    };
    return frame;
  }
  /**
   * 执行一个帧动作
   */
  function executeFrame(frame) {
    // 当前帧时间错
    var time = +new Date();
    // 当上一帧到当前帧经过的时间
    var dur = time - frame.time;
    //
    // http://stackoverflow.com/questions/13133434/requestanimationframe-detect-stop
    // 浏览器最小化或切换标签，requestAnimationFrame 不会执行。
    // 检测时间超过 200 ms（频率小于 5Hz ） 判定为计时器暂停，重置为一帧长度
    //
    if (dur > 200) {
      dur = 1000 / 60;
    }
    frame.dur = dur;
    frame.elapsed += dur;
    frame.time = time;
    frame.action.call(null, frame);
    frame.index++;
  }
  // 暴露
  exports.request = request;
  exports.release = release;
  if (typeof define === 'function') {
    if (define.amd || define.cmd) {
      define(function() {
        return exports;
      });
    }
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  } else {
    window[exportName] = exports;
  }
}('jframes');
  ;
  void function(exportName) {
  'use strict';
  var exports = exports || {};
  /**
   * jhtmls
   * 一套基于HTML和JS语法自由穿插的模板系统
   * @author 王集鹄(wangjihu,http://weibo.com/zswang) 鲁亚然(luyaran,http://weibo.com/zinkey)
   * @version 2014-05-21
   */
  var htmlEncodeDict = {
    '"': 'quot',
    '<': 'lt',
    '>': 'gt',
    '&': 'amp',
    ' ': 'nbsp'
  };
  /**
   * HTML编码
   * @param {String} text 文本
   */
  function encodeHTML(text) {
    return String(text).replace(/["<>& ]/g, function(all) {
      return '&' + htmlEncodeDict[all] + ';';
    });
  }
  /**
   * 构造模板的处理函数
   * 不是 JS 行的正则判断
   *   非 JS 字符开头
   *     示例：#、<div>、汉字
   *     正则：/^[ \w\t_$]*([^&\^?|\n\w\/'"{}\[\]+\-():; \t=\.$_]|:\/\/).*$/mg
   *   不是 else 等单行语句
   *     示例：hello world
   *     正则：/^(?!\s*(else|do|try|finally|void|typeof\s[\w$_]*)\s*$)[^'":;{}()\n|=&\/^?]+$/mg
   * @param {String} template 模板字符
   * @return {Function} 返回编译后的函数
   */
  function build(template) {
    var body = [];
    body.push('with(this){');
    body.push(template
      .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, function(all) { // 处理<script>和<style>原样输出
        return ['!#{unescape("', escape(all), '")}'].join('');
      })
      .replace(/[\r\n]+/g, '\n') // 去掉多余的换行，并且去掉IE中困扰人的\r
      .replace(/^\n+|\s+$/mg, '') // 去掉空行，首部空行，尾部空白
      .replace(
        /^([ \w\t_$]*([^&\^?|\n\w\/'"{}\[\]+\-():; \t=\.$_]|:\/\/).*$|^(?!\s*(else|do|try|finally|void|typeof\s[\w$_]*)\s*$)[^'":;{}()\n|=&\/^?]+$)\s?/mg,
        function(expression) { // 输出原文
          // 处理空白字符
          expression = expression
            .replace(/&none;/g, '') // 空字符
          .replace(/["'\\]/g, '\\$&') // 处理转义符
          .replace(/\n/g, '\\n') // 处理回车转义符
          .replace( // #{expression} | $name
            /(!?#)\{(.*?)\}|(!?\$)([a-z_]+\w*(?:\.[a-z_]+\w*)*)/g,
            function(all, flag, value, flag2, value2) { // 变量替换
              if (flag2) { // 匹配 $name
                flag = flag2;
                value = value2;
              }
              if (!value) {
                return '';
              }
              value = value.replace(/\\n/g, '\n').replace(/\\([\\'"])/g, '$1'); // 还原转义
              var identifier = /^[a-z$][\w+$]+$/i.test(value) &&
                !(/^(true|false|NaN|null|this)$/.test(value)); // 单纯变量，加一个未定义保护
              return ["',",
                identifier ? ['typeof ', value, "==='undefined'?'':"].join('') : '', (flag === '#' || flag === '$' ? '_encode_' : ''),
                '(', value, "),'"
              ].join('');
            }
          );
          // 处理输出
          expression = ["'", expression, "'"].join('').replace(/^'',|,''$/g, ''); // 去掉多余的代码
          if (expression) {
            return ['_output_.push(', expression, ');'].join('');
          }
          return '';
        }
      )
    );
    body.push('}');
    return new Function(
      '_output_', '_encode_', 'helper', 'jhtmls',
      body.join('')
    );
  }
  /**
   * 格式化输出
   * @param {String|Function} template 模板本身 或 模板放在函数行注释中
   * @param {Object} data 格式化的数据，默认为空字符串
   * @param {Object} helper 附加数据(默认为渲染函数)
   * @return {Function|String} 如果只有一个参数则返回渲染函数，否则返回格式化后的字符串
   */
  function render(template, data, helper) {
    if (typeof template === 'function') { // 函数多行注释处理
      template = String(template).replace(
        /^[^\{]*\{\s*\/\*!?[ \f\t\v]*\n?|[ \f\t\v]*\*\/[;|\s]*\}$/g, // 替换掉函数前后部分
        ''
      );
    }
    var fn = build(template);
    /**
     * 格式化
     * @param{Object} d 数据
     * @param{Object} h 辅助对象 helper
     */
    var format = function(d, h) {
      // h = h || fn;
      var output = [];
      if (typeof h === 'undefined') {
        h = function(d) {
          fn.call(d, output, encodeHTML, h, exports);
        };
      }
      fn.call(d, output, encodeHTML, h, exports);
      return output.join('');
    };
    if (arguments.length <= 1) { // 无渲染数据
      return format;
    }
    return format(data, helper);
  }
  exports.render = render;
  if (typeof define === 'function') {
    if (define.amd || define.cmd) {
      define(function() {
        return exports;
      });
    }
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  } else {
    window[exportName] = exports;
  }
}('jhtmls');
  ;
  var jfpss = jfpss || {};
void function (exports) {
  if (typeof jframes === 'undefined') {
    console.log('jframes is not defined.');
    return;
  }
  var running; // 是否正在运行
  var starttime; // 开始时间
  var recordtime; // 记录时间
  var fps; // 帧数
  var records; // 帧率记录
  var configs; // 配置信息
  var guid;
  var config = function (options) {
    configs = configs || {
      lifespan: 3000,
      recordspan: 1000,
      maxRecords: 10,
      precision: 0
    };
    options = options || {};
    for (var key in options) {
      configs[key] = options[key];
    }
  };
  /**
   * 启动帧率检测
   * @param {Object} options 配置项
   *  @field {number} lifespan 最多生命周期，当小于 0 时，则不会自动结束，单位 ms，默认 3000
   *  @field {number} recordspan 每次记录的间隔，当小于 0 时，不记录，单位 ms，默认 1000
   *  @field {number} maxRecords 最大记录数
   *  @field {number} precision 保留小数位数
   */
  var startup = function (options) {
    if (running) {
      return;
    }
    config(options);
    var now = new Date();
    starttime = now;
    recordtime = now;
    fps = 0;
    guid = 0;
    records = [];
    running = jframes.request(function (frame) {
      if (!running) {
        return;
      }
      var now = new Date();
      fps++;
      if (now - recordtime >= configs.recordspan) {
        records.unshift({
          index: guid++,
          fps: (fps * (1000 / (now - recordtime))).toFixed(configs.precision)
        });
        recordtime = now;
        while (records.length > configs.maxRecords) {
          records.pop();
        }
        if (configs.onrecord) {
          configs.onrecord({
            records: records.slice(),
            median: median()
          });
        }
        fps = 0;
      }
      if (configs.lifespan < 0 || now - starttime <= configs.lifespan) {
        frame.next();
      } else {
        shutdown();
      }
    });
  };
  /**
   * 计算中位数
   */
  var median = function () {
    if (!records) {
      return;
    }
    var temp = records.slice();
    temp.sort(function(a, b) {
      return a.fps - b.fps;
    });
    temp = temp[parseInt(temp.length / 2)];
    if (temp) {
      return temp.fps;
    }
  };
  /**
   * 终止帧率检测
   */
  var shutdown = function () {
    if (!running) {
      return;
    }
    jframes.release(running);
    if (configs.onshutdown) {
      configs.onshutdown({
        records: records.slice(),
        median: median()
      });
    }
    running = null;
    configs = null;
    records = null;
  };
  exports.config = config;
  exports.startup = startup;
  exports.shutdown = shutdown;
}(jfpss);
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
  createStyle("\n#jfpss-bar {\n  position: fixed;\n  left: 10px;\n  top: 10px;\n  z-index: 100000;\n  font-family: Consolas;\n}\n#jfpss-bar em {\n  color: green;\n}\n#jfpss-bar ul {\n  background: green;\n  padding: 0;\n  margin: 0;\n}\n#jfpss-bar li {\n  list-style-type: none;\n  width: 100px;\n  font-size: 12px;\n  height: 16px;\n  line-height: 16px;\n  padding: 0 5px;\n  color: rgb(180, 180, 0);\n  text-align: right;\n  background-image: linear-gradient(to bottom, rgba(50, 50, 80, 0.4), rgba(0, 0, 0, 0.7));\n  background-repeat: no-repeat;\n  background-position: 0 0;\n}\n#jfpss-bar li:first-child {\n  height: 24px;\n  line-height: 26px;\n  font-size: 18px;\n  color: yellow;\n}\n");
  var div = document.createElement('div');
  div.innerHTML = "\n  <div id=\"jfpss-bar\"></div>\n  ";
  document.body.appendChild(div);
  var bar = document.getElementById('jfpss-bar');
  var render = jhtmls.render("\n<ul>\nforEach(function(item) {\n  <li style=\"background-position: #{70 - parseInt(70 * (Math.min(60, item.fps) / 60))}px 0;\"><em>#{item.index}</em> #{item.fps < 10 ? '0' : ''}#{item.fps}</li>\n});\n</ul>\n  ");
  var scripts = document.getElementsByTagName('script');
  var currScript = scripts[scripts.length - 1];
  var maxRecords = currScript.getAttribute('data-max-records') || 5;
  var precision = currScript.getAttribute('data-precision') || 1;
  var recordspan = currScript.getAttribute('data-recordspan') || 500;
  var lifespan = currScript.getAttribute('data-lifespan') || -1;
  jfpss.startup({
    lifespan: -1,
    recordspan: recordspan,
    maxRecords: maxRecords,
    precision: precision,
    onrecord: function(e) {
      bar.innerHTML = render(e.records);
    }
  });
}();