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
     * @fires module:log#send
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


            /**
             * @event module:log#send
             * @type {Object}
             * @property {string} url 当前统计请求的完整地址
             */
            exports.fire('send', {url: url});
        };
    })();

    /**
     * 填充数据
     * 根据当前点击对象，解释对象所处 XPath 及 url
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

        // 反转 XPath 顺序
        path.reverse();

        if (/\bOP_LOG_(TITLE|LINK|IMG|BTN|OTHERS)/i.test(from.className)) {
            type = RegExp.$1.toLowerCase();
        }
        else if (/^a|img|input|button$/.test(tag)) {
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
     * @param {?DOMEvent} e DOM 事件对象
     * @param {HTMLElement=} el 指定触发统计的 HTMLElement
     * @fires module:log#click
     */
    var onClick = function (e, el) {
        var target = el || T.event.getTarget(e);
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

        /**
         * @event module:log#click
         * @type {Object}
         * @property {string} rsv_xpath 事件源 DOM 节点的XPath(type)
         * @property {string} t 时间截的 36 进制表示
         */
        exports.fire('click', {data: data});

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
         * @see options
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
        },

        /**
         * 模拟点击指定的 HTMLElement 以发送统计
         * 
         * @param {HTMLElement} el 需要模拟点击触发统计的 HTMLElement
         */
        click: function (el) {
            onClick(null, el);
        },

        /**
         * 手动发送统计请求
         * 
         * @param {Object} data 要发送的数据
         */
        send: function (data) {
            send(options.action + T.url.jsonToQuery(data));
        }
    };

    var observe = T.lang.Class.prototype;
    T.extend(exports, {

        /**
         * 添加事件绑定
         * 
         * @static
         * @method module:log.on
         * @param {?string} type 事件类型
         * @param {Function} listner 要添加绑定的监听器
         */
        on: observe.addEventListener,

        /**
         * 解除事件绑定
         * 
         * @static
         * @method module:log.un
         * @param {string=} type 事件类型
         * @param {Function=} listner 要解除绑定的监听器
         */
        un: observe.removeEventListener,

        /**
         * 触发指定事件
         * 
         * @static
         * @method module:log.fire
         * @param {string} type 事件类型
         * @param {Object} args 透传的事件数据对象
         */
        fire: observe.dispatchEvent
    });

    return exports;
});
