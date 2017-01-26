var fis = module.exports = require('fis');

fis.cli.name = "umi";

fis.config.merge({
    project: {
        fileType: {
            text: 'ejs'
        }
    },
    modules: {
        optimizer: {
            ejs: 'html-compress'
        },
        spriter: 'csssprites'
    },
    settings: {
        optimizer: {
            'html-compress': {
                level: 'strip_comment' //strip strip_space strip_comment
            }
        },
        spriter: {
            csssprites: {
                scale: 0.5,
                margin: 10
            }
        }
    },
    roadmap: {
        path: [{
            reg: /^(.+)\/static\/(.*\.(js|css|png|gif|jpg|eot|svg|ttf|woff|swf))/i,
            useHash: true,
            useDomain: true,
            useSprite: true,
            release: '/static/$1/$2'
        }, {
            //common里面的ejs不生成
            reg: /^\/common\/(.*\.ejs)/i,
            isHtmlLike: true,
            release: false
        }, {
            //common里面的ejs不生成
            reg: /\/tpl\/(.*\.ejs)/i,
            isHtmlLike: true,
            release: false
        }, {
            reg: /^(.+)\/page\/(.*\.(ejs))/i,
            release: '/views/$1/$2',
            isHtmlLike: true,
            isMod: true
        }]
    }
});