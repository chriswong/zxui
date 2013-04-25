/**
 * Copyright 2013 Baidu Inc. All rights reserved.
 * @file  提示层控件
 * @author  chris(wfsr@foxmail.com)
 */

define(function (require) {

    var T = baidu;
    var DOM = T.dom;
    var PAGE = T.page;
    var Control = require('./control');

    /**
     * 从事件源查找目标DOM节点
     * 
     * @param {DOMEvent} e DOM事件对象
     * @param {string} className 目标的className
     * @return {?HTMLElement} 找到的目标对象
     */
    var getTarget = function (e, className) {
        var target = T.event.getTarget(e);

        if (!DOM.hasClass(target, className)) {
            target = DOM.getAncestorByClass(target, className);

            if (!target) {
                return null;
            }
        }

        return target;
    };

    /**
     * 提示层控件
     * 
     * @constructor
     * @extends module:Control
     * @requires Control
     * @extends  Control
     * @exports Tip
     * @example
     * new Tip({
     *     mode: 'over',
     *     arrow: "1",
     *     offset: { x: 5, y: 5},
     *     onBeforeShow: function () {
     *       this.title = Math.random();
     *     }
     * }).render();
     * 
     */
    var Tip = function () {
        this.constructor.superClass.constructor.apply(this, arguments);
    };
    T.inherits(Tip, Control);

    /**
     * 提示框消失的延迟时间，单位毫秒
     * 
     * @public
     * @type {number}
     */
    Tip.HIDE_DELAY = 500;


    T.extend(Tip.prototype,
    /** @lends module:Tip.prototype */ {

        type: 'Tip',

        /**
         * 控件配置项
         * 
         * @name module:Tip#options
         * @type {Object}
         * @property {boolean} disabled 控件的不可用状态
         * @property {string|HTMLElement} main 控件渲染容器
         * @property {boolean|string=} arrow 提示框的箭头参数，默认为false，不带箭头
         * 可以初始化时通过指定arrow属性为“1”开启箭头模式，也可以手动指定箭头方向：
         * tr | rt | rb | br | bl | lb | lt | tl | tc | rc | bc | lc
         * 也可通过在 triggers 上设置 data-tooltips来指定
         * @property {number=} hideDelay 提示框消失的延迟时间，默认值为Tip.HIDE_DELAY
         * @property {string=} mode 提示的显示模式，over|click|auto。默认为over
         * @property {string=} title 提示的标题信息，默认为null
         * @property {string} content 提示的内容信息
         * @property {string} prefix 控件class前缀，同时将作为main的class之一
         * @property {string} triggers 自动绑定本控件功能的class
         * @property {string} flag 标识作为trigger的class
         * @property {Object.<string, number>} offset 浮层显示的偏移量
         * @property {number} offset.x x 轴方向偏移量
         * @property {number} offset.y y轴方向偏移量
         * @property {string} tpl 浮层内部HTML模板
         */
        options: {

            // 提示框的不可用状态，默认为false。处于不可用状态的提示框不会出现。
            disabled: false,

            // 控件渲染主容器
            main: '',

            // 提示框的箭头参数，默认为false，不带箭头
            // 可以初始化时通过指定arrow属性为“1”开启箭头模式
            // 也可以手动指定箭头方向：
            // tr | rt | rb | br | bl | lb | lt | tl | tc | rc | bc | lc。
            // 也可通过在 triggers 上设置 data-tooltips来指定
            arrow: false,

            // 提示框消失的延迟时间，默认值为Tip.HIDE_DELAY
            hideDelay: 0,

            // 提示的显示模式，over|click|auto。默认为over
            mode: 'over',

            // 提示的标题信息，默认为null
            title: null,

            // 提示的内容信息
            content: '',

            // 控件class前缀，同时将作为main的class之一
            prefix: 'ecl-hotel-ui-tip',

            // 自动绑定本控件功能的class
            triggers: 'tooltips',

            // 标识作为trigger的class
            flag: '_ecui_tips',

            // 浮层显示的偏移量
            offset: {

                // x 轴方向偏移量
                x: 0,

                // y 轴方向偏移量
                y: 0
            },

            // 控件模板
            tpl: ''
            + '<div class="{prefix}-arrow {prefix}-arrow-top">'
            +   '<em></em>'
            +   '<ins></ins>'
            + '</div>'
            + '<div class="{prefix}-title"></div>'
            + '<div class="{prefix}-body"></div>'
        },

        /**
         * 需要绑定 this 的方法名，多个方法以半角逗号分开
         * 
         * @type {string}
         */
        binds: 'onResize, onShow, onHide, hide',

        /**
         * 控件初始化
         * 
         * @private
         * @param {Object} options 控件配置项
         * @see module:Tip#options
         */
        init: function (options) {
            options = this.setOptions(options);
            options.hideDelay = options.hideDelay || Tip.HIDE_DELAY;

            this.disabled  = options.disabled;
            this.title     = options.title;
            this.content   = options.content;

            var prefix = options.prefix;
            var main   = this.main = document.createElement('div');

            main.className  = prefix;
            main.innerHTML  = options.tpl.replace(/{prefix}/g, prefix);
            main.style.left = '-2000px';

            this.events = {
                over: {
                    on: 'mouseenter', 
                    un: 'mouseleave'
                },
                click: {
                    on: 'click',
                    un: 'click'
                }
            }[options.mode];
        },


        /**
         * 绘制控件
         * 
         * @fires module:Tip#click
         */
        render: function () {

            var me      = this;
            var main    = this.main;
            var options = this.options;
            var events  = this.events;

            if (!this.rendered) {
                this.rendered = true;

                document.body.appendChild(main);

                T.on(main, 'click', function (e) {

                    /**
                     * @event module:Tip#click
                     * @type {Object}
                     * @property {DOMEvent} event 事件源对象
                     */
                    me.fire('click', {event: e});
                });

                T.on(main, 'mouseenter', function () {
                    me.clear();
                });

                T.on(main, 'mouseleave', function () {
                    me.clear();
                    me.timer = setTimeout(me.hide, options.hideDelay);
                });

                var elements = this.elements = {};
                var prefix = options.prefix + '-';

                T.each('arrow,title,body'.split(','), function (name) {
                    elements[name] = T.q(prefix + name, main)[0];
                });

                this.addTriggers(options.triggers);

            }

            if (!events && this.triggers) {
                this.show(this.triggers[0]);
            }
        },

        /**
         * 增加触发tips的DOM
         * 
         * @param {string|HTMLElement|HTMLCollection|Array} triggers 
         * className/dom节点/dom集合或dom节点数组
         */
        addTriggers: function (triggers) {
            var me      = this;
            var options = this.options;
            var events  = this.events;
            var flag    = options.flag;

            this.triggers = 
                typeof triggers === 'string'
                ? T.q(options.triggers)
                : (triggers.length ? triggers : [triggers]);

            if (events) {
                T.each(this.triggers, function (trigger) {
                    T.addClass(trigger, flag);
                    T.on(trigger, events.on, me.onShow);
                    T.on(trigger, events.un, me.onHide);
                });
            }
        },

        /**
         * 清除各种定时器
         * 
         */
        clear: function () {
            clearTimeout(this.timer);
            clearTimeout(this.resizeTimer);
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
                me.show(me.current);
            }, 100);
        },


        /**
         * 显示浮层前处理
         * 
         * @private
         * @param {DOMEvent} e DOM 事件对象
         * @fires module:Tip#beforeShow 显示前事件
         */
        onShow: function (e) {
            var target = getTarget(e, this.options.flag);
           
            this.clear();

            if (!target || this.current === target) {
                return;
            }

            this.current = target;

            /**
             * @event module:Tip#beforeShow
             * @type {Object}
             * @property {HTMLElement} target 事件源 DOM 对象
             * @property {DOMEvent} e 事件源对象
             */
            this.fire('beforeShow', { target: target, event: e});

            this.show(target);
        },


        /**
         * 隐藏浮层前处理
         * 
         * @private
         */
        onHide: function () {
            var options = this.options;

            this.clear();
            
            if (options.hideDelay) {
                this.timer = setTimeout(this.hide, options.hideDelay);
            }
            else {
                this.hide();
            }
        },

        /**
         * 显示浮层
         * 
         * @param {?HTMLElement=} target 触发显示浮层的节点
         * @fires module:Tip#show 显示事件
         */
        show: function (target) {
            var options  = this.options;
            var events   = this.events;
            var elements = this.elements;
 
            this.clear();
           
            this.current = target;

            if (events && target) {
                T.on(target, events.un, this.onHide);
            }

            T.on(window, 'resize', this.onResize);

            elements.title.innerHTML = this.title || '';
            elements.body.innerHTML  = this.content;

            T[this.title ? 'show' : 'hide'](elements.title);

            if (!options.arrow) {
                T.hide(elements.arrow);
            }

            this.computePosition();

            /**
             * @event module:Tip#show
             * @type {Object}
             * @property {HTMLElement} target 事件源 DOM 对象
             */
            this.fire('show', {target: target});

        },

        /**
         * 隐藏浮层
         * 
         * @fires module:Tip#hide 隐藏事件
         */
        hide: function () {
            var main    = this.main;

            this.clear();

            var arrow = this.elements.arrow;
            DOM.setStyle(main, 'left', - main.offsetWidth - arrow.offsetWidth);

            this.current = null;
            T.un(window, 'resize', this.onResize);

            /**
             * @event module:Tip#hide
             */
            this.fire('hide');
        },

        /**
         * 判断提示层是否可见
         * 
         * @return {boolean} 可见的状态
         */
        isVisible: function() {

            return !!this.current;

        },

        /**
         * 设置提示层的标题部分内容
         * 
         * 如果参数为空，则隐藏提示层的标题部分
         * 
         * @param {string} html
         */
        setTitle: function(html) {
            this.title = html || '';

            var elements = this.elements
            elements.title.innerHTML = this.title;
            T[this.title ? 'show' : 'hide'](elements.title);
        },

        /**
         * 设置提示层显示的内容
         * 
         * @param {string} html 要提示的内容的HTML
         */
        setContent: function(html) {
            this.content = html || '';
            this.elements.body.innerHTML = this.content; 
        },

        /**
         * 计算浮层及箭头显示位置
         * 
         * @private
         */
        computePosition: function () {
            var options      = this.options;
            var target       = this.current;
            var main         = this.main;
            var arrow        = this.elements.arrow;
            var dir          = options.arrow;
            var position     = DOM.getPosition(target);
            var prefix       = options.prefix + '-arrow';

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

            // 箭头宽高
            // XXX: 如果通过 tpl 修改了控件模板，
            // 或者针对箭头部分改了样式，此处得到结果不对或者报错
            var arrowWidth   = arrow.firstChild.offsetWidth;
            var arrowHeight  = arrow.firstChild.offsetHeight;

            // 视窗范围
            var scrollTop    = PAGE.getScrollTop();
            var scrollLeft   = PAGE.getScrollLeft();
            var scrollRight  = scrollLeft + PAGE.getViewWidth();
            var scrollBottom = scrollTop + PAGE.getViewHeight();

            // 属性配置优于实例配置
            var dirFromAttr = target.getAttribute('data-tooltips');
            if (dirFromAttr) {
                dir = /[trblc]{2}/.test(dirFromAttr) ? dirFromAttr : '1';
            }

            var second, first;

            // 未指定方向时自动按下右上左顺序计算可用方向（以不超出视窗为原则）
            if (!dir || dir === '1') {

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
                if (bottom + arrowHeight + mainHeight <= scrollBottom) {
                    first = 'b';
                    second = horiz;
                }

                // 如果提示层在目标右侧未超出视窗
                else if (right + mainWidth + arrowWidth <= scrollRight) {
                    first = 'r';
                    second = vertical;
                }

                // 如果提示层在目标上边未超出视窗
                else if (top - mainHeight - arrowHeight >= scrollTop) {
                    first = 't';
                    second = horiz;
                }

                // 如果提示层在目标左侧未超出视窗
                else if (left - mainWidth - arrowWidth >= scrollLeft) {
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

            var lrtb   = { l: 'left', r: 'right', t: 'top', b: 'bottom' };
            var offset = options.offset;

            arrow.className = prefix + ' ' + prefix + '-' + lrtb[first];

            // 改变箭头方向后需要校准箭头宽高
            // XXX: 如果通过 tpl 修改了控件模板，
            // 或者针对箭头部分改了样式，此处得到结果不对或者报错
            arrowWidth  = arrow.firstChild.offsetWidth;
            arrowHeight = arrow.firstChild.offsetHeight;

            var middleLeft = (mainWidth - arrowWidth) / 2;
            var middleTop  = (mainHeight - arrowHeight) / 2;

            // 提示层在目标上部或下部显示时的定位处理
            if ({t: 1, b: 1}[first]) {
                left = {
                    l: left,
                    c: center - (mainWidth / 2),
                    r: right - mainWidth
                }[second];

                top = {
                    t: top - arrowHeight - mainHeight - offset.y,
                    b: bottom + arrowHeight + offset.y
                }[first];

                DOM.setStyle(
                    arrow,
                    'left',

                    // 在目标宽于提示层或 dir 为 tc 或 bc 时，箭头相对提示层水平居中
                    width > mainWidth || second === 'c'
                        ? middleLeft
                        : {
                            l: (width - arrowWidth) / 2,
                            r: (mainWidth - (width - arrowWidth) / 2)
                        }[second]
                );
                DOM.setStyle(arrow, 'top', '');

            }

            // 提示层在目标左边或右边显示时的定位处理
            else if ({l: 1, r: 1}[first]) {
                top = {
                    t: top,
                    c: middle - (mainHeight / 2),
                    b: bottom - mainHeight
                }[second];

                left = {
                    l: left - arrowWidth - mainWidth - offset.x,
                    r: right + arrowWidth + offset.x
                }[first];

                DOM.setStyle(
                    arrow,
                    'top',

                    // 在目标高于提示层或 dir 为 lc 或 rc 时，箭头相对提示层垂直居中
                    height > mainHeight || second === 'c'
                        ? middleTop
                        : {
                            t: (height - arrowHeight) / 2,
                            b: (mainHeight - (height - arrowHeight) / 2)
                        }[second]
                );
                DOM.setStyle(arrow, 'left', '');

            }

            DOM.setStyles(main, {left: left, top: top});

        }

    });

    return Tip;
});
