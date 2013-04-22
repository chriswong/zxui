/**
 * Copyright 2013 Baidu Inc. All rights reserved.
 * @file 控件基类
 * @author  chris(wfsr@foxmail.com)
 */

define(function () {

    var T = baidu;
    var EVENT = T.event;

    /**
     * 获取目标元素指定元素className最近的祖先元素
     * @name baidu.dom.getAncestorByClass
     * @function
     * @grammar baidu.dom.getAncestorByClass(element, className)
     * @param {HTMLElement|string} element 目标元素或目标元素的id
     * @param {string} className 祖先元素的class，只支持单个class
     * @remark 使用者应保证提供的className合法性，不应包含不合法字符，
     * className合法字符参考：http://www.w3.org/TR/CSS2/syndata.html。
     * @see baidu.dom.getAncestorBy,baidu.dom.getAncestorByTag
     *             
     * @returns {HTMLElement|null} 指定元素className最近的祖先元素，查找不到时返回null
     */
    T.dom.getAncestorByClass = function (element, className) {
        // from Tangram 1.5.2.2
        element = baidu.dom.g(element);
        className = new RegExp(
                        '(^|\\s)'
                        + baidu.string.trim(className)
                        + '(\\s|\x24)'
                    );

        while ((element = element.parentNode) && element.nodeType === 1) {
            if (className.test(element.className)) {
                return element;
            }
        }

        return null;
    };

    EVENT._eventFilter = EVENT._eventFilter || {};



    /**
     * 事件仅在鼠标进入/离开元素区域触发一次，当鼠标在元素区域内部移动的时候不会触发，
     * 用于为非IE浏览器添加mouseleave/mouseenter支持。
     * 
     * @name baidu.event._eventFilter._crossElementBoundary
     * @function
     * @grammar baidu.event._eventFilter._crossElementBoundary(listener, e)
     * 
     * @param {function} listener   要触发的函数
     * @param {DOMEvent} e          DOM事件
     */

    EVENT._eventFilter._crossElementBoundary = function (listener, e) {
        var related = e.relatedTarget,
            current = e.currentTarget;
        if (
           related === false || 
           // 如果current和related都是body，contains函数会返回false
           current === related ||
           // Firefox有时会把XUL元素作为relatedTarget
           // 这些元素不能访问parentNode属性
           // thanks jquery & mootools
           (related && (related.prefix === 'xul' ||
           //如果current包含related，说明没有经过current的边界
           baidu.dom.contains(current, related)))
          ) {
            return;
        }
        return listener.call(current, e);
    };


    T.fn.bind = function (func, scope) {
        var xargs = arguments.length > 2 ? [].slice.call(arguments, 2) : null;
        return function () {
            var fn = baidu.lang.isString(func) ? scope[func] : func,
                args = (xargs) 
                ? xargs.concat([].slice.call(arguments, 0))
                : arguments;
            return fn.apply(scope || fn, args);
        };
    };



    /**
     * 用于为非IE浏览器添加mouseenter的支持;
     * mouseenter事件仅在鼠标进入元素区域触发一次,
     *    当鼠标在元素内部移动的时候不会多次触发.
     */
    EVENT._eventFilter.mouseenter = window.attachEvent 
        ? null 
        : function (element, type, listener) {
            return {
                type: 'mouseover',
                listener: baidu.fn.bind(
                    EVENT._eventFilter._crossElementBoundary,
                    this,
                    listener
                )
            };
        };



    /**
     * 用于为非IE浏览器添加mouseleave的支持;
     * mouseleave事件仅在鼠标移出元素区域触发一次,
     *    当鼠标在元素区域内部移动的时候不会触发.
     */
    EVENT._eventFilter.mouseleave = window.attachEvent 
        ? null
        : function (element, type, listener) {
        return {
            type: 'mouseout',
            listener: baidu.fn.bind(
                EVENT._eventFilter._crossElementBoundary,
                this,
                listener
            )
        };
    };


    /**
     * 获取横向滚动量
     * 
     * @return {number} 横向滚动量
     */
    T.page.getScrollLeft = function () {
        var d = document;
        return (window.pageXOffset
                || d.documentElement.scrollLeft
                || d.body.scrollLeft);
    };
    /**
     * 查询数组中指定元素的索引位置
     * 
     * @private
     * @param {Array.<*>} source 需要查询的数组
     * @param {*} match 查询项
     * 
     * @returns {number} 指定元素的索引位置，查询不到时返回-1
     */
    var indexOf = function (source, target) {
        var index = -1;

        for (var i = 0, l = source.length; i < l; i++) {
            if (source[i] === target) {
                index = i;
                break;
            }
        }

        return index;
    };

    if (!T.array.indexOf) {
        T.array.indexOf = indexOf;
    }

    /**
     * 控件基类
     * 
     * 只可继承，不可实例化
     * @constructor
     * @exports Control
     * @fires module:Control#beforeinit
     * @fires module:Control#afterinit
     */
    var Control = function () {

        this.children = [];
        this._listners = {};

        /**
         * @event module:Control#beforeinit
         */
        this.fire('beforeinit');

        this.bindEvents(this.binds);
        this.init.apply(this, arguments);

        /**
         * @event module:Control#beforeinit
         */
        this.fire('afterinit');

    };


    Control.prototype = {

        constructor: Control,

        type: 'Control',

        /**
         * 控件可用状态
         *
         * @type {boolean}
         */
        disabled: false,

        /**
         * 设置可配置项
         * 
         * @protected
         * @param {Object} options 配置项
         * @return {Object} 合并更新后的配置项
         */
        setOptions: function (options) {
            if (!options) {
                return this.options;
            }

            var TO           = T.object;
            var thisOptions  = this.options = TO.clone(this.options);
            var eventNameReg = /^on[A-Z]/;
            var me           = this;
            var extend       = TO.extend;

            this.srcOptions = options;

            TO.each(options, function (val, name) {

                // 处理配置项中的事件
                if (eventNameReg.test(name) && typeof val === 'function') {

                    // 移除on前缀，并转换第3个字符为小写，得到事件类型
                    var type = name.charAt(2).toLowerCase() + name.substr(3);
                    me.on(type, val);

                    delete options[name];
                }
                else if (name in thisOptions) {

                    // 只处理一层，非递归处理
                    thisOptions[name] = TO.isPlain(val) 
                        ? extend(thisOptions[name] || {}, val)
                        : val;
                }
            });

            return thisOptions;
        },

        /**
         * 将实例方法绑定 this
         * 
         * @param {Array.<string>} events 类方法名数组
         */
        bindEvents: function (events) {
            var me = this;

            if (!events || !events.length) {
                return;
            }

            if (typeof events === 'string') {
                events = events.split(/\s*,\s*/);
            }

            T.each(events, function (name, fn) {
                fn = name && me[name];
                if (fn) {
                    me[name] = function () {
                        return fn.apply(me, arguments);
                    };
                }
            });
        },


        /**
         * 控件初始化
         * 
         * @protected
         */
        init: function () {
            throw new Error('not implement init');
        },


        /**
         * 渲染控件
         * 
         */
        render: function () {
            throw new Error('not implement render');
        },

        /**
         * 将控件添加到页面的某个元素中
         * 
         * @param {HTMLElement} wrap 被添加到的页面元素
         */
        appendTo: function (wrap) {
            this.main = wrap || this.main;
            this.render();
        },

        /**
         * 设置控件状态为禁用
         * 
         */
        disable: function () {
            this.disabled = true;
        },

        /**
         * 设置控件状态为启用
         * 
         */
        enable: function () {
            this.disabled = false;
        },

        /**
         * 获取控件可用状态
         * 
         * @return {boolean} 控件的可用状态值
         */
        isDisabled: function () {
            return this.disabled;
        },


        /**
         * 添加子控件
         * 
         * @param {Control} control 控件实例
         * @param {string} name 子控件名
         */
        addChild: function (control, name) {
            var children = this.children;

            name = name || control.childName;

            if (name) {
                children[nane] = control;
            }

            children.push(control);
        },

        /**
         * 移除子控件
         * 
         * @param {Control} control 子控件实例
         */
        removeChild: function (control) {
            T.object.each(this.children, function (child, name) {
                if (child === control) {
                    delete this[name];
                }
            });
        },

        /**
         * 获取子控件
         * 
         * @param {string} name 子控件名
         * @return {Control} 获取到的子控件
         */
        getChild: function (name) {
            return this.children[name];
        },

        /**
         * 批量初始化子控件
         * 
         * @param {HTMLElement} wrap 容器DOM元素
         * 
         */
        initChildren: function (/* wrap */) {
            throw new Error('not implement initChildren');
        },

        /**
         * 添加事件绑定
         * 
         * @param {?string} type 事件类型
         * @param {Function} listner 要添加绑定的监听器
         */
        on: function (type, listner) {
            if (!T.isString(type)) {
                listner = type;
                type = '*';
            }

            var listners = this._listners[type] || [];

            if (indexOf(listners, listner) < 0) {
                listner.$type = type;
                listners.push(listner);
            }

            this._listners[type] = listners;

            return this;
        },

        /**
         * 解除事件绑定
         * 
         * @param {string=} type 事件类型
         * @param {Function=} listner 要解除绑定的监听器
         */
        un: function (type, listner) {
            if (!T.isString(type)) {
                listner = type;
                type = '*';
            }

            var listners = this._listners[type];

            if (listners) {
                if (listner) {
                    var index = indexOf(listners, listner);

                    if (~index) {
                        delete listners[index];
                    }
                }
                else {
                    listners.length = 0;
                    delete this._listners[type];
                }
            }

            return this;
        },

        /**
         * 触发指定事件
         * 
         * @param {string} type 事件类型
         * @param {Object} args 透传的事件数据对象
         */
        fire: function (type, args) {
            var listners = this._listners[type];

            if (listners) {
                T.array.each(listners, function (listner) {

                    args = args || {};
                    args.type = type;

                    listner.call(this, args);

                }, this);
            }

            if (type !== '*') {
                this.fire('*', args);
            }

            return this;
        },

        /**
         * 销毁控件
         * 
         * @fires module:Control#dispose
         */
        dispose: function () {

            /**
             * @event module:Control#dispose
             */
            this.fire('dispose');

            for (var type in this._listners) {
                this.un(type);
            }
        }

    };

    return Control;
});
