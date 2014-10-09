var jfpss = jfpss || {};

void function (exports) {

  var running; // 是否正在运行
  var starttime; // 开始时间
  var recordtime; // 记录时间
  var fps; // 帧数
  var records; // 帧率记录

  var configs; // 配置信息

  /**
   * 启动帧率记录
   */
  function startup(options) {
    if (running) {
      return;
    }
    configs = {
      lifespan: 30000,
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
    records = [];
    running = jframes.request(function (frame) {
      if (!running) {
        return;
      }
      var now = new Date;
      fps++;
      if (now - recordtime >= 1000) {
        recordtime = now;
        records.push({
          fps: fps
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

      if (now - starttime <= configs.lifespan) {
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