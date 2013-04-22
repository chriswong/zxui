/**
 * Copyright 2013 Baidu Inc. All rights reserved.
 * @file  比PC-UI WCal好用的日历控件
 * @author  chris(wfsr@foxmail.com)
 */

define(function (require) {

    var T = baidu;
    var Control = require('./control');
    var Popup = require('./popup');

    /**
     * 标准日期格式
     * 
     * @const
     * @type {string}
     */
    var DATE_FORMAT = 'yyyy-MM-dd';

    /**
     * 阻止事件冒泡
     * 
     * @param {DOMEvent} e 事件对象
     */
    function stopPropagation(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    }

    /**
     * 补齐数字位数
     * 
     * @param {number|string} n 需要补齐的数字
     * @return {string} 补齐两位后的字符
     */
    function pad(n) {
        return (n > 9 ? '' : '0') + n;
    }

    

    /**
     * 比PC-UI WCal好用的日历控件
     * 
     * @constructor
     * @extends module:Control
     * @requires module:Control
     * @requires Popup
     * @exports Calendar
     * @example
     * &lt;input type="text" class="input triggers" /&gt;
     * &lt;input type="button" value="click" class="triggers" /&gt;
     * new Calendar({
     *     dateFormat: 'yyyy-MM-dd(WW)',    // W为星期几，WW带周作前缀
     *     triggers: '.triggers',
     *     target: '.input'
     *  }).render();
     */
    var Calendar = function () {
        this.constructor.superClass.constructor.apply(this, arguments);
    };
    T.inherits(Calendar, Control);

    /**
     * 全局日期格式
     * 
     * @type {string}
     */
    Calendar.DATE_FORMAT = DATE_FORMAT;

    /**
     * 可选中的日期区间
     * 
     * @type {?Object}
     */
    Calendar.RANGE = null;


    /**
     * 每个月的HTML缓存
     * 
     * @private
     * @type {Object}
     */
    var cache = {};

    T.extend(Calendar.prototype,
    /** @lends module:Calendar.prototype */ {

        type: 'Calendar',

        /**
         * 控件配置项
         * 
         * @name module:Calendar#options
         * @see module:Popup#options
         * @type {Object}
         * @property {boolean} disabled 控件的不可用状态
         * @property {string|HTMLElement} main 控件渲染容器
         * @property {string} prefix 控件class前缀，同时将作为main的class之一
         * @property {string|HTMLElement} target 计算日历显示时相对位置的目标对象
         * @property {string} triggers 点击显示日历的节点
         * @property {string} dateFormat 日期显示的格式化方式
         * @property {?Object} range 可选中的日期区间
         * @property {?string} value 当前选中的日期
         * @property {Function} process 处理当前显示日历中的每一天，多用于节日样式
         * process(el, classList, dateString)
         * 执行时 this 指向当前实例，el 为当前日的dom节点(A标签)，
         * classList 为 el 即将要应用的class数组引用，dateString 为
         * yyyy-MM-dd格式的当前日期字符串
         * @property {number} monthes 同时显示几个月
         * @property {number} first 一周的起始日，0为周日，1为周一
         * @property {Object} lang 预设模板
         * @property {string} lang.week 对于 '周' 的称呼
         * @property {string} lang.days 一周对应的显示
         */
        options: {

            // 提示框的不可用状态，默认为false。处于不可用状态的提示框不会出现。
            disabled: false,

            // 控件渲染主容器
            main: '',

            // 控件class前缀，同时将作为main的class之一
            prefix: 'ecl-ui-cal',

            // 计算日历显示时相对位置的目标对象
            target: '',

            // 点击显示日历的节点
            triggers: '',

            // 日期显示的格式化方式
            dateFormat: '',

            // 可选中的日期区间
            range: null,

            // 当前选中的日期
            value: '',

            // 处理每一天的样式
            process: null,

            // 同时显示几个月
            monthes: 2,

            // 一周的起始日 0为周日，需要对应lang.days的顺序
            first: 0,

            // 一些模板
            lang: {

                // 对于 '周' 的称呼
                week: '周',

                // 星期对应的顺序表示
                days: '日,一,二,三,四,五,六'

            }
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
         * @see module:Calendar#options
         */
        init: function (options) {
            options = this.setOptions(options);

            this.disabled   = options.disabled;
            this.dateFormat = 
                options.dateFormat
                || Calendar.DATE_FORMAT
                || DATE_FORMAT;
            
            this.setRange(options.range || Calendar.RANGE);

            this.days  = options.lang.days.split(',');
            this.value = this.format(this.from(options.value));
        },

        /**
         * 解释日期类型
         * 
         * @param {string|Date} value 源日期字符串或对象
         * @param {string} format 日期格式
         * @return {Date} 解释到的日期对象
         */
        from: function (value, format) {
            format = format || this.dateFormat;
            if (T.isString(value)) {

                if (!value) {
                    return new Date();
                }

                format = format.split(/[^yMdW]+/i);
                value  = value.split(/\D+/);

                var map = {};

                for (var i = 0, l = format.length; i < l; i++) {
                    if (
                        format[i]
                        && value[i]
                        && (
                            format[i].length > 1
                            && value[i].length === format[i].length
                            || format[i].length === 1
                           )
                    ) {
                        map[format[i].toLowerCase()] = value[i];
                    }
                }
                var year  = map.yyyy
                    || map.y
                    || ((map.yy < 50 ? '20' : '19') + map.yy);

                var month = (map.m || map.mm) | 0;
                var date  = (map.d || map.dd) | 0; 
                return new Date(year | 0, month - 1, date);
            }

            return value;
        },

        /**
         * 格式化日期
         * 
         * @param {Date} date 源日期对象
         * @param {string=} format 日期格式，默认为当前实例的dateFormat
         * @return {string} 格式化后的日期字符串
         */
        format: function (date, format) {
            // 控件不包含时间，所以不存在大小写区别
            format = (format || this.dateFormat).toLowerCase();

            if (T.isString(date)) {
                date = this.from(date);
            }

            var options = this.options;
            var first   = options.first;
            var y       = date.getFullYear();
            var M       = date.getMonth() + 1;
            var d       = date.getDate();
            var week    = date.getDay();

            if (first) {
                week = (week - 1 + 7) % 7;
            }

            week = this.days[week];

            var map = {
                yyyy: y,
                yy: y % 100,
                y: y,
                mm: pad(M),
                m: M,
                dd: pad(d),
                d: d,
                w: week,
                ww: options.lang.week + week
            };

            return format.replace(/y+|M+|d+|W+/gi, function ($0) {
                return map[$0] || '';
            });
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
                T.addClass(this.main, 'c-clearfix');

                if (options.target) {
                    this.setTarget(T.g(options.target));
                }
            }
        },

        /**
         * 构建HTML
         * 
         * @private
         */
        build: function (date) {
            var options = this.options;
            var html    = [];

            date = date || this.date;

            var year  = date.getFullYear();
            var month = date.getMonth();
            var current;

            for (var i = 0, len = options.monthes; i < len; i++) {
                current = new Date(year, month + i, 1);
                html.push(this.buildMonth(current));
            }

            var prefix = options.prefix;
            html.push('<a href="#" class="' + prefix + '-pre"></a>');
            html.push('<a href="#" class="' + prefix + '-next"></a>');

            var popup = this.popup;
            popup.content = html.join('');
            popup.render();

            this.updateStatus();
            this.updatePrevNextStatus(date);
        },

        updatePrevNextStatus: function (date) {
            var options = this.options;
            var prefix = options.prefix;
            var range  = this.range;
            var prev = T.q(prefix + '-pre', this.main)[0];
            var next = T.q(prefix + '-next', this.main)[0];

            date = date || this.date || this.from(this.value);

            if (prev) {
                T[!range 
                    || this.getMonth(range.begin) < this.getMonth(date)
                    ? 'show' : 'hide'
                ](prev);

            }


            var last = new Date(
                date.getFullYear(),
                date.getMonth() + options.monthes - 1,
                1
            );
            if (next) {
                T[!range
                    || this.getMonth(range.end) > this.getMonth(last)
                    ? 'show' : 'hide'
                ](next);
            }
        },

        /**
        * 构建指定日期所在月的HTML
        * 
        * @private
        */
        buildMonth: function (date) {
            var year  = date.getFullYear();
            var month = date.getMonth() + 1;
            var today = date.getDate();
            var day   = date.getDay();
            var yM    = year + pad(month);

            if (cache[yM]) {
                return cache[yM];
            }

            var weeks     = 7;
            var rows      = 6;
            var separator = '-';

            var options = this.options;
            var prefix  = options.prefix;
            var html    = ['<div class="' + prefix + '-month">'];

            html.push('<h3>' + year + '年' + month + '月</h3>');

            var i;
            var len;
            var klass;
            var firstDay = options.first;
            var days = this.days;
            html.push('<ul class="c-clearfix">');

            for (i = 0, l = days.length; i < len; i++) {
                klass = i === weeks - 1 
                    || firstDay && i === weeks - 2
                    || !firstDay && i === firstDay
                    ? ' class="' + prefix + '-weekend"'
                    : '';

                html.push('<li' + klass + '>' + days[i] + '</li>');
            }
            html.push('</ul>');
            html.push('<p class="c-clearfix">');

            var y;
            var M;
            var d;
            var yM;

            // 星期标识
            var week = 0;

           // 计算1号星期几
            var first = (weeks + day + 1 - today % weeks) % weeks;

            // 处理上月
            len = first - firstDay;
            if (len > 0) {
                date.setDate(0);
                y = date.getFullYear();
                M = date.getMonth() + 1;
                d = date.getDate();
                yM = [y, pad(M), ''].join(separator);
                klass = prefix + '-pre-month';

                for (i = d - len + 1; i <= d; i++) {
                    week = week % weeks;
                    html.push(''
                        + '<a href="#" hidefocus'
                        +   ' class="' + klass + '"'
                        +   ' data-date="' + yM + pad(i) + '"'
                        +   ' data-week="' + week + '"'
                        + '>'
                        +   i
                        + '</a>'
                    );
                    week++; 
                }

                date.setDate(d + 1);
            }

            // 恢复到当前月;
            date.setMonth(month);
            date.setDate(0);

            yM = [year, pad(month), ''].join(separator);

            // 处理当前月
            for (i = 1, len = date.getDate(); i <= len; i++) {
                week = week % weeks;
                html.push(''
                    + '<a href="#" hidefocus '
                    +   ' data-date="' + yM + pad(i) + '"'
                    +   ' data-week="' + week + '"'
                    + '>'
                    +   i
                    + '</a>'
                );
                week++;
            }

            // 处理下月;
            date.setDate(len + 1);
            y = date.getFullYear();
            M = date.getMonth() + 1;
            yM = [y, pad(M), ''].join(separator);
            klass = prefix + '-next-month';

            len = weeks * rows - (len + Math.max(0, first - firstDay));

            for (i = 1; i <= len; i++) {
                week = week % weeks;
                html.push(''
                    + '<a href="#" hidefocus'
                    +   ' class="' + klass + '"'
                    +   ' data-date="' + yM + pad(i) + '"'
                    +   ' data-week="' + week + '"'
                    + '>'
                    +   i
                    + '</a>'
                );
                week++;
            }

            html.push('</p>');
            html.push('</div>');

            cache[yM] = html.join('');
            return cache[yM];
        },

        /**
         * 处理选单点击事件
         * 
         * @private
         * @param {Object} args 从 Popup 传来的事件对象
         */
        onClick: function (args) {
            var e = args.event;

            if (!e) {
                return;
            }

            var el     = T.event.getTarget(e);
            var tag    = el.tagName;
            var target = this.target;

            switch (tag) {

            case 'A':
                T.event.preventDefault(e);

                var prefix    = this.options.prefix;
                var preClass  = prefix + '-pre';
                var nextClass = prefix + '-next';
                var disClass  = prefix + '-disabled';
                var hasClass  = T.dom.hasClass;

                // 上月操作
                if (hasClass(el, preClass)) {
                    this.showPreMonth();
                    stopPropagation(e);
                }
                // 下月操作
                else if (hasClass(el, nextClass)) {
                    this.showNextMonth();
                    stopPropagation(e);
                }
                else if (!hasClass(el, disClass)) {
                    this.pick(el);
                }

                break;

            default:

                if (target) {
                    target.select();
                }
                break;

            }

            this.fire('click', args);
        },

        /**
         * 切换到上个月
         * 
         * @private
         */
        showPreMonth: function () {
            var date = this.date;
            date.setDate(0);
            this.build(date);
        },

        /**
         * 切换到下个月
         * 
         * @private
         */
        showNextMonth: function () {
            var date = this.date;

            date.setDate(1);
            date.setMonth(date.getMonth() + 1);

            this.build(date);
        },

        /* jshint boss: true */
        /**
         * 根据选择的日期和当前日期更新每个日期的状态
         * 
         * @private
         */
        updateStatus: function () {
            var options = this.options;
            var prefix  = options.prefix;
            var process = options.process;
            var first   = options.first;
            var now     = new Date();

            var checkedValue = this.target.value
                && this.format(this.from(this.value), DATE_FORMAT);

            var nowValue = this.format(now, DATE_FORMAT);
            var range    = this.range;
            var min      = '';
            var max      = '9999-12-31';

            if (range) {
                min = 
                    range.begin
                    && this.format(range.begin, DATE_FORMAT)
                    || min;
                max = 
                    range.end
                    && this.format(range.end, DATE_FORMAT)
                    || max;
            }

            var preClass     = prefix + '-pre-month';
            var nextClass    = prefix + '-next-month';
            var disClass     = prefix + '-disabled';
            var todayClass   = prefix + '-today';
            var checkedClass = prefix + '-checked';
            var weekendClass = prefix + '-weekend';

            var monthes = this.main.getElementsByTagName('p');
            var i, len, j, day, days, klass, value, className, inRange;
            for (i = 0, len = monthes.length; i < len; i++) {
                days  = monthes[i].getElementsByTagName('a');

                for (j = 0; day = days[j]; j++) {
                    klass     = [];
                    value     = day.getAttribute('data-date');
                    className = day.className;
                    inRange   = true;

                    if (range && (value < min || value > max)) {
                        klass.push(disClass);
                        inRange = false;
                    }

                    var mod = j % 7;
                    if (
                        mod === 6
                        ||  first && mod === 5 
                        || !first && mod === 0
                    ) {
                        klass.push(weekendClass);
                    }

                    if (~className.indexOf(preClass)) {
                        klass.push(preClass);
                    }
                    else if (~className.indexOf(nextClass)) {
                        klass.push(nextClass);
                    }
                    else {

                        if (value === nowValue) {
                            klass.push(todayClass);
                        }

                        if (inRange && value === checkedValue) {
                            klass.push(checkedClass);
                        }

                        if (process) {
                            process.call(this, day, klass, value, inRange);
                        }
                        
                    }

                    day.className = klass.join(' ');
                }
            }
        },

        /**
         * 转发Popup的onBeforeShow事件
         * 
         * @private
         * @param {Object} arg 事件参数
         * @fires module:Calendar#beforeShow
         */
        onBeforeShow: function (arg) {

            /**
             * @event module:Calendar#beforeShow
             * @type {Object}
             * @property {DOMEvent} event 事件源对象
             */
            this.fire('beforeShow', arg);

            var popup  = this.popup;
            var target = this.target;
            var value  = target.value;

            if (value) {
                value = this.from(value);
                this.value = this.format(value);
            }

            if (!popup.content) {
                this.date = this.from(value || this.value);
                this.build();
            }

            var lastDate   = this.lastDate || '';
            var lastTarget = this.lastTarget;
            var current    = this.getMonth(this.date);
            var yM         = this.getMonth(value);

            if (
                lastDate
                && lastDate !== this.format(value)
                || current !== yM
            ) {
                this.date = this.from(value || this.value);

                lastDate = lastDate && this.getMonth(lastDate);
                if (lastDate !== yM || current !== yM) {
                    this.build();
                }
                else {
                    this.updateStatus();
                }
            }
            else if (value !== lastDate || target !== lastTarget) {
                this.updateStatus();
            }
        },

        getMonth: function (date) {
            return (
                typeof date === 'number'
                ? date
                : this.format(this.from(date), 'yyyyMM')
            );
        },

        /**
         * 动态更新 target
         * 
         * @param {HTMLElement} target 新的 target 节点
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
         * 选择日期
         * 
         * @private
         * @param {HTMLElement} el 点击的当前事件源对象
         * @fires module:Calendar#pick
         */
        pick: function (el) {
            var value  = el.getAttribute('data-date');
            var week   = el.getAttribute('data-week');
            var target = this.target;
            var date   = this.from(value, DATE_FORMAT);

            value         = this.format(date);
            this.lastDate = value;

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
             * @event module:Calendar#pick
             * @type {Object}
             * @property {string} value 选中日期的格式化
             * @property {string} week 选中日期的格式化星期
             * @property {Date} date 选中的日期对象
             */
            this.fire('pick', { 
                value: value,
                week: this.options.lang.week + this.days[week],
                date: date
            });
            this.hide();
        },


        /**
         * 显示浮层
         * 
         * @param {?HTMLElement=} target 触发显示浮层的节点
         * @fires module:Calendar#show 显示事件
         */
        show: function (target) {

            this.popup.show();

            /**
             * @event module:Calendar#show
             * @type {object}
             * @property {?HTMLElement=} target 触发显示浮层的节点
             */
            this.fire('show', {target: target});

        },

        /**
         * 隐藏浮层
         * 
         * @fires module:Calendar#hide 隐藏事件
         */
        hide: function () {
            
            this.popup.hide();

            /**
             * @event module:Calendar#hide
             */
            this.fire('hide');
        },

        /**
         * 验证控件输入状态
         * 
         * @return {boolean} 是否为指定格式的日期值
         */
        checkValidity: function () {
            return this.validate();
        },

        /**
         * 获取当前选中的日期
         * 
         * @return {string} 当前日期格式化值
         */
        getValue: function () {
            return this.format(this.date);
        },

        /**
         * 获取当前选中的日期
         * 
         * @return {Date} 获取到的日期
         */
        getValueAsDate: function () {
            return this.date;
        },

        /**
         * 设置允许选中的日期区间
         * 
         * @param {Object} range 允许选择的日期区间
         */
        setRange: function (range) {
            if (!range) {
                return;
            }

            var begin = range.begin;
            var end   = range.end;

            if (begin && T.isString(begin)) {
                range.begin = this.from(begin);
            }

            if (end && T.isString(end)) {
                range.end = this.from(end);
            }
            this.range = range;
            this.updatePrevNextStatus();
        },

        /**
         * 设置当前选中的日期
         * 
         * @param {string} value 要设置的日期
         */
        setValue: function (value) {
            this.date = this.from(value);
            this.value = this.format(this.date);
        },


        /**
         * 验证控件
         * 
         * @return {boolean} 验证结果
         */
        validate: function () {
            var value = this.target.value;
            return value && this.format(this.from(value)) === value;
        }


    });

    return Calendar;
});
