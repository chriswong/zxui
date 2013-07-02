/**
 * ZXUI (Zhixin UI)
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file  弹出层
 * @author  chris(wfsr@foxmail.com)
 */


define(function (require) {

    var T = baidu;
    var DOM = T.dom;
    var PAGE = T.page;
    var Control = require('./Control');

    /**
     * 弹出层控件
     * 
     * @constructor
     * @extends module:Control
     * @requires Control
     * @exports Popup
     * @see module:City
     * @see module:Calendar
     */
    var Popup = function () {
        this.constructor.superClass.constructor.apply(this, arguments);
    };

    Popup.prototype = {

        /**
         * 控件类型标识
         * 
         * @private
         * @type {string}
         */
        type: 'Popup',

        /**
         * 控件配置项
         * 
         * @private
         * @name module:Popup#options
         * @type {Object}
         * @property {boolean} disabled 控件的不可用状态
         * @property {(string | HTMLElement)} main 控件渲染容器
         * @property {(string | HTMLElement)} target 计算弹出层相对位置的目标对象
         * @property {string | Array.<HTMLElement>} triggers 触发显示弹出层的节点
         * 当指定了 liveTriggers 时只能用 string 类型指定 class
         * @property {string | HTMLElement} liveTriggers 动态 triggers 的父元素节点
         * @property {string} content 提示的内容信息
         * @property {string} dir 弹出层相对 target 的位置，支持8个方向
         * 可选值（默认为 bl）：
         * tr | rt | rb | br | bl | lb | lt | tl | tc | rc | bc | lc
         * 也可通过在 triggers 上设置 data-popup来指定
         * @property {string} prefix 控件class前缀，同时将作为main的class之一
         * @property {Object.<string, number>} offset 弹出层显示的偏移量
         * @property {number} offset.x x 轴方向偏移量
         * @property {number} offset.y y轴方向偏移量
         */
        options: {

            /**
             * 提示框的不可用状态，默认为false。处于不可用状态的提示框不会出现。
             * 
             * @type {boolean}
             * @default
             */
            disabled: false,

            /**
             * 控件渲染主容器
             * 
             * @type {(string | HTMLElement)}
             */
            main: '',

            /**
             * 计算弹出层相对位置的目标对象
             * 
             * @type {(string | HTMLElement)}
             */
            target: '',

            /**
             * 触发显示弹出层的节点class
             * 
             * 当指定了 liveTriggers 时只能用 string 类型指定 class
             * 
             * @type {string | Array.<HTMLElement>}
             */
            triggers: '',

            /**
             * 动态 triggers 的父元素节点
             * 
             * @type {string | HTMLElement}
             */
            liveTriggers: '',

            /**
             * 显示的内容
             * 
             * @type {string}
             */
            content: '',

            /**
             * 弹出层显示在 trigger 的相对位置
             * 
             * 可选值：tr | rt | rb | br | bl | lb | lt | tl | tc | rc | bc | lc
             * 也可通过在 triggers 上设置 data-popup来指定
             * 
             * @type {string}
             * @defaultvalue
             */ 
            dir: 'bl',

            /**
             * 控件class前缀，同时将作为main的class之一
             * 
             * @type {string}
             * @defaultvalue
             */
            prefix: 'ecl-hotel-ui-popup',

            /**
             * 浮层显示的偏移量
             * 
             * @type {string}
             */
            offset: {

                /**
                 * x 轴方向偏移量
                 * 
                 * @type {number}
                 * @defaultvalue
                 */
                x: 0,

                /**
                 * y 轴方向偏移量
                 * 
                 * @type {string}
                 * @defaultvalue
                 */
                y: 0
            }
        },


        /**
         * 需要绑定 this 的方法名，多个方法以半角逗号分开
         * 
         * @private
         * @type {string}
         */
        binds: 'onResize, onShow, onHide',

        /**
         * 控件初始化
         * 
         * @private
         * @params {Object} options 配置项
         * @see module:Popup#options
         */
        init: function (options) {
            options = this.setOptions(options);

            this.disabled  = options.disabled;
            this.content   = options.content;

            if (options.target) {
                this.target = T.g(options.target);                
            }

            var prefix = options.prefix;
            var main   = this.main = options.main 
                && T.g(options.main)
                || document.createElement('div');

            if (options.main) {
                T.addClass(main, prefix);
            }
            else {
                main.className  = prefix;
                main.style.left = '-2000px';
            }

            var me       = this;
            var triggers = options.triggers;
            var liveTriggers = options.liveTriggers;

            if (liveTriggers) {

                this.liveTriggers = T.on(T.g(liveTriggers), 'click', me.onShow);
            }
            else {

                if (T.isString(triggers)) {
                    triggers = T.q(options.triggers);
                }

                T.each(
                    triggers,
                    function (trigger) {
                        T.on(trigger, 'click', me.onShow);
                    }
                );

                this.triggers = triggers;

            }
        },

        /**
         * 绘制控件
         * 
         * @public
         * @fires module:Popup#click 点击事件
         * @return {module:Popup} 当前实例
         */
        render: function () {
            var main = this.main;

            if (!this.rendered) {
                this.rendered = true;
                !this.options.main && document.body.appendChild(main);

                var me = this;

                T.on(
                    main,
                    'click',
                    function (e) {

                        /**
                         * @event module:Popup#click
                         * @type {Object}
                         * @property {DOMEvent} event 事件源对象
                         */
                        me.fire('click', { event: e });
                    }
                );

            }

            if (this.content) {
                main.innerHTML = this.content;
            }

            return this;
        },

        /**
         * 浏览器可视尺寸改变时处理
         * 
         * @private
         */
        onResize: function () {
            clearTimeout(this.resizeTimer);

            var me = this;

            this.resizeTimer = setTimeout(function () {
                me.show();
            }, 100);
        },

        /**
         * 显示浮层前处理
         * 
         * @private
         * @param {DOMEvent} e DOM 事件对象
         * @fires module:Popup#beforeShow 显示前事件
         */
        onShow: function (e) {

            var oldTarget = this.target;

            /**
             * @event module:Popup#beforeShow
             * @type {Object}
             * @property {DOMEvent} event 事件源对象
             */
            this.fire('beforeShow', { event: e });

            if (this.disabled) {
                return;
            }

            if (oldTarget !== this.target) {
                this.hide();
            }

            var me = this;
            var trigger = T.event.getTarget(e);
            var liveTriggers = this.liveTriggers;

            if (liveTriggers) {
                var cls = this.options.triggers;
                var hasClass = T.dom.hasClass;
                while (!hasClass(trigger, cls) && trigger !== liveTriggers) {
                    trigger = trigger.parentNode;
                }

                if (!hasClass(trigger, cls)) {
                    return;
                }
            }

            this.show();

            this.trigger = trigger;

            this.timer = setTimeout(function () {
                T.on(document, 'click', me.onHide);
                T.on(window, 'resize', me.onResize);
            }, 0);
        },

        /**
         * 隐藏浮层前处理
         * 
         * @private
         */
        onHide: function (e) {
            var target = T.event.getTarget(e);
            var main   = this.main;

            if (main === target || DOM.contains(main, target)) {
                return;
            }

            this.hide();

            clearTimeout(this.resizeTimer);
        },

        /**
         * 显示浮层
         * 
         * @public
         * @fires module:Popup#show 显示事件
         */
        show: function () {
            this.computePosition();

            /**
             * @event module:Popup#show
             */
            this.fire('show');
        },

        /**
         * 隐藏浮层
         * 
         * @public
         * @fires module:Popup#hide 隐藏事件
         */
        hide: function () {
            this.main.style.left = '-2000px';

            /**
             * @event module:Popup#hide
             */
            this.fire('hide');

            T.un(document, 'click', this.onHide);
            T.un(window, 'resize', this.onResize);

            clearTimeout(this.timer);
            clearTimeout(this.resizeTimer);
        },

        /**
         * 计算浮层及箭头显示位置
         * 
         * @private
         */
        computePosition: function () {
            var options      = this.options;
            var target       = this.target || this.triggers[0];
            var main         = this.main;
            var dir          = options.dir;
            var position     = DOM.getPosition(target);

            // 目标的8个关键坐标点
            var top          = position.top;
            var left         = position.left;
            var width        = target.offsetWidth;
            var height       = target.offsetHeight;
            var right        = left + width;
            var bottom       = top + height;
            var center       = left + (width / 2);
            var middle       = top + (height / 2);

            // 提示层宽高
            var mainWidth    = main.offsetWidth;
            var mainHeight   = main.offsetHeight;

            // 视窗范围
            var scrollTop    = PAGE.getScrollTop();
            var scrollLeft   = PAGE.getScrollLeft();
            var scrollRight  = scrollLeft + PAGE.getViewWidth();
            var scrollBottom = scrollTop + PAGE.getViewHeight();

            // 属性配置优于实例配置
            var dirFromAttr = target.getAttribute('data-popup');
            if (dirFromAttr) {
                dir = /[trbl]{2}/.test(dirFromAttr) ? dirFromAttr : '1';
            }

            var second, first;

            // 未指定方向时自动按下右上左顺序计算可用方向（以不超出视窗为原则）
            if (dir === 'auto') {

                // 目标宽度大于提示层宽度时优先考虑水平居中
                var horiz = width > mainWidth
                        || left - (mainWidth - width) / 2 > 0
                        && right + (mainWidth - width) / 2 <= scrollRight
                        ? 'c'
                        : left + mainWidth > scrollRight
                            ? 'r'
                            : 'l';

                // 目标高度大于提示层高度时优先考虑垂直居中
                var vertical = height > mainHeight
                        || top - (mainHeight - height) / 2 > 0
                        && bottom + (mainHeight - height) / 2 <= scrollBottom
                        ? 'c'
                        : top + mainHeight > scrollBottom
                            ? 'b'
                            : 't';

                // 如果提示层在目标下边未超出视窗
                if (bottom + mainHeight <= scrollBottom) {
                    first = 'b';
                    second = horiz;
                }

                // 如果提示层在目标右侧未超出视窗
                else if (right + mainWidth <= scrollRight) {
                    first = 'r';
                    second = vertical;
                }

                // 如果提示层在目标上边未超出视窗
                else if (top - mainHeight >= scrollTop) {
                    first = 't';
                    second = horiz;
                }

                // 如果提示层在目标左侧未超出视窗
                else if (left - mainWidth >= scrollLeft) {
                    first = 'l';
                    second = vertical;
                }

                dir = first + second;
            }
            else {

                // 从 dir 中分拆水平和垂直方向值，方便后续计算
                first = dir.charAt(0);
                second = dir.charAt(1);
            }

            var offset = options.offset;

            // 提示层在目标上部或下部显示时的定位处理
            if ({t: 1, b: 1}[first]) {
                left = {
                    l: left,
                    c: center - (mainWidth / 2),
                    r: right - mainWidth
                }[second];

                top = {
                    t: top - mainHeight,
                    b: bottom
                }[first];

            }

            // 提示层在目标左边或右边显示时的定位处理
            else if ({l: 1, r: 1}[first]) {
                top = {
                    t: top,
                    c: middle - (mainHeight / 2),
                    b: bottom - mainHeight
                }[second];

                left = {
                    l: left - mainWidth - offset.x,
                    r: right + offset.x
                }[first];

            }

            DOM.setStyles(main, {left: left + offset.x, top: top + offset.y});

        }

    };
    T.inherits(Popup, Control);

    return Popup;
});
