/**
 * ZXUI (Zhixin UI)
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file  知心中间页日志统计模块
 * @author  chris(wfsr@foxmail.com)
 */

define(function (require) {
    var T = baidu;
    var DOM = T.dom;

    require('./Control');

    /**
     * 将字符串解析成json对象
     * baidu.json.parse 的包装，增加容错处理
     * 
     * @param {string} data 需要解析的字符串
     * @see baidu.json.parse
     * @returns {Object} 解析结果json对象
     */
    var parseJson = function (data) {
        try {
            return T.json.parse(data || '{}');
        }
        catch (e) {
            return {};
        }
    };

    /**
     * 发送日志请求
     * 
     * @inner
     * @param {string} url 日志完整地址
     * @fires module:log#send
     */
    var send = (function () {
        var list = [];
        var encode = function (value) {
            return encodeURIComponent(value);
        };

        return function (data) {
            var index = list.push(new Image()) - 1;

            list[index].onload = list[index].onerror = function () {
                list[index] = list[index].onload = list[index].onerror = null;
                delete list[index];
            };

            var url = options.action + T.url.jsonToQuery(data, encode);

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
     * 
     * @inner
     * @param {Object} data待发送的数据对象
     * @param {HTMLElement} from 当前点击对象
     * @param {HTMLElement} to 统计日志最上层容器
     * @return {Object} 合并所有HTML自定义属性和相关配置项后的数据对象
     */
    var fill = function (data, from, to) {
        var type;
        var url;
        var nolog = 0;
        var el = from;
        var path = [];

        var i = 0;
        var clickData;
        var typeReg = /\bOP_LOG_(TITLE|LINK|IMG|BTN|INPUT|OTHERS)\b/i;
        while (el !== to) {
            if (el.getAttribute('data-nolog') === '1') {
                nolog = 1;
                break;
            }

            clickData = el.getAttribute('data-click');
            if (clickData) {
                data = T.extend(parseJson(clickData), data);
            }

            if (el.href) {
                url = el.href;
                type = 'link';
            }

            if (type === 'link' && el.tagName === 'H3') {
                type = 'title';
            }

            if (typeReg.test(el.className)) {
                type = RegExp.$1.toLowerCase();
            }

            var count = 1;
            if (el.previousSibling) {
                var sibling = el.previousSibling;

                do {
                    if (sibling.nodeType === 1
                        && sibling.tagName === el.tagName
                    ) {
                        count++;
                    }
                    sibling = sibling.previousSibling;
                } while (sibling);
            }

            path[i++] = el.tagName + (count > 1 ? count : '');

            el = el.parentNode;

        }

        if (from !== to) {
            clickData = to.getAttribute('data-click');
            if (clickData) {
                data = T.extend(parseJson(clickData), data);
            }            
        }

        if (nolog) {
            return !nolog;
        }

        // 反转 XPath 顺序
        path.reverse();
        var tag = from.tagName.toLowerCase();

        if (!type
                && /^a|img|input|button|select|datalist|textarea$/.test(tag)
            ) {
            type = {a: 'link'}[tag] || 'input';

            url = from.href || from.src || url;
        }

        if (!type) {
            return false;
        }

        var mainUrl = to.getAttribute('mu') || '';
        data.mu = mainUrl;
        if (type === 'title') {
            delete data.mu;
        }

        if (!url || url.slice(-1) === '#') {
            url = mainUrl;
        }

        if (url) {
            data.url = url;
        }


        var title = '';

        // 如果是表单元素
        if (type === 'input') {
            if (/input|textarea/.test(tag)) {
                title = from.value;
                if (from.type && from.type.toLowerCase() === 'password') {
                    title = '';
                }
            }
            else if (/select|datalist/.test(tag)) {
                if (from.children.length > 0) {
                    var index = from.selectedIndex || 0;
                    title = from.children[index > -1 ? index : 0].innerHTML;
                }
            }
            else {
                title = from.innerHTML || from.value || '';
            }
        }
        else {

            // 如果是图片，先取其title
            if (tag === 'img') {
                title = from.title;
            }

            // title为空，遍历父节点
            if (!title) {
                el = from;
                while (i > 0) {
                    i--;
                    if (/^a\d*\b/i.test(path[i])) {
                        url = el.href;
                        title = el.innerHTML;
                        break;
                    }
                    else {
                        if(el.className
                            && (/\bOP_LOG_[A-Z]+\b/.test(el.className))
                        ){
                            title = el.innerHTML;   
                            break;
                        }
                        el = el.parentNode;
                    }
                }
            }
        }
        data.title = T.trim(title);

        data['rsv_xpath'] = path.join('-').toLowerCase() + '(' + type + ')';
        data['rsv_height'] = to.offsetHeight;
        data.path = location.href;
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
         * 日志统计顶层容器 className
         * 
         * @type {string}
         */ 
        main: 'result-op',

        /**
         * xpath 中 title 类型的 className
         * 
         * @type {string}
         */ 
        title: 'OP_LOG_TITLE',

        /**
         * xpath 中 link 类型的 className
         * 
         * @type {string}
         */ 
        link: 'OP_LOG_LINK',

        /**
         * xpath 中 img 类型的 className
         * 
         * @type {string}
         */ 
        img: 'OP_LOG_IMG',

        /**
         * xpath 中 btn 类型的 className
         * 
         * @type {string}
         */ 
        btn: 'OP_LOG_BTN',

        /**
         * xpath 中 input  类型的 className
         * 
         * @type {string}
         */ 
        input: 'OP_LOG_INPUT',

        /**
         * xpath 中 others 类型的 className
         * 
         * @type {string}
         */ 
        others: 'OP_LOG_OTHERS',

        /**
         * 统计公共数据部分
         * 
         * 中间页 p1 永远为 1
         * @type {string}
         */ 
        data: {
            p1: 1
        }
    };

    /**
     * 绑定 P5 参数索引值
     * 
     * @param {[type]} el [el description]
     * @param {[type]} index [index description]
     * @return {[type]} [return description]
     */
    var bindP5 = function (el, index) {
        var data = parseJson(el.getAttribute('data-click'));

        data.p5 = index;
        el.setAttribute('data-click', T.json.stringify(data));
    };

    /**
     * 页面点击监听
     * http://fe.baidu.com/doc/aladdin/#standard/aladdin_click.text
     * 
     * @inner
     * @param {?DOMEvent} e DOM 事件对象
     * @param {HTMLElement=} el 指定触发统计的 HTMLElement
     * @fires module:log#click
     */
    var onClick = function (e, el) {
        var target = el || T.event.getTarget(e);
        var klass = options.main;
        var main = DOM.hasClass(target, klass)
            ? target
            : DOM.getAncestorByClass(target, klass);

        if (!main || main.getAttribute('data-nolog') === '1') {
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

        // 仅当首次点击或有新加入节点时计算 p5 序号值
        if (!('p5' in data)) {
            T.each(
                T.q(options.main),
                function (el, i) {
                    if (el === main) {
                        data.p5 = i + 1;
                    }
                    bindP5(el, i + 1);
                }
            );
        }

        data.t = (+new Date()).toString(36);

        /**
         * @event module:log#click
         * @type {Object}
         * @property {Object} data 上报的公共数据
         * @property {string} data.rsv_xpath 事件源 DOM 节点的XPath(type)
         * @property {number} data.p5 当前统计区域（卡片）的索引值
         * @property {string} data.type 统计类型
         * @property {string} data.t 时间截的 36 进制表示
         * @property {string} target 点击事件源对象
         * @property {string} main 当前统计区域（卡片）主容器
         */
        exports.fire('click', {data: data, target: target, main: main});

        send(data);
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
         * @param {string=} ops.main 日志统计顶层容器 className
         * @param {string=} ops.title xpath 中 title 类型的 className
         * @param {string=} ops.link xpath 中 link 类型的 className
         * @param {string=} ops.img xpath 中 img 类型的 className
         * @param {string=} ops.btn xpath 中 btn 类型的 className
         * @param {string=} ops.input xpath 中 input 类型的 className
         * @param {string=} ops.others xpath 中 others 类型的 className
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
        send: send
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
