/**
 * Copyright 2013 Baidu Inc. All rights reserved.
 * @file  知心中间页日志统计模块
 * {@link http://fe.baidu.com/doc/aladdin/#standard/aladdin_click.text|点击统计规范}
 * @author  chris(wfsr@foxmail.com)
 */

define(function (require) {
    var T = baidu;
    var DOM = T.dom;
    var parseJson = T.json.parse;

    require('./control');

    /**
     * 发送日志请求
     * 
     * @inner
     * @param {string} url 日志完整地址
     */
    var send = (function () {
        var list = [];
        return function (url) {
            var index = list.push(new Image()) - 1;

            list[index].onload = list[index].onerror = function () {
                list[index] = list[index].onload = list[index].onerror = null;
                delete list[index];
            };

            list[index].src = url;
        };
    })();

    /**
     * 填充数据
     * 根据当前点击对象，解释对象所处XPath及url
     * @inner
     * @param {Object} data待发送的数据对象
     * @param {HTMLElement} from 当前点击对象
     * @param {HTMLElement} to 统计日志最上层容器
     * @return {Object} 合并所有HTML自定义属性和相关配置项后的数据对象
     */
    var fill = function (data, from, to) {
        var type = 'other';
        var tag = from.tagName.toLowerCase();
        var path = [tag];
        var i = 1;
        var url;
        var nolog = 0;

        var walk = function (el) {
            if (el.getAttribute('data-nolog') === '1') {
                nolog = 1;
                return true;
            }
            var clickData = el.getAttribute('data-click');
            if (clickData) {
                data = T.extend(parseJson(clickData), data);
            }

            if (el !== to) {
                path[i ++] = el.tagName;

                if (el.href) {
                    url = el.href;
                    type = 'link';
                }
            }
            else {
                return true;
            }
        };

        if (from === to) {
            walk(from);
        }
        else {
            DOM.getAncestorBy(from, walk);
        }

        if (nolog) {
            return !nolog;
        }

        path.reverse();

        if (/^a|img|input|button$/.test(tag)) {
            type = {a: 'link', button: 'btn'}[tag] || tag;

            // 取type的前3位作判断，默认非输入框的点击都作为 btn 类型上报
            if (from.type && /^(rad|che|but|sub|res|ima)/.test(from.type)) {
                type = 'btn';
            }

            url = from.href || from.src || url;
            if (url) {
                data.url = url;
            }
        }
        else {
            T.each(
                'title,link,img,btn,others'.split(','),
                function (key) {
                    if (DOM.hasClass(from, options[key])) {
                        type = key;
                    }
                }
            );
        }

        data['rsv_xpath'] = path.join('-').toLowerCase() + '(' + type + ')';
        return data;
    };

    /**
     * 配置项
     * 
     * @name module:log.options
     * @type {Object}
     */
    var options = {

        /**
         * 日志统计服务接口地址
         * 
         * @type {string}
         */ 
        action: 'http://sclick.baidu.com/w.gif?',

        /**
         * 日志统计顶层容器className
         * 
         * @type {string}
         */ 
        main: 'result-op',

        /**
         * xpath中title类型的className
         * 
         * @type {string}
         */ 
        title: 'OP_LOG_TITLE',

        /**
         * xpath中link类型的className
         * 
         * @type {string}
         */ 
        link: 'OP_LOG_LINK',

        /**
         * xpath中img类型的className
         * 
         * @type {string}
         */ 
        img: 'OP_LOG_IMG',

        /**
         * xpath中btn类型的className
         * 
         * @type {string}
         */ 
        btn: 'OP_LOG_BTN',

        /**
         * xpath中others类型的className
         * 
         * @type {string}
         */ 
        others: 'OP_LOG_OTHERS',

        /**
         * 统计公共数据部分
         * 
         * @type {string}
         */ 
        data: {}
    };

    /**
     * 页面点击监听
     * 
     * @inner
     * @param {DOMEvent} e DOM事件对象
     */
    var onClick = function (e) {
        var target = T.event.getTarget(e);
        var klass = options.main;
        var nolog = target.getAttribute('data-nolog') === '1';
        var main = DOM.hasClass(target, klass)
            ? target
            : DOM.getAncestorByClass(target, klass);

        if (nolog || !main) {
            return;
        }

        var data = target.getAttribute('data-click');

        if (data) {
            data = parseJson(data);
        }

        data = fill(data || {}, target, main);

        // 某个上级节点配置了 data-nolog 之后
        if (!data) {
            return;
        }

        if (options.data) {
            data = T.extend(T.extend({}, options.data), data);
        }

        data.t = (+new Date()).toString(36);

        send(options.action + T.url.jsonToQuery(data));
    };

    /**
     * 中间页日志统计模块
     * 
     * @module log
     * @example
     * log.config({action: 'http://www.domain.com/api'});
     * log.start();
     */
    var exports = {

        /**
         * 配置项
         * 
         * @see module:log.options
         * @param {Object} ops 可配置项
         * @param {string=} ops.action 日志统计服务接口地址
         * @param {string=} ops.main 日志统计顶层容器className
         * @param {string=} ops.title xpath中title类型的className
         * @param {string=} ops.link xpath中link类型的className
         * @param {string=} ops.img xpath中img类型的className
         * @param {string=} ops.btn xpath中btn类型的className
         * @param {string=} ops.others xpath中others类型的className
         * @param {Object=} ops.data 统计公共数据部分
         */
        config: function (ops) {
            T.extend(options, ops);
        },

        /**
         * 开始监听页面点击日志
         * 
         */
        start: function () {
            T.on(document, 'click', onClick);
        },

        /**
         * 停止监听页面点击日志
         * 
         */
        stop: function () {
            T.un(document, 'click', onClick);
        }
    };

    return exports;
});
