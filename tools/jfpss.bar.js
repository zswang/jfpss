void function() {
  var bar = document.getElementById('jfpss-bar');
  if (bar) {
    return;
  }

  var jframes = jframes || {};

void function (exports) {

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
}(jframes);

  ;
  var jhtmls="undefined"==typeof exports?jhtmls||{}:exports;void function(e){"use strict";function n(e){return String(e).replace(/["<>& ]/g,function(e){return"&"+u[e]+";"})}function t(e){var n=[];return n.push("with(this){"),n.push(e.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g,function(e){return['!#{unescape("',escape(e),'")}'].join("")}).replace(/[\r\n]+/g,"\n").replace(/^\n+|\s+$/gm,"").replace(/^([ \w\t_$]*([^&\^?|\n\w\/'"{}\[\]+\-():; \t=\.$_]|:\/\/).*$|^(?!\s*(else|do|try|finally|void|typeof\s[\w$_]*)\s*$)[^'":;{}()\n|=&\/^?]+$)\s?/gm,function(e){return e=e.replace(/&none;/g,"").replace(/["'\\]/g,"\\$&").replace(/\n/g,"\\n").replace(/(!?#)\{(.*?)\}|(!?\$)([a-z_]+\w*(?:\.[a-z_]+\w*)*)/g,function(e,n,t,r,u){if(r&&(n=r,t=u),!t)return"";t=t.replace(/\\n/g,"\n").replace(/\\([\\'"])/g,"$1");var o=/^[a-z$][\w+$]+$/i.test(t)&&!/^(true|false|NaN|null|this)$/.test(t);return["',",o?["typeof ",t,"==='undefined'?'':"].join(""):"","#"===n||"$"===n?"_encode_":"","(",t,"),'"].join("")}),e=["'",e,"'"].join("").replace(/^'',|,''$/g,""),e?["_output_.push(",e,");"].join(""):""})),n.push("}"),new Function("_output_","_encode_","helper","jhtmls",n.join(""))}function r(r,u,o){"function"==typeof r&&(r=String(r).replace(/^[^\{]*\{\s*\/\*!?[ \f\t\v]*\n?|[ \f\t\v]*\*\/[;|\s]*\}$/g,""));var i=t(r),c=function(t,r){var u=[];return"undefined"==typeof r&&(r=function(t){i.call(t,u,n,r,e)}),i.call(t,u,n,r,e),u.join("")};return arguments.length<=1?c:c(u,o)}var u={'"':"quot","<":"lt",">":"gt","&":"amp"," ":"nbsp"};e.render=r}(jhtmls);
  ;
  var jfpss = jfpss || {};

void function (exports) {

  var running; // 是否正在运行
  var starttime; // 开始时间
  var recordtime; // 记录时间
  var fps; // 帧数
  var records; // 帧率记录

  var configs; // 配置信息
  var guid;

  /**
   * 启动帧率检测
   * @param{Object} options 配置项
   *  @field{Number} lifespan 最多生命周期，当小于 0 时，则不会自动结束，单位 ms，默认 3000
   *  @field{Number} recordspan 每次记录的间隔，当小于 0 时，不记录，单位 ms，默认 1000
   *  @field{Number} maxRecords 最大记录数
   */
  function startup(options) {
    if (running) {
      return;
    }
    configs = {
      lifespan: 3000,
      recordspan: 1000,
      maxRecords: 10
    };
    options = options || {};
    for (var key in options) {
      configs[key] = options[key];
    }

    var now = new Date;
    starttime = now;
    recordtime = now;
    fps = 0;
    guid = 0;
    records = [];
    running = jframes.request(function (frame) {
      if (!running) {
        return;
      }
      var now = new Date;
      fps++;
      if (now - recordtime >= configs.recordspan) {
        recordtime = now;
        records.push({
          index: guid++,
          fps: fps * (1000 / configs.recordspan)
        });
        while (records.length > configs.maxRecords) {
          records.shift();
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
  }

  /**
   * 计算中位数
   */
  function median() {
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
  }

  /**
   * 终止帧率检测
   */
  function shutdown() {
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
  }

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

  createStyle("\n#jfpss-bar {\n  position: fixed;\n  left: 10px;\n  top: 10px;\n  color: #fff;\n}\n#jfpss-bar em {\n  color: #222;\n}\n#jfpss-bar ul {\n  background: green;\n  padding: 0;\n  margin: 0;\n}\n#jfpss-bar li {\n  list-style-type: none;\n  width: 70px;\n  text-align: right;\n  background-image: linear-gradient(to bottom, rgba(50, 50, 80, 0.1), rgba(0, 0, 0, 0.7));\n  background-repeat: no-repeat;\n  background-position: 0 0;\n}\n");

  var div = document.createElement('div');
  div.innerHTML = "\n  <div id=\"jfpss-bar\"></div>\n  ";
  document.body.appendChild(div);

  
  var bar = document.getElementById('jfpss-bar');
  var render = jhtmls.render("\n<ul>\nforEach(function(item) {\n  <li style=\"background-position: #{70 - parseInt(70 * (Math.min(60, item.fps) / 60))}px 0;\"><em>#{item.index}</em> #{item.fps < 10 ? '0' : ''}#{item.fps}</li>\n});\n</ul>\n  ");
  jfpss.startup({
    lifespan: -1,
    recordspan: 1000,
    maxRecords: 20,
    onrecord: function(e) {
      bar.innerHTML = render(e.records);
    }
  });
  
}();