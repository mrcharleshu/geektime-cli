# geektime-cli

<div align="center">
  <img src="https://user-images.githubusercontent.com/361645/46958751-1c82b000-d0cd-11e8-89a4-3fe9d0b62485.gif" alt="geektime-cli screenshot">
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

    login|l [options] <phone> <password>     登录极客时间
    config|c [options]                       调整参数设置
    info|i                                   显示设置信息
    products                                 获取已购列表
    articles <cid>                           获取文章列表
    article <id>                             获取文章内容
    export|e [options] <cid> [otherCids...]  导出专栏 文章/音频/视频

```

### `geektime login`
```
  Usage: login|l [options] <phone> <password>

  登录极客时间

  Options:

    -c, --code <code>  指定国家区号
    -h, --help         output usage information
```

### `geektime export`

```
  Usage: export|e [options] <cid>

  导出专栏 文章/音频/视频

  Options:

    -o, --output [dir]  导出目录
    -m, --mp3           导出音频
    -v, --video         导出视频
    -h, --help          output usage information
```

批量导出 `geektime export 48 49`

#### `geektime export -m, --mp3`
导出专栏音频

#### `geektime export -v, --video`
导出专栏视频

### `geektime config`
```
  Usage: geektime config [options]

  调整参数设置

  Options:

    -d, --dir <dir>    设置文章导出目录
    -m, --mp3 <dir>    设置音频导出目录
    -v, --video <dir>  设置视频导出目录
    -h, --help         output usage information
```

## EXAMPLE
- geektime products | sed -n '/:/p' | awk -F ":" '{print $1}' | xargs -I {} geektime export -d {}
- geektime products | sed -n '/:/p' | awk -F ":" '{print $1}' | xargs -I {} geektime export -m {}
- geektime products | sed -n '/:/p' | awk -F ":" '{print $1}' | xargs -I {} geektime export -v {}

## License

MIT
