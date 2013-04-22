/**
 * Copyright 2013 Baidu Inc. All rights reserved.
 * @file  国内城市选择提示层
 * @author  chris(wfsr@foxmail.com)
 */

define(function (require) {

    var T = baidu;
    var Control = require('./control');
    var Popup = require('./popup');
    
    /**
     * 国内城市选择控件
     * 
     * @constructor
     * @extends module:Control
     * @requires Control
     * @requires Popup
     * @exports City
     * @example
     * &lt;input type="text" class="input triggers" /&gt;
     * &lt;input type="button" value="click" class="triggers" /&gt;
     * new City({
     *     triggers: '.triggers',
     *     target: '.input'
     *  }).render();
     */
    var City = function () {
        this.constructor.superClass.constructor.apply(this, arguments);
    };
    T.inherits(City, Control);

    T.extend(City.prototype,
    /** @lends module:City.prototype */ {

        type: 'City',

        /**
         * 控件配置项
         * 
         * @name module:City#options
         * @see module:Popup#options
         * @type {Object}
         * @property {boolean} disabled 控件的不可用状态
         * @property {string|HTMLElement} main 控件渲染容器
         * @property {string} prefix 控件class前缀，同时将作为main的class之一
         * @property {number} index 默认激活的标签索引
         * @property {string} activeClass 激活标签、内容的class
         * @property {boolean} autoFill 是否自动填充默认城市数据(机票可用城市数据)
         * @property {?string} hideCities 需要隐藏的城市
         */
        options: {

            // 提示框的不可用状态，默认为false。处于不可用状态的提示框不会出现。
            disabled: false,

            // 控件渲染主容器
            main: '',

            // 控件class前缀，同时将作为main的class之一
            prefix: 'ecl-hotel-ui-city',

            // 默认激活的标签索引
            index: 0,

            // 激活标签、内容的class
            activeClass: 'active',

            // 是否自动填充默认城市数据(机票可用城市数据)
            autoFill: true,

            // 需要隐藏的城市
            hideCities: null
        },

        /**
         * 需要绑定 this 的方法名，多个方法以半角逗号分开
         * 
         * @type {string}
         */
        binds: 'onClick,onBeforeShow',

        /**
         * 控件初始化
         * 
         * @private
         * @param {Object} options 控件配置项
         * @see City#options
         */
        init: function (options) {
            options       = this.setOptions(options);
            this.disabled = options.disabled;
            this.index    = options.index;

            var tabs = this.tabs = [];

            if (options.autoFill) {
                tabs.push('热门|'
                        + '上海,北京,广州,昆明,西安,成都,深圳,厦门,乌鲁木齐,南京,'
                        + '重庆,杭州,大连,长沙,海口,哈尔滨,青岛,沈阳,三亚,济南,'
                        + '武汉,郑州,贵阳,南宁,福州,天津,长春,石家庄,太原,兰州');

                tabs.push('A-G|'
                        + '安庆,阿勒泰,安康,鞍山,安顺,安阳,阿克苏,包头,蚌埠,北海,'
                        + '北京,百色,保山,博乐,长治,长春,长海,常州,昌都,朝阳,潮州,'
                        + '常德,长白山,成都,重庆,长沙,赤峰,大同,大连,达县,大足,东营,'
                        + '大庆,丹东,大理,敦煌,鄂尔多斯,恩施,二连浩特,佛山,福州,'
                        + '阜阳,富蕴,贵阳,桂林,广州,广元,赣州,格尔木,广汉,固原');

                tabs.push('H-L|'
                        + '呼和浩特,哈密,黑河,海拉尔,哈尔滨,海口,衡阳,黄山,杭州,'
                        + '邯郸,合肥,黄龙,汉中,和田,惠州,吉安,吉林,酒泉,鸡西,晋江,'
                        + '锦州,景德镇,嘉峪关,井冈山,济宁,九江,佳木斯,济南,喀什,'
                        + '昆明,康定,克拉玛依,库尔勒,喀纳斯,库车,兰州,洛阳,丽江,梁平,'
                        + '荔波,庐山,林芝,柳州,泸州,连云港,黎平,连城,拉萨,临沧,临沂');

                tabs.push('M-T|'
                        + '牡丹江,芒市,满洲里,绵阳,梅县,漠河,南京,南充,南宁,南阳,南通,'
                        + '那拉提,南昌,宁波,攀枝花,衢州,秦皇岛,庆阳,且末,齐齐哈尔,青岛,'
                        + '汕头,深圳,石家庄,三亚,沈阳,上海,思茅,鄯善,韶关,沙市,苏州,'
                        + '唐山,铜仁,通化,塔城,腾冲,台州,天水,天津,通辽,太原,吐鲁番');

                tabs.push('W-Z|'
                        + '威海,武汉,梧州,文山,无锡,潍坊,武夷山,乌兰浩特,温州,乌鲁木齐,'
                        + '芜湖,万州,乌海,兴义,西昌,厦门,香格里拉,西安,襄阳,西宁,'
                        + '锡林浩特,西双版纳,徐州,兴城,兴宁,邢台,义乌,永州,榆林,'
                        + '延安,运城,烟台,银川,宜昌,宜宾,盐城,延吉,玉树,伊宁,伊春,'
                        + '珠海,昭通,张家界,舟山,郑州,中卫,芷江,湛江,中甸,遵义');
            }
        },

        /**
         * 填充城市标签数据
         * 
         * @param {Array|string} tabs 城市数组，每项格式为"标签|城市A,城市B,城市C"
         *                       当参数为字符类型时仅作为一个城市标签项
         * @return {City} 当前City实例
         */
        fill: function (tabsOrItem) {
            var tabs = this.tabs;

            if (T.isString(tabsOrItem)) {
                tabs.push(tabsOrItem);
            }
            else {
                this.tabs = tabsOrItem;
            }

            return this;
        },


        /**
         * 绘制控件
         * 
         */
        render: function () {

            var options = this.options;

            if (!this.rendered) {
                this.rendered = true;

                var popup = this.popup = new Popup(this.srcOptions);

                popup.on('click', this.onClick);
                popup.on('beforeShow', this.onBeforeShow);
                
                this.main = popup.main;

                if (options.target) {
                    this.setTarget(T.g(options.target));
                }
            }

        },


        /**
         * 构建选单HTML
         * 
         */
        build: function () {
            var options = this.options;
            var prefix  = options.prefix;
            var index   = this.index;
            var active  = ' class="' + prefix + '-active"';
            var labels  = [];
            var panels  = [];

            labels.push('<span>热门</span>城市(可直接输入城市或城市拼音)');
            labels.push('<a href="#" class="' + prefix + '-close">X</a>');

            labels.push('<ul class="' + prefix + '-labels c-clearfix">');
            panels.push('<ul class="' + prefix + '-panels">');

            var comma = ',';
            var hideCities = options.hideCities;
            if (hideCities) {
                hideCities = comma + hideCities.replace(/\s+/g, '') + comma;
            }

            var makeLinks = function (cities) {
                var links = [];

                T.each(cities.split(comma), function (city) {
                    if (
                        !hideCities
                        || !~hideCities.indexOf(comma + city + comma)
                    ) {
                        links.push(''
                            + '<a href="#" title="' + city + '">'
                            + city
                            + '</a>'
                        );                        
                    }
                });

                return links.join('');
            };

            T.each(this.tabs, function (tab, i, start) {
                tab = tab.split('|');
                start = '<li data-idx="'
                    + i
                    + '"'
                    + (i === index ? active : '');
                labels.push(start + '>' + tab[0] + '</li>');
                panels.push(start + '>' + makeLinks(tab[1]) + '</li>');
            });

            labels.push('</ul>');
            panels.push('</ul>');

            return labels.join('') + panels.join('');
        },

        /**
         * 处理选单点击事件
         * 
         * @private
         * @param {Object} args 从 Popup 传来的事件对象
         * @fires module:City#click 点击事件
         */
        onClick: function (args) {
            var e = args.event;

            if (!e) {
                return;
            }
            var el     = T.event.getTarget(e);
            var tag    = el.tagName;
            var target = this.target;
            var index  = el.getAttribute('data-idx');

            switch (tag) {

            case 'A':
                T.event.preventDefault(e);

                this[el.className ? 'hide': 'pick'](el);

                break;

            case 'LI':

                if (index) {
                    this.change(index);

                    var text = el.innerHTML;
                    this.hinter.innerHTML = (index === '0' ? '' : '拼音') + text;
                }
                break;

            default:

                if (target) {
                    target.select();
                }
                break;

            }

            /**
             * @event module:City#click
             * @type {Object}
             * @property {DOMEvent} event 事件源对象
             */
            this.fire('click', args);
        },

        /**
         * 转发Popup的onBeforeShow事件
         * 
         * @private
         * @param {Object} arg 事件参数
         * @fires module:City#beforeShow 显示前事件
         */
        onBeforeShow: function (arg) {

            /**
             * @event module:City#beforeShow
             * @type {Object}
             * @property {DOMEvent} event 事件源对象
             */
            this.fire('beforeShow', arg);

            if (!this.labels) {
                var popup = this.popup;
                popup.content = this.build();
                popup.render();

                var main    = this.main;
                var list    = main.getElementsByTagName('ul');
                this.labels = list[0].getElementsByTagName('li');
                this.panels = list[1].getElementsByTagName('li');
                this.hinter = main.getElementsByTagName('span')[0];
            }
        },

        /**
         * 动态更新 target
         * 
         * @param {HTMLElement} target 新的 target 节点
         * @throws 如果 target 为非 Element 节点将抛出异常
         */
        setTarget: function (target) {
            if (!target || target.nodeType !== 1) {
                throw new Error('target 为 null 或非 Element 节点');
            }

            this.target = target;

            if (this.popup) {
                this.popup.target = target;
            }
        },

        /**
         * 选择城市
         * 
         * @private
         * @param {HTMLElement} el 点击的当前事件源对象
         * @fires module:City#pick
         */
        pick: function (el) {
            var value = el.innerHTML;
            var target = this.target;

            if (target) {
                if (target.type) {
                    target.value = value;
                    target.focus();
                }
                else {
                    target.innerHTML = value;
                }
            }

            /**
             * @event module:City#pick
             * @type {Object}
             * @property {string} value 选中的城市
             */
            this.fire('pick', { value: value });
            this.hide();
        },

        /**
         * 切换标签
         * 
         * @param {number} i 要切换到的目标标签索引
         */
        change: function (i) {
            var options     = this.options;
            var labels      = this.labels;
            var panels      = this.panels;
            var index       = this.index;
            var activeClass = options.prefix + '-' + options.activeClass;

            i |= 0;

            if (i !== index) {

                T.removeClass(labels[index], activeClass);
                T.removeClass(panels[index], activeClass);

                index = this.index = i;

                T.addClass(labels[index], activeClass);
                T.addClass(panels[index], activeClass);
            }
        },

        /**
         * 显示浮层
         * 
         * @param {?HTMLElement=} target 触发显示浮层的节点
         * @fires module:City#show 显示事件
         */
        show: function (target) {

            this.popup.show();

            /**
             * @event module:City#show
             * @type {Object}
             * @property {?HTMLElement=} target 触发显示浮层的节点
             */
            this.fire('show', {target: target});

        },

        /**
         * 隐藏浮层
         * 
         * @fires module:City#hide 隐藏事件
         */
        hide: function () {
            
            this.popup.hide();

            /**
             * @event module:City#hide
             */
            this.fire('hide');
        }

    });

    return City;
});
        