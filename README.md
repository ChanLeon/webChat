# webChat
This is a project about network chat.I use Nodejs &amp; mongodb to create this project.

1.这是一个使用nodejs+mongodb的网络聊天室的项目。

2.在项目中，我使用了kraken-js以及kraken-middleware依赖包来封装了一层nodejs，在代码上更加简洁，容易理解。

3.要使用该项目，你得安装nodejs,mongodb数据库，以及根据package.json来npm install依赖包，在src/fis-conf.js设置好你的端口和index.js的端口匹配。还要使得config/development.json里的mongodb设置的url，端口跟你安装的mongodb匹配。bin/dev.sh以及bin/start.sh里的端口也跟src/fis-conf.js的端口相同。这样在macOS下，用terminal可以直接在项目中./biin/dev.sh来启动，而省去了node index.js这样的启动。
