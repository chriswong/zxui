/**
 * Copyright 2013 Baidu Inc. All rights reserved.
 * @file  弹出层
 * @author  chris(wfsr@foxmail.com)
 */
define(function (require) {

	var T = baidu;
    var DOM = T.dom;
    var PAGE = T.page;
    var Base = require('./control');

    /**
     * 弹出层控件
     * 
     * @constructor
     * @extends  Base
     */
    var Popup = function () {
        this.constructor.superClass.constructor.apply(this, arguments);
    }
    T.inherits(Popup, Base);


    T.extend(
    	Popup.prototype, 
    	/** @lends  Popup.prototype */{

    	type: 'Popup',

        /**
         * 控件配置项
         * 
         * @type {Object} options 配置项
         * @param {boolean} options.disabled 控件的不可用状态
         * @param {string|HTMLElement} options.main 控件渲染容器
         * @param {string|HTMLElement} options.target 计算弹出层相对位置的目标对象
         * @param {string} options.triggers 触发显示弹出层的节点
         * @param {string} options.content 提示的内容信息
         * @param {string} options.dir 弹出层相对 target 的位置，支持8个方向 @see Tip
         * @param {string} options.prefix 控件class前缀，同时将作为main的class之一
         * @param {Object.<string, number>} options.offset 弹出层显示的偏移量
         * @param {number} options.offset.x x 轴方向偏移量
         * @param {number} options.offset.y y轴方向偏移量
         */
    	options: {
            // 提示框的不可用状态，默认为false。处于不可用状态的提示框不会出现。
            disabled: false,

            // 控件渲染主容器
            main: '',

            // 计算弹出层相对位置的目标对象
            target: '',

            // 触发显示弹出层的节点class
            triggers: '',

            // 显示的内容
            content: '',

            // 弹出层显示在 trigger 的相对位置
            // 可选值：tr | rt | rb | br | bl | lb | lt | tl
            // 也可通过在 triggers 上设置 data-popup来指定
            dir: 'bl',

            // 控件class前缀，同时将作为main的class之一
            prefix: 'ecl-hotel-ui-popup',

            // 浮层显示的偏移量
            offset: {

                // x 轴方向偏移量
                x: 0,

                // y 轴方向偏移量
                y: 0
            }
    	},


        /**
         * 绑定 this 到实例方法
         * 
         * @type {string} 逗号分隔的方法名列表
         */
        binds: 'onResize, onShow, onHide',

        /**
         * 控件初始化
         * 
         * @private
         * @params {Object} options 配置项 @see Popup.prototype.options
         */
    	init: function (options) {
            options = this.setOptions(options);

            this.disabled  = options.disabled;
            this.content   = options.content;

            if ( options.target ) {
                this.target = T.g(options.target);                
            }

            var prefix = options.prefix;
            var main   = this.main = document.createElement('div');

            main.className  = prefix;
            main.style.left = '-2000px';

            var me       = this;
            var triggers = options.triggers;

            if ( T.isString(triggers) ) {
                triggers = T.q(options.triggers);
            }

            T.each(triggers, function (trigger) {
                T.on(trigger, 'click', me.onShow);
            });

            this.triggers = triggers;
    	},

        /**
         * 绘制控件
         * 
         */
    	render: function () {
    		var options = this.options;
            var main = this.main;

            if ( !this.rendered ) {
                this.rendered = true;
                document.body.appendChild(main);

                var me = this;

                T.on(main, 'click', function (e) {
                    me.fire('click', { event: e });
                });

            }

            main.innerHTML = this.content;
    	},

        /**
         * 浏览器可视尺寸改变时处理
         * 
         * @private
         * @param {DOMEvent} e DOM 事件对象
         */
        onResize: function (e) {
            clearTimeout(this.resizeTimer);

            var me = this;

            this.resizeTimer = setTimeout( function () {
                me.show();
            }, 100);
        },

        /**
         * 显示浮层前处理
         * 
         * @private
         * @param {DOMEvent} e DOM 事件对象
         */
        onShow: function (e) {

            var oldTarget = this.target;
            this.fire('beforeShow', { event: e });

            if ( oldTarget != this.target) {
                this.hide();
            }

            this.show();

            var me = this;
            this.trigger = T.event.getTarget(e);
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
            var main = this.main;

            if ( main === target || DOM.contains(main, target) ) {
                return;
            }

            this.hide();

            clearTimeout(this.resizeTimer);
        },

        /**
         * 显示浮层
         * 
         * @param {?HTMLElement=} target 触发显示浮层的节点
         */
    	show: function () {
    		var main = this.main;

            this.computePosition();

            this.fire('show');
    	},

        /**
         * 隐藏浮层
         * 
         */
    	hide: function () {
    		this.main.style.left = '-2000px';

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
            var options = this.options;
            var target = this.target || this.triggers[0];
            var main = this.main;
            var dir = options.dir;
            var position = DOM.getPosition(target);

            var top = position.top;
            var left = position.left;

            var width = target.offsetWidth;
            var height = target.offsetHeight;

            var right = left + width;
            var bottom = top + height;

            var mainWidth = main.offsetWidth;
            var mainHeight = main.offsetHeight;

            var scrollTop = PAGE.getScrollTop();
            var scrollLeft = PAGE.getScrollLeft();
            var scrollRight = scrollLeft + PAGE.getViewWidth();
            var scrollBottom = scrollTop + PAGE.getViewHeight();

            // 属性配置优于实例配置
            var dirFromAttr = target.getAttribute('data-popup');
            if ( dirFromAttr ) {
                dir = /[trbl]{2}/.test(dirFromAttr) ? dirFromAttr : '1';
            }

            var second, first;

            // 未指定方向时自动按下右上左顺序计算可用方向
            if ( dir === 'auto') {
                if ( bottom + mainHeight <= scrollBottom ) {
                    first = 'b';
                    second = left + mainWidth > scrollRight ? 'r' : 'l';
                }
                else if ( right + mainWidth <= scrollRight ) {
                    first = 'r';
                    second = top + mainHeight > scrollBottom ? 'b' : 't';
                }
                else if ( top - mainHeight >= scrollTop ) {
                    first = 't';
                    second = left + mainWidth > scrollRight ? 'r' : 'l';
                }
                else if ( left - mainWidth >= scrollLeft ) {
                    first = 'l';
                    second = top + mainHeight > scrollBottom ? 'b' : 't';
                }

                dir = first + second;
            }
            else {
                first = dir.charAt(0);
                second = dir.charAt(1);
            }

            var offset = options.offset;

            if ( first === 'b' || first === 't' ) {
                left = second === 'l' 
                       ? left
                       : right - mainWidth;

                top = first === 'b'
                       ? bottom
                       : top - mainHeight;

                top += first === 'b' ? offset.y : -offset.y;
            }
            else if ( first === 'l' || first === 'r' ) {
                top = second === 't'
                      ? top
                      : bottom - mainHeight;

                left = first === 'l'
                       ? left - mainWidth
                       : right;

                left += first === 'r' ? offset.x : -offset.x;
            }

            DOM.setStyles(main, {left: left, top: top});

        }

    });

    return Popup;

});