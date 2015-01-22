(function(exportName) {
  'use strict';
  if (typeof jframes === 'undefined') {
    throw new Error('jframes is not defined.');
  }
  var exports = exports || {};
  var running; // 是否正在运行
  var starttime; // 开始时间
  var recordtime; // 记录时间
  var fps; // 帧数
  var records; // 帧率记录
  var configs; // 配置信息
  var guid;
  var config = function(options) {
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
  var startup = function(options) {
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
    running = jframes.request(function(frame) {
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
            median: median
          });
        }
        fps = 0;
      }
      if (configs.lifespan < 0 || now - starttime <= configs.lifespan) {
        frame.next();
      }
      else {
        shutdown();
      }
    });
  };
  /**
   * 计算中位数
   */
  var median = function() {
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
  var shutdown = function() {
    if (!running) {
      return;
    }
    jframes.release(running);
    if (configs.onshutdown) {
      configs.onshutdown({
        records: records.slice(),
        median: median
      });
    }
    running = null;
    configs = null;
    records = null;
  };
  exports.config = config;
  exports.startup = startup;
  exports.shutdown = shutdown;
  if (typeof define === 'function') {
    if (define.amd || define.cmd) {
      define(function() {
        return exports;
      });
    }
  }
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  }
  else {
    window[exportName] = exports;
  }
})('jfpss');