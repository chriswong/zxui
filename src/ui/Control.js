/**
 * ZXUI (Zhixin UI)
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file 控件基类
 * @author chris(wfsr@foxmail.com)
 */

define(function (require) {

    var lib = require('./lib');

    /**
     * 控件基类
     * 
     * 只可继承，不可实例化
     * 
     * @requires lib
     * @exports Control
     */
    var Control = lib.newClass(/** @lends module:Control.prototype */{

        /**
         * 控件类型标识
         * 
         * @type {string}
         * @private
         */
        type: 'Control',

        /**
         * 控件可用状态
         *
         * @type {boolean}
         * @private
         */
        disabled: false,

        /**
         * 将实例方法绑定 this
         * 
         * @param {(Array.<string> | string)} events 类方法名数组
         * @protected
         */
        bindEvents: function (events) {
            var me = this;

            if (!events || !events.length) {
                return;
            }

            if (typeof events === 'string') {
                events = events.split(/\s*,\s*/);
            }

            lib.each(
                events,
                function (name, fn) {
                    fn = name && me[name];
                    if (fn) {
                        me[name] = lib.bind(fn, me);
                    }
                }
            );
        },


        /**
         * 控件初始化
         * 
         * @param {Object} options 配置参数
         * @protected
         */
        initialize: function (options) {
            options = this.setOptions(options);
            this.binds && this.bindEvents(this.binds);
            this.init && this.init(options);
            this.children = [];
        },


        /**
         * 渲染控件
         * 
         * @return {module:Control} 当前实例
         * @abstract
         * @protected
         */
        render: function () {
            throw new Error('not implement render');
        },

        /**
         * 将控件添加到页面的某个元素中
         * 
         * @param {HTMLElement} wrap 被添加到的页面元素
         * @public
         */
        appendTo: function (wrap) {
            this.main = wrap || this.main;
            this.render();
        },

        /**
         * 通过 className 查找控件容器内的元素
         * 
         * @see baidu.dom.q
         * @param {string} className 元素的class，只能指定单一的class，
         * 如果为空字符串或者纯空白的字符串，返回空数组。
         * @return {Array} 获取的元素集合，查找不到或className参数错误时返回空数组
         * @public
         */
        query: function (className) {
            return lib.q(className, this.main);
        },

        /**
         * 设置控件状态为禁用
         * 
         * @fires module:Control#disable
         * @public
         */
        disable: function () {
            this.disabled = true;

            /**
             * @event module:Control#disable
             */
            this.fire('disable');
        },

        /**
         * 设置控件状态为启用
         * 
         * @fires module:Control#enable
         * @public
         */
        enable: function () {
            this.disabled = false;

            /**
             * @event module:Control#enable
             */
            this.fire('enable');
        },

        /**
         * 获取控件可用状态
         * 
         * @return {boolean} 控件的可用状态值
         * @public
         */
        isDisabled: function () {
            return this.disabled;
        },


        /**
         * 添加子控件
         * 
         * @param {module:Control} control 控件实例
         * @param {string} name 子控件名
         * @public
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
         * @param {module:Control} control 子控件实例
         * @public
         */
        removeChild: function (control) {
            var children = this.children;
            for (var name in children) {
                if (children.hasOwnProperty(name)) {
                    if (children[name] === control) {
                        delete this[name];
                    }
                }
            }
        },

        /**
         * 获取子控件
         * 
         * @param {string} name 子控件名
         * @return {module:Control} 获取到的子控件
         * @public
         */
        getChild: function (name) {
            return this.children[name];
        },

        /**
         * 批量初始化子控件
         * 
         * @param {HTMLElement} wrap 容器DOM元素
         * @public
         */
        initChildren: function (/* wrap */) {
            throw new Error('not implement initChildren');
        },

        /**
         * 销毁控件
         * 
         * @fires module:Control#dispose
         * @public
         */
        dispose: function () {

            /**
             * @event module:Control#dispose
             */
            this.fire('dispose');

            var child;
            while ((child = this.children.pop())) {
                child.dispose();
            }

            for (var type in this._listners) {
                this.un(type);
            }
        }

    }).implement(lib.observable).implement(lib.configurable);

    return Control;
});
