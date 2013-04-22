/**
 * Copyright 2013 Baidu Inc. All rights reserved.
 * @file 分页控件
 * @author  chris(wfsr@foxmail.com)
 */

define(function (require) {

    var T = baidu;
    var Control = require('./control');

    /**
     * 分页控件
     * 
     * 提供Ajax数据分页功能
     * @constructor
     * @extends module:Control
     * @requires Control
     * @exports Pager
     * @example
     * &lt;div class="pager-container"&gt;&lt;/div&gt;
     * new Pager({
     *     main: T.qq('pager-container'),
     *     total: 10,
     *     onChange: function (e) {
     *         // load new date
     *         this.setPage(e.page);
     *         this.render();
     *     }
     *  }).render();
     */
    var Pager = function () {
        this.constructor.superClass.constructor.apply(this, arguments);
    };
    T.inherits(Pager, Control);

    /**
     * 当页数较多时，中间显示页码的个数
     * 
     * @type {number}
     */
    Pager.SHOW_COUNT = 5;


    T.extend(Pager.prototype,
    /** @lends module:Pager.prototype */{

        type: 'Pager',

        /**
         * 控件配置项
         * 
         * @name module:Pager#optioins
         * @type {Object}
         * @property {boolean} options.disabled 控件的不可用状态
         * @property {string|HTMLElement} options.main 控件渲染容器
         * @property {number} options.page 当前页，第一页从0开始
         * @property {number} options.padding 当页数较多时，首尾显示页码的个数
         * @property {boolean} options.showAlways 是否一直显示分页控件
         * @property {number} options.showCount 当页数较多时，中间显示页码的个数
         * @property {number} options.total 总页数
         * @property {string} options.prefix 控件class前缀，同时将作为main的class之一
         * @property {string} options.disabledClass 分页项不用可时的class定义
         * @property {Object.<string, string>} options.lang 用于显示上下页的文字
         * @property {string} options.lang.prev 上一页显示文字(支持HTML)
         * @property {string} options.lang.next 下一页显示文字(支持HTML)
         * @property {string} options.lang.ellipsis 省略处显示文字(支持HTML)
         */
        options: {

            // 控件的不可用状态
            disabled: false,

            // 控件渲染主容器
            main: '',

            // 当前页，第一页从0开始
            page: 0,

            // 首尾显示的页码个数
            padding: 1,

            // 是否一直显示分页控件
            showAlways: true,

            // 当页数较多时，中间显示页码的个数
            showCount: 0,

            // 总页数
            total: 0,

            // 控件class前缀，同时将作为main的class之一
            prefix: 'ecl-left_hotel-ui-pager',

            // 分页项不用可时的class定义
            disabledClass: 'disabled',

            // 上下页显示文字
            lang: {

                // 上一页显示文字
                prev: '<em></em>上一页',

                // 下一页显示文字
                next: '下一页<em></em>',

                // 省略号
                ellipsis: '..'
            }
        },

        /**
         * 需要绑定 this 的方法名，多个方法以半角逗号分开
         * 
         * @type {string}
         */
        binds: 'onChange',

        /**
         * 控件初始化
         * 
         * @private
         * @param {Object} options 控件配置项
         * @see module:Pager#options
         */
        init: function (options) {
            options = this.setOptions(options);

            this.disabled  = options.disabled;
            this.showCount = options.showCount || Pager.SHOW_COUNT;
            this.total     = options.total;
            this.padding   = options.padding;
            this.page      = 0;

            this.setPage(options.page | 0);

            var lang = options.lang;
            lang.prev.replace(/\{prefix\}/gi, options.prefix);
            lang.next.replace(/\{prefix\}/gi, options.prefix);

            if (options.main) {
                this.main = T.g(options.main);
                T.addClass(this.main, options.prefix);
                T.on(this.main, 'click', this.onChange);
            }

        },

        /**
         * 设置页码
         * 
         * @param {number} page 新页码
         */
        setPage: function (page) {
            page = Math.max(0, Math.min(page | 0, this.total - 1));

            if (page !== this.page) {
                this.page = page;
            }
        },

        /**
         * 获取当前页码
         * 
         * @return {number} 控件当前页码
         */
        getPage: function () {
            return this.page;
        },


        /**
         * 绘制控件
         * 
         * @description 页数小于2页时可配置控件隐藏
         */
        render: function () {
            if (!this.main) {
                return;
            }

            var main = this.main;

            if (this.total > 1 || this.options.showAlways) {
                main.innerHTML = this.build();
                T.show(main);
            }
            else {
                T.hide(main);
            }
        },

        /**
         * 生成所有页码
         * 
         * @private
         * @return {string} 分页的HTML代码
         */
        build: function () {
            var options    = this.options;
            var lang       = options.lang;
            var prefix     = options.prefix + '-';
            var showAlways = options.showAlways;
            var showCount  = this.showCount;
            var total      = this.total;
            var page       = this.page + 1;
            var padding    = this.padding;
            var html       = [];
            var htmlLength = 0;

            if (total < 2) {
                if (showAlways) {
                    setSpecial(0, 'prev', true);
                    setSpecial(0, 'current');
                    setSpecial(0, 'next', true);                   
                }
                
                return html.join('');
            }

            var start = 1;
            var end = total;
            var wing = (showCount - showCount % 2) / 2;

            function setNum(i) {
                html[htmlLength ++] = '<a href="#" data-page="' + (i - 1) + '">'
                                      + i + '</a>';
            }

            function setSpecial(i, name, disabled) {
                var klass = prefix + name;
                if (disabled) {
                    klass += ' ' + prefix + 'disabled';
                }
                html[htmlLength ++] = '<a href="#" data-page="'
                                      + i + '" class="' + klass + '">' 
                                      + (lang[name] || i + 1)
                                      + '</a>';
            }

            showCount = wing * 2 + 1;

            if (showCount < total) {
                end = showCount;
                if (page > wing + 1) {
                    if (page + wing > total) {
                        start = total - wing * 2;
                        end   = total;
                    }
                    else {
                        start = page - wing;
                        end   = page + wing;
                    }
                }
            }

            // previous page
            if (page > 1 || showAlways) {
                setSpecial(page - 2, 'prev', page < 2);
            }

            // padding-left
            for (i = 0; i < padding; i ++) {
                if (i + 1 < start) {
                    setNum(i + 1);              
                }
            }

            // ..
            if (start > padding + 2) {
                setSpecial(page - 2, 'ellipsis');
            }

            if (start === padding + 2) {
                setNum(padding + 1);
            }
            
            // current page & wing
            var current = page;
            for (var i = start; i <= end; i++) {
                i === current ? setSpecial(i - 1, 'current') : setNum(i);
            }

            // ..
            var pos = total - padding;
            if (end < pos - 1) {
                setSpecial(page, 'ellipsis');
            }

            if (end === pos - 1) {
                setNum(pos);
            }

            // padding-right
            for (i = 0; i < padding; i++) {
                if (pos + i + 1 > end) {
                    setNum(pos + i + 1);            
                }
            }               

            // next page
            if (page < total || showAlways) {
                setSpecial(page, 'next', page >= total);
            }

            return html.join('');
        },

        /**
         * 页码改变时
         * 
         * @private
         * @param {DOMEvent} e 事件对象
         * @fires module:Pager#click 点击事件
         * @fires module:Pager#change 页码改变事件
         */
        onChange: function (e) {
            e && T.event.preventDefault(e);
            var target = T.event.getTarget(e);

            /**
             * @event module:Pager#click
             */
            this.fire('click');

            if (this.disabled || !target) {
                return;
            }

            if (target.tagName !== 'A') {
                var main = this.main;
                target = T.dom.getAncestorBy(target, function (el) {
                    // 最高访问到控件根容器, 避免到文档根节点
                    return el.tagName === 'A' || el === main;
                });
                
                if (target === main) {
                    return;
                }
            }

            var current = target.getAttribute('data-page');

            if (current !== null) {
                current |= 0;
            }

            var page = this.page;

            if ( 
                current !== null
                && 0 <= current
                && current < this.total
                && current !== page
            ) {
                /**
                 * @event module:Pager#change
                 * @type {Object}
                 * @property {number} page 新的页码
                 */
                this.fire('change', { page: current });
            }
        }
    });

    return Pager;
});
