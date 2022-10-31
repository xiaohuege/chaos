const fs = require('fs');
const path = require('path');
const { writeFile, readFile } = require('../uitls/file');

function getErrorData(data) {
  console.log('xxxx', data);
  if (!data) return null;
  const lines = data.split(/\r?\n/);
  console.log('xxxx', lines);
  const result = {};
  let filePath = '';
  lines.forEach((line) => {
    if (line) {
      if (line.indexOf(' ') === -1 && /.js$/.test(line)) {
        result[line] = {};
        filePath = line;
      } else if (line.indexOf(' ') === 0) {
        const codeSplits = line.trim().split(' ');
        console.log('xxxx', codeSplits);
        if (codeSplits && codeSplits.length) {
          if (codeSplits[codeSplits.length - 1] === 'prefer-const') {
            const codeIndexs = codeSplits[0].split(':');
            console.log('xxxx=====2', codeIndexs);
            result[filePath][codeIndexs[0]] = codeIndexs[1];
          }
        }
      }
    }
  });
  return result;
}

async function formatCodeByConst(filePath, errorMap) {
  if (filePath && errorMap) {
    fs.readFile(path.join(filePath), { encoding: 'utf-8' }, async (err, bytesRead) => {
      if (err) {
        console.error(err);
        return;
      };
      const lines = bytesRead.split(/\r?\n/);
      console.log('xxxx=====3', lines);
      const result = lines.map((line, index) => {
        if (errorMap[index + 1]) {
          line = line.replace(/\slet\s/g, ' const ');
        }
        return line;
      });
      await writeFile(filePath, result.join('\n'));
    });
  }
}

async function speciConst(bytesRead) {
  const errorRes = getErrorData(bytesRead);
  for (const filePath in errorRes) {
    await formatCodeByConst(filePath, errorRes[filePath]);
  }
}

async function bootstrap() {
  console.log('bootstrap');
  await speciConst(readFile('./data.txt'));
  console.log('end');
}

console.log(' ......................阿弥陀佛......................\n'
+ '                       _oo0oo_                      \n'
+ '                      o8888888o                     \n'
+ '                      88" . "88                     \n'
+ '                      (| -_- |)                     \n'
+ '                      0\\  =  /0                     \n'
+ '                   ___/‘---’\\___                   \n'
+ '                  .\' \\|       |/ \'.                 \n'
+ '                 / \\\\|||  :  |||// \\                \n'
+ '                / _||||| -卍-|||||_ \\               \n'
+ '               |   | \\\\\\  -  /// |   |              \n'
+ '               | \\_|  \'\'\\---/\'\'  |_/ |              \n'
+ '               \\  .-\\__  \'-\'  ___/-. /              \n'
+ '             ___\'. .\'  /--.--\\  \'. .\'___            \n'
+ '         ."" ‘<  ‘.___\\_<|>_/___.’>’ "".          \n'
+ '       | | :  ‘- \\‘.;‘\\ _ /’;.’/ - ’ : | |        \n'
+ '         \\  \\ ‘_.   \\_ __\\ /__ _/   .-’ /  /        \n'
+ '    =====‘-.____‘.___ \\_____/___.-’___.-’=====     \n'
+ '                       ‘=---=’                      \n'
+ '                                                    \n'
+ '....................佛祖保佑 ,永无BUG...................');
bootstrap();
