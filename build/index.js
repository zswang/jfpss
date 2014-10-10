var fs = require('fs');
var input = process.argv[2];
var output = process.argv[3];

if (!input) {
  console.log('not input.');
  return;
}

if (!output) {
  console.log('not output.');
  return;
}

var content = fs.readFileSync(input);

var removeList = ['debug'];

function removeRegion(all, region) {
  if (removeList.indexOf(region) >= 0) {
    return '';
  }
  return all;
}

function includeFile(all, filename) {
  if (fs.existsSync(filename)) {
    return fs.readFileSync(filename);
  } else {
    return '';
  }
}

var cache = {};

function includeRegion(all, filename, region) {
  var contents = [];
  function appendRegion(all, key, content) {
    if (key === region) {
      contents.push(content);
      return '';
    } else {
      return all;
    }
  }
  var result = '';
  if (cache[filename] || fs.existsSync(filename)) {
    if (!cache[filename]) {
      cache[filename] = String(fs.readFileSync(filename));
    }
    var content = cache[filename];
    content.replace(
      /<!--([\w-]+)-->([\s\S]*)<!--\/(\1)-->/g,
      appendRegion
    ).replace(
      /\/\*<([\w-]+)>\*\/([\s\S]*)?\/\*<\/(\1)>\*\//g,
      appendRegion
    );
    return contents.join('\n');
  } else {
    return '';
  }
}

content = String(content).replace(
    /<!--([\w-]+)-->[\s\S]*<!--\/(\1)-->/g,
    removeRegion
  ).replace(
    /\/\*<([\w-]+)>\*\/[\s\S]*?\/\*<\/(\1)>\*\//g,
    removeRegion
  ).replace(
    /\/\*<include\s+([\w\/\\\-\.]+)>\*\//g,
    includeFile
  ).replace(
    /<!--include\s+([\w\/\\\-\.]+)-->/g,
    includeFile
  ).replace(
    /\/\*<include\s+([\w\/\\\-\.]+)\s+([\w-]+)>\*\//g,
    includeRegion
  ).replace(
    /<!--include\s+([\w\/\\\-\.]+)\s+([\w-]+)-->/g,
    includeRegion
  ).replace(
    /function\s*\(\s*\)\s*\{\s*\/\*\!?([\s\S]*?)\*\/[\s;]*\}/g, // 处理函数注释字符串
    function(all, text) {
      return JSON.stringify(text);
    }
  );

fs.writeFileSync(output, content);
