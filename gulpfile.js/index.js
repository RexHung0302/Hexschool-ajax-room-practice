const { src, dest, series, parallel, watch } = require('gulp');
// 套件引入工具，使用這個不需要再個別引入套件
const $ = require('gulp-load-plugins')({ lazy: false });
// CSS Prefix
const autoprefixer = require('autoprefixer');
// 載入 minimist 套件，用來取得目前環境狀態
const minimist = require('minimist');
// 瀏覽器
const browserSync = require('browser-sync').create();
// 獲取檔案路徑
const { envOptions } = require('./envOptions');

// 取得目前的開發環境狀態
let options = minimist(process.argv.slice(2), envOptions);
// 現在開發狀態
console.log(`Current mode：${options.env}`);

// 檔案清除任務
function cleanTask() {
  return src(envOptions.clean.src, {
      read: false,
      allowEmpty: true,
    })
    .pipe($.clean());
}

// 複製檔案任務
function copyFileTask() {
  return src(envOptions.conyFile.src)
  .pipe(dest(envOptions.conyFile.path))
  .pipe(
    browserSync.reload({
      stream: true,
    }),
  );
}

// PUG 套件編譯任務
function pugTask() {
  return src(envOptions.pug.src)
    .pipe($.pug({
      //若為false將會去除空格
      pretty: true
    }))
    .pipe(dest(envOptions.pug.path));
}

// HTML EJS 編譯任務
function layoutHTMLTask() {
  return src(envOptions.html.src)
    .pipe($.plumber())
    .pipe($.frontMatter())
    .pipe(
      $.layout((file) => {
        return file.frontMatter;
      })
    )
    .pipe(dest(envOptions.html.path))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
}

// Sass 任務
function sassTask() {
  const plugins = [
    autoprefixer(),
  ];
  return src(envOptions.style.src) 
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: envOptions.style.outputStyle,
      includePaths: envOptions.style.includePaths,
    }).on('error', $.sass.logError))
    .pipe($.postcss(plugins))
    .pipe($.sourcemaps.write('.'))
    .pipe(dest(envOptions.style.path))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
}

// JS 任務
function babelTask() {
  return src(envOptions.javascript.src)
    // .pipe($.sourcemaps.init())
    .pipe($.babel())
    // .pipe($.concat(envOptions.javascript.concat))
    .pipe($.sourcemaps.write('.'))
    .pipe(dest(envOptions.javascript.path))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
}

// JS 套件編譯任務
function vendorsJsTask() {
  return src(envOptions.vendors.src)
    .pipe($.concat(envOptions.vendors.concat))
    .pipe(dest(envOptions.vendors.path));
}

// 檔案監聽任務
function watchTask() {
  watch(envOptions.html.src, series(layoutHTMLTask));
  watch(envOptions.html.ejsSrc, series(layoutHTMLTask));
  watch(envOptions.javascript.src, series(babelTask, vendorsJsTask));
  watch(envOptions.img.src, series(copyFileTask));
  watch(envOptions.style.src, series(sassTask));
}

// 服務器任務
function browserTask() {
  browserSync.init({
    server: {
      baseDir: envOptions.browserDir,
    },
    port: 8085,
  });
}

// 檔案清除任務
exports.clean = cleanTask;
// 輸出任務
exports.build = series(cleanTask, copyFileTask, pugTask, layoutHTMLTask, sassTask, babelTask, vendorsJsTask);
// 預設任務
exports.default = series(cleanTask, copyFileTask, pugTask, layoutHTMLTask, sassTask, babelTask, vendorsJsTask, parallel(browserTask, watchTask));
