# geektime-cli

<div align="center">
  <img src="screenshot-export.gif" alt="geektime-cli screenshot">
</div>

> CLI for <https://time.geekbang.org> (极客时间)

## INSTALL
```bash
npm install geektime-cli -g
# or
yarn global add geektime-cli
```

## USAGE
```
  Usage: geektime [options] [command]

  Options:

    -V, --version             output the version number
    -h, --help                output usage information

  Commands:

    login|l <phone> <password>  登录极客时间
    config|c [options]          调整参数设置
    info|i                      显示设置信息
    products                    获取已购列表
    articles <cid>              获取文章列表
    article <id>                获取文章内容
    export|e [options] <cid>    导出专栏内容

```

### `geektime export -m, --with-mp3`
导出专栏音频

### `geektime config`
```
  Usage: geektime config [options]

  调整参数设置

  Options:

    -d, --dir <dir>         默认导出目录
    -o, --auto-open <open>  自动打开目录 [0/1]
    -h, --help              output usage information
```

## License

MIT
