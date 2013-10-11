/**
 * ZXUI (Zhixin UI)
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file 弹框组件
 * @author mengke(mengke01@baidu.com)
 */

define(function (require) {

    var lib = require('./lib');
    var Control = require('./Control');

    /**
     * GUID计数
     * 
     * @type {number}
     */
    var counter = 0;
    
    /**
     * 获得GUID的函数
     * 
     * @return {string} 一个不重复的guid字符串
     */
    function guid(tag) {
        return 'ui-dlg-' + (tag ? tag + '-' : '') + (counter++);
    }    

    /**
     * 移除当前的元素
     * 
     * @param {[type]} domElement 当前元素
     */
    function remove(domElement) {
        domElement && domElement.parentNode.removeChild(domElement);
    }

    /**
     * 对目标字符串进行格式化
     * @see tangram#baidu.string.format
     * 
     * @function
     * @grammar baidu.string.format(source, opts)
     * @param {string} source 目标字符串
     * @param {Object|string...} opts 提供相应数据的对象或多个字符串
     * @remark
     * 
        opts参数为“Object”时，替换目标字符串中的#{property name}部分。<br>
        opts为“string...”时，替换目标字符串中的#{0}、#{1}...部分。
     * @meta standard
     *  
     * @returns {string} 格式化后的字符串
     */
    function format(source, opts) {
        source = String(source);
        var data = Array.prototype.slice.call(arguments,1), 
            toString = Object.prototype.toString;
        if(data.length){
            data = data.length === 1 ? 
                /* ie 下 Object.prototype.toString.call(null) 
                    == '[object Object]' */
                (opts !== null && (
                    /\[object Array\]|\[object Object\]/
                    .test(toString.call(opts))) ? opts : data) 
                : data;
            return source.replace(/#\{(.+?)\}/g, function (match, key){
                var replacer = data[key];
                // chrome 下 typeof /a/ == 'function'
                if('[object Function]' === toString.call(replacer)){
                    replacer = replacer(key);
                }
                return ('undefined' === typeof replacer ? '' : replacer);
            });
        }
        return source;
    }


    /**
     * 遮罩层管理类，提供遮罩层的操作函数
     * 
     * @type {Object}
     */
    var Mask = function(opts) {
        this._init(opts);
    };

    Mask.prototype = {

        /**
         * 初始化函数
         * 
         * @private
         * @param {Object} opts 初始化选项
         * @see module:Mask.create
         */
        _init: function(opts) {
            var div = document.createElement('div');
            div.id = opts.id;
            div.className = opts.className;
            lib.setStyles(div, opts.styles);
            document.body.appendChild(div);
            this.mask = div;
            Mask.curMasks++;

            if( 6 === lib.browser.ie && !Mask.ie6frame) {
                Mask.ie6frame = document.createElement(
                    '<iframe'
                    + ' src="about:blank"'
                    + ' frameborder="0"'
                    + ' style="position:absolute;left:0;top:0;z-index:1;'
                    + 'filter:alpha(opacity=0)"'
                    + '></iframe>'
                );
                document.body.appendChild(Mask.ie6frame);
            }
        },

        /**
         * 重新绘制遮盖层的位置
         * 
         * @see esui.2.1.2#esui.Mask
         */
        repaint: function () {
            var width = Math.max(
                document.documentElement.clientWidth,
                Math.max(
                    document.body.scrollWidth,
                    document.documentElement.scrollWidth
                    )
            );

            var height = Math.max(
                document.documentElement.clientHeight,
                Math.max(
                    document.body.scrollHeight,
                    document.documentElement.scrollHeight
                    )
            );

            this.mask.style.width  = width + 'px';
            this.mask.style.height = height + 'px';

            if(Mask.ie6frame) {
                Mask.ie6frame.style.width  = width + 'px';
                Mask.ie6frame.style.height = height + 'px';
            }
        },

        /**
         * 显示一个遮罩层
         * 
         */
        show: function() {
            if(Mask.ie6frame) {
                Mask.ie6frame.style.zIndex = this.mask.style.zIndex - 1;
                lib.show(Mask.ie6frame);
            }
            lib.show(this.mask);
        },

        /**
         * 隐藏一个遮罩层
         * 
         */
        hide: function() {
            if(Mask.ie6frame) {
                lib.hide(Mask.ie6frame);
            }
            lib.hide(this.mask);
        },

        /**
         * 注销一个遮罩层
         * 
         */
        dispose: function() {
            document.body.removeChild(this.mask);
            Mask.curMasks--;

            if(Mask.curMasks <= 0 && Mask.ie6frame) {
               document.body.removeChild(Mask.ie6frame);
               Mask.curMasks = 0;
               Mask.ie6frame = null;
            }
        }
    };

    /**
     * 当前已经生成的Mask个数
     * 
     * @type {number}
     */
    Mask.curMasks = 0;

    /**
     * 创建一个遮罩层
     * 
     * @param {Object} opts 遮罩选项
     * @param {string} opts.id 编号
     * @param {string} opts.className 类别名称
     * @param {Object} opts.styles 样式集合
     * @return {HTMLElement} 遮罩元素
     */
    Mask.create = function(opts) {
        return new Mask(opts);
    };

    /**
     * 对话框
     * 
     * @extends module:Control
     * @requires lib
     * @requires Control
     * @exports Dialog
     * @example
     * new Dialog({
     *     main: '',
     *     content: '内容',
     *     footer: '底部',
     *     width: '600px',
     *     title: '标题',
     *     top: '50px',
     *     left: '',
     *     fixed: 1,
     *     showMask: 1,
     *     leve: 10
     * 
     *  }).render();    
     */
    var Dialog = Control.extend(/** @lends module:Dialog.prototype */{

        /**
         * 对话框的遮罩层管理类
         * 
         * @name module:Dialog#Mask 遮罩层管理类
         * 
         * @type {Object}
         */
        Mask: Mask,

        /**
         * 控件类型标识
         * 
         * @type {string}
         * @override
         * @private
         */
        type: 'Dialog',

        /**
         * 控件配置项
         * 
         * @name module:Dialog#options
         * @type {Object}
         * @property {(string | HTMLElement)} options.main 控件渲染容器
         * @property {string} options.prefix 控件class前缀，同时将作为main的class之一
         * @property {string} options.title 控件标题
         * @property {string} options.content 控件内容
         * @property {string} options.skin 控件的皮肤
         * @property {string} options.width 控件的默认宽度
         * @property {string} options.top 控件距视窗上边缘的高度，默认为auto，会使组件相对于视窗垂直居中
         * @property {string} options.left 控件距视窗左边缘的宽度，默认为auto，会使组件相对于视窗水平居中
         * @property {string} options.fixed 是否固定，不随视窗滚动
         * @property {string} options.showMask 是否显示覆盖层
         * @property {string} options.level 当前dialog的z-index
         * @property {string} options.dragable 是否可以拖动
         * @property {string} options.tpl 默认的框架模板
         * @property {string} options.footer 控件脚注

         * @private
         */
        options: {

            // 控件渲染主容器,会将容器内的html部分迁移到dialog的body中
            main: '',

            // 控件class前缀，同时将作为main的class之一
            prefix: 'ecl-ui-dialog',

            //控件标题
            title: '',

            //控件内容，如果没有指定主渲染容器，则content内容塞到dialog的body中
            content: '',

            //控件脚注
            footer: '',

            //控件的皮肤
            skin: '',

            //控件的默认宽度
            width: '600px',

            //控件距视窗上边缘的高度，默认为auto，会使组件相对于视窗垂直居中
            top: '',

            //控件距视窗左边缘的宽度，默认为auto，会使组件相对于视窗水平居中
            left: '',

            //是否固定，不随视窗滚动，不支持IE6，IE6自动设置为fixed=0
            fixed: 1,

            //是否显示覆盖层
            showMask: 1,

            //当前dialog的z-index
            level: 10,

            //是否可以拖动
            dragable: 1,

            //模板框架
            tpl:  ''
                + '<div id="#{id}" ui-type="#{type}" '
                +   'style="display:none;width:#{width};'
                + 'position:#{position};top:#{top};z-index:#{level}" '
                +   'class="#{dialogClass}">'
                +   '<div class="#{closeClass}">×</div>'
                +   '<div class="#{headerClass}">#{title}</div>'
                +   '<div class="#{bodyClass}">#{content}</div>'
                +   '<div class="#{footerClass}">#{footer}</div>'
                + '</div>'
        },

        /**
         * 需要绑定 this 的方法名，多个方法以半角逗号分开
         * 
         * @type {string}
         * @private
         */
        binds: 'onResize, onShow, onHide',

        /**
         * 控件初始化
         * 
         * @param {Object} options 控件配置项
         * @see module:Control#options
         * @private
         */
        init: function (options) {
            this.disabled  = options.disabled;
        },


        /**
         * 获得指定dialog模块的dom元素
         *  
         * @param {string} name 模块名字
         * @return {HTMLElement} 模块的DOM元素
         * @private
         */
        getDom: function(name) {
            return lib.q( this.options.prefix + '-' + name, this.main)[0];
        },

        /**
         * 根据名字构建的css class名称
         *  
         * @param {string} name 模块名字
         * @return {string} 构建的class名称
         * @private
         */
        getClass: function(name) {
            name = name ? '-' + name : '';
            var skin = this.options.skin;
            return this.options.prefix + name + (skin ? ' ' + skin + name : '');
        },

        /**
         * 渲染主框架
         * 
         * @private
         */
        _renderDOM: function() {
            var opt = this.options;
            var data = {
                id: this.id,
                type: this.type,
                width: opt.width,
                top: opt.top,
                position: opt.fixed ? 'fixed' : 'absolute',
                level: opt.level,
                dialogClass: this.getClass(),
                closeClass: this.getClass('close'),
                headerClass: this.getClass('header'),
                bodyClass: this.getClass('body'),
                footerClass: this.getClass('footer'),

                title: opt.title,
                content: opt.content,
                footer: opt.footer
            };

            //渲染主框架内容
            var html = format(this.options.tpl, data);
            document.body.insertAdjacentHTML('beforeEnd', html);
            this.main = lib.g(this.id);

            //如果显示mask，则需要创建mask对象
            if(this.options.showMask) {
                this.mask = Mask.create({
                    id: 'mask-' + this.id,
                    className: this.getClass('mask'),
                    styles: {
                        zIndex: this.options.level - 1
                    }
                });
            }
        },

        /**
         * 绑定组件相关的dom事件
         * 
         * @private
         */
        _bind: function() {
            var me = this;
            //绑定关闭按钮
            lib.on(this.getDom('close'), 'click',
                me.closeHandler = function(e) {
                    me.onHide(e);
                }
            );

        },

        /**
         * 获得头部区域的dom元素
         * 
         * @return {HTMLElement} 模块的DOM元素
         * @private
         */
        getHeaderDom: function() {
            return this.getDom('header');
        },

        /**
         * 获得内容区域的dom元素
         * 
         * @return {HTMLElement} 模块的DOM元素
         * @private
         */
        getBodyDom: function() {
            return this.getDom('body');
        },

        /**
         * 获得尾部区域的dom元素
         * 
         * @return {HTMLElement} 模块的DOM元素
         * @private
         */
        getFooterDom: function() {
            return this.getDom('footer');
        },

        /**
         * 设置dialog的标题
         * 
         * @param {string} title 对话框的标题
         * @public
         */
        setTitle: function(content) {
            this.getHeaderDom().innerHTML = content;
        },

        /**
         * 设置dialog的主体内容，可以是HTML内容  
         * 
         * @param {string} content 内容字符串
         * @public
         */
        setContent: function(content) {
            this.getBodyDom().innerHTML = content;
        },

        /**
         * 设置dialog的页脚内容
         * 
         * @param {string} content 内容字符串
         * @public
         */
        setFooter: function(content) {
            this.getBodyDom().innerHTML = content;
        },

        /**
         * 调整弹窗位置
         * @private
         */
        adjustPos: function() {
            var left = this.options.left;
            var top = this.options.top;

            //如果fixed则需要修正下margin-left
            if(this.options.fixed) {
                var cssOpt = {
                    left: left,
                    top: top
                };

                if(!left) {
                    cssOpt.left = '50%';
                    cssOpt.marginLeft = (-this.main.offsetWidth/2) + 'px';
                }

                if(!top) {
                    cssOpt.top = '50%';
                    cssOpt.marginTop = (-this.main.offsetHeight/2) + 'px';
                }

                lib.setStyles(this.main, cssOpt);
            }

            //absolute则需要动态计算left，top使dialog在视窗的指定位置
            else {
                if(!left) {
                    left = (
                            document.body.scrollLeft 
                            + (lib.getViewWidth() - this.main.offsetWidth)/2
                        ) + 'px';
                }
                
                if(!top) {
                    top = (
                            document.body.scrollTop 
                            + (lib.getViewHeight() 
                            - this.main.offsetHeight)/2
                        ) + 'px';
                }

                lib.setStyles(this.main, {
                    position : 'absolute',
                    left: left,
                    top: top
                });
            }

            //修正mask的遮罩
            this.mask && this.mask.repaint();
        },


        /**
         * 当视窗大小改变的时候，调整窗口位置
         * @private
         */
        onResize: function() {
            var me = this;
            clearTimeout(me.resizeTimer);
            me.resizeTimer = setTimeout(function () {
                me.adjustPos();
            }, 100);
        },

        /**
         * 当触发展示的时候
         * @fires module:Dialog#beforeshow
         * @private
         */
        onShow: function(e) {
            var me = this;

            /**
             * @event module:Dialog#beforeshow
             * @type {Object}
             * @property {DOMEvent} event 事件源对象
             */
            me.fire('beforeshow', { event: e });
            me.show();
        },

        /**
         * 当触发隐藏的时候
         * @fires module:Dialog#beforehide
         * @private
         */
        onHide: function(e) {

            /**
             * @event module:Dialog#beforehide
             * @type {Object}
             * @property {DOMEvent} event 事件源对象
             */
            this.fire('beforehide', { event: e });
            this.hide();
        },

        /**
         * 显示组件
         * @public
         * @fires module:Dialog#show
         */
        show: function() {
            var me = this;

            if(!me.options.fixed) {
                lib.on(window, 'resize', me.onResize);
            }

            this.mask && this.mask.show();

            lib.show(me.main);
            me.adjustPos();

            /**
             * @event module:Dialog#show
             */
            me.fire('show');

            return this;
        },


        /**
         * 隐藏组件
         * @public
         * 
         * @fires module:Dialog#hide
         */
        hide: function() {

            this.mask && this.mask.hide();

            lib.hide(this.main);

            /**
             * @event module:Dialog#hide
             */
            this.fire('hide');

            //注销resize
            lib.un(window, 'resize', this.onResize);
            clearTimeout(this.resizeTimer);
            return this;
        },

        /**
         * 绘制控件
         * 
         * @override
         * @public
         */
        render: function () {
            var options = this.options;
            if (!this.rendered) {

                //TODO IE6浏览器不支持fixed定位
                if(options.fixed  && 6 === lib.browser.ie) {
                   options.fixed = 0;
                }

                this.id = guid();
                this._renderDOM();

                //设置渲染的内容
                if(options.main) {
                    var ctl =  lib.g(options.main);
                    ctl && this.getBodyDom().appendChild(ctl);
                }

                this._bind();
                this.rendered = true;
            }
            return this;
        },

        /**
         * 销毁，注销事件，解除引用
         * 
         * @public
         * @fires module:Dialog#dispose
         */
        dispose: function() {

            /**
             * @event module:Dialog#dispose
             */
            this.fire('dispose');

            this.un('beforeshow');
            this.un('beforehide');
            this.un('show');
            this.un('hide');
            //注销dom事件
            lib.un(this.getDom('close'), 'click', this.closeHandler);
            lib.un(window, 'resize', this.onResize);
            clearTimeout(this.resizeTimer);

            remove(this.main);
            this.main = null;

            this.mask && this.mask.dispose();

            this.un('dispose');
        }
    });

    /**
     * 获得guid的函数
     * 
     * @type {string}
     * @static
     */
    Dialog.guid = guid;

    return Dialog;
});
