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