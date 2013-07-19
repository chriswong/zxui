/**
 * ZXUI (Zhixin UI)
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file  UI基础库
 * @author  chris(wfsr@foxmail.com)
 */

/* jshint boss: true, unused: false */
define(function () {
    /**
     * 基类库
     * 
     * 提供常用工具函数的封装
     * @exports lib
     */
    var lib = {};

    var toString = Object.prototype.toString;
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    /**
     * 方法静态化
     * 
     * 反绑定、延迟绑定
     * @inner
     * @param {Function} method 待静态化的方法
     * @return {Function} 静态化包装后方法
     */
    function generic(method) {
        return function () {
            return Function.call.apply(method, arguments);
        };
    }

    /**
     * 功能降级处理
     * 
     * @inner
     * @param {boolean} conditioin feature 可用的测试条件
     * @param {Function} implement feature 不可用时的降级实现
     * @param {Function} feature 可用的特性方法
     * @return {Function} 静态化后的 feature 或 对应的降级实现函数
     */
    function fallback(condition, implement, feature) {
        return condition ? generic(feature || condition) : implement;
    }


    /**
     * 类型判断
     * 
     * @inner
     * @param {*} obj 待判断类型的输入
     * @return {string} 类型判断结果
     */
    function typeOf(obj) {
        var type = toString.call(obj).slice(8, -1).toLowerCase();
        return type === 'object' && 'nodeType' in obj ? 'node' : type;
    }

    /**
     * 创建别名
     * 
     * @inner
     * @param {Object} target 别名附加的目标
     * @param {Object} from 别名来源
     */
    function alias(target, from) {
        for (var i = 2, method; method = arguments[i++];) {
            target[method] = from[method];
        }
    }

    /* ========================== lib.array ========================== */

    /**
     * 遍历数组方法
     * 
     * 现代浏览器中数组 forEach 方法静态化别名
     * @method module:lib.each
     * @param {Array} obj 待遍历的数组或类数组
     * @param {Function} iterator 迭代方法
     * @param {Object=} bind 迭代方法中绑定的 this
     */
    var each = lib.each = fallback(
        Array.prototype.forEach,
        function (obj, iterator, bind) {
            for (var i = 0, l = (obj.length >>> 0); i < l; i++) {
                if (i in obj) {
                    iterator.call(bind, obj[i], i, obj);
                }
            }
        }
    );

    // 生成 lib 命名空间下的 isString、isArray、isFunctoin、isDate 和 isObject 方法
    each(['String', 'Array', 'Function', 'Date', 'Object'], function (type) {

        /**
         * @namespace module:lib.string
         */
        /**
         * @namespace module:lib.array
         */
        /**
         * @namespace module:lib.fn
         */
        /**
         * @namespace module:lib.date
         */
        /**
         * @namespace module:lib.object
         */
        var lowerType = type.toLowerCase();
        lib[lowerType === 'function' ? 'fn' : lowerType] = {};

        /**
         * 判断是否字符串
         * 
         * @method module:lib.isString
         * @param {*} obj 待判断的输入
         * @return {boolean} 类型判断结果
         */
        /**
         * 判断是否数组
         * 
         * @method module:lib.isArray
         * @param {*} obj 待判断的输入
         * @return {boolean} 类型判断结果
         */
        /**
         * 判断是否函数
         * 
         * @method module:lib.isFunction
         * @param {*} obj 待判断的输入
         * @return {boolean} 类型判断结果
         */
        /**
         * 判断是否日期对象
         * 
         * @method module:lib.isDate
         * @param {*} obj 待判断的输入
         * @return {boolean} 类型判断结果
         */
        /**
         * 判断是否对象
         * 
         * @method module:lib.isObject
         * @param {*} obj 待判断的输入
         * @return {boolean} 类型判断结果
         */
        lib['is' + type] = function (obj) {
            return toString.call(obj).slice(8, -1) === type;
        };
    });

    /**
     * 遍历数组方法
     * 
     * 现代浏览器中数组 forEach 方法静态化别名
     * @method module:lib.array.each
     * @param {Array} obj 待遍历的数组或类数组
     * @param {Function} iterator 迭代方法
     * @param {Object=} bind 迭代方法中绑定的 this
     */
    lib.array.each = each;

    /**
     * 数组的 map 方法
     * 
     * 现代浏览器中数组 map 方法静态化
     * @method module:lib.map
     * @param {Array} obj 待处理的数组或类数组
     * @param {Function} iterator 迭代方法
     * @param {Object=} bind 迭代方法中绑定的 this
     * @return {Array} map 处理后的原数组
     */
    /**
     * 数组的 map 方法
     * 
     * 现代浏览器中数组 map 方法静态化
     * @method module:lib.array.map
     * @param {Array} obj 待处理的数组或类数组
     * @param {Function} iterator 迭代方法
     * @param {Object=} bind 迭代方法中绑定的 this
     * @return {Array} map 处理后的原数组
     */
    var map = lib.map = lib.array.map = fallback(
        Array.prototype.map,
        function (obj, iterator, bind) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (i in obj) {
                    obj[i] = iterator.call(bind, obj[i], i, obj);
                }
            }
            return obj;
        }
    );


    /**
     * 查询数组中指定元素的索引位置
     * 
     * @method module:lib.indexOf
     * @param {Array} source 需要查询的数组
     * @param {*} match 查询项
     * @return {number} 指定元素的索引位置，查询不到时返回-1
     */
    /**
     * 查询数组中指定元素的索引位置
     * 
     * @method module:lib.array.indexOf
     * @param {Array} source 需要查询的数组
     * @param {*} item 查询项
     * @param {number} from 初始的查询位置
     * @return {number} 指定元素的索引位置，查询不到时返回-1
     */
    var indexOf = lib.indexOf = lib.array.indexOf = fallback(
        Array.prototype.indexOf,
        function (source, item, from) {
            var length = this.length >>> 0;
            var i = (from < 0) ? Math.max(0, length + from) : from || 0;
            for (; i < length; i++){
                if (source[i] === item) return i;
            }
            return -1;
        }
    );


    /**
     * 数组切片方法
     * 
     * @type {Function}
     * @param {Array} array 输入数组或类数组
     * @param {number} startIndex 切片的开始索引
     * @param {number} endIndex 切片的结束索引
     */
    var slice = generic(Array.prototype.slice);

    /* ========================== lib.object ========================== */

    /**
     * 扩展对象
     * 
     * @method module:lib.extend
     * @param {Object} target 被扩展的目标对象
     * @param {Object} source 扩展的源对象
     * @return {Object} 被扩展后的 `target` 对象
     */
    /**
     * 扩展对象
     * 
     * @method module:lib.object.extend
     * @param {Object} target 被扩展的目标对象
     * @param {Object} source 扩展的源对象
     * @return {Object} 被扩展后的 `target` 对象
     */
    var extend = lib.extend = lib.object.extend = function (target, source) {
        for (var name in source) {
            if (hasOwnProperty.call(source, name)) {
                if (lib.isObject(target[name])) {
                    extend(target[name], source[name]);
                }
                else {
                     target[name] = source[name];
                }
            }
        }
        return target;
    };

    /**
     * 深层复制
     * 
     * @method module:lib.clone
     * @param {*} source 被复制的源
     * @return {*} 复制后的新对象
     */
    /**
     * 深层复制
     * 
     * @method module:lib.object.clone
     * @param {*} source 被复制的源
     * @return {*} 复制后的新对象
     */
    var clone = lib.clone = lib.object.clone = function (source) {
        if (!source || typeof source !== 'object') {
            return source;
        }

        var cloned = source;

        if (lib.isArray(source)) {
            cloned = map(slice(source), clone);
        }
        else if (lib.isObject(source) && 'isPrototypeOf' in source) {
            cloned = {};
            for (var key in source) {
                if (hasOwnProperty.call(source, key)) {
                    cloned[key] = clone(source[key]);
                }
            }
        }

        return cloned;
    };

    /**
     * 序列化 JSON 对象
     * 
     * @method
     * @param {JSON} value 需要序列化的json对象
     * @return {string} 序列化后的字符串
     */
    lib.stringify = window.JSON && JSON.stringify || function () {

        var special = {
            '\b': '\\b', 
            '\t': '\\t', 
            '\n': '\\n', 
            '\f': '\\f', 
            '\r': '\\r',
            '"' : '\\"', 
            '\\': '\\\\'
        };

        var escape = function(chr){
            return special[chr]
                || '\\u' + ('0000' + chr.charCodeAt(0).toString(16)).slice(-4);
        };
        
        return function stringify(obj) {
            if (obj && obj.toJSON) {
                obj = obj.toJSON();
            }

            switch (typeOf(obj)){
                case 'string':
                    return '"' + obj.replace(/[\x00-\x1f\\"]/g, escape) + '"';
                case 'array':
                    return '[' + map(obj, stringify) + ']';
                case 'object':
                    var string = [];
                    for (var key in obj) {
                        if (hasOwnProperty.call(obj)) {
                            var json = stringify(value);
                            if (json) {
                                string.push(stringify(key) + ':' + json);
                            }
                        }
                    }
                    return '{' + string + '}';
                case 'number': case 'boolean': return '' + obj;
                case 'null': return 'null';
            }

            return null;
        };

    };


    /**
     * 将字符串解析成json对象。
     * 
     * @method
     * @param {string} source 需要解析的字符串
     * @return {JSON} 解析结果json对象
     */
    lib.parse = window.JSON && JSON.parse || function (string) {
        return !string || typeOf(string) !== 'string'
            ? null
            : eval('(' + string + ')');
    };

    /**
     * 将对象解析成 query 字符串
     * 
     * @method
     * @param {Object} json 需要解析的json对象
     *             
     * @return {string} 解析结果字符串，其中值将被URI编码
     */
    lib.toQueryString = function toQueryString(object, base){
        var queryString = [];

        var value;
        var result;
        for (var key in object) {
            if (hasOwnProperty.call(object, key)) {
                value = object[key]; 
                if (base) {
                    key = base + '[' + key + ']';
                }
                switch (typeOf(value)){
                    case 'object':
                        result = toQueryString(value, key);
                        break;
                    case 'array':
                        var qs = {};
                        var i = value.length;
                        while (i --) {
                            qs[i] = value[i];
                        }
                        result = toQueryString(qs, key);
                    break;
                    default: 
                        result = key + '=' + encodeURIComponent(value);
                        break;
                }
                if (value != null) {
                    queryString.push(result);
                }
            }
        }

        return queryString.join('&');
    };

    /* ========================== lib.string ========================== */
   
    /**
     * 删除目标字符串两端的空白字符
     * 
     * @method module:lib.string.trim
     * @param {string} str 目标字符串
     * @param {(string | RegExp)} triment 待删除的字符或规则
     * @return {string} 删除两端空白字符后的字符串
     */
    /**
     * 删除目标字符串两端的空白字符
     * 
     * @method module:lib.trim
     * @param {string} str 目标字符串
     * @param {(string | RegExp)} triment 待删除的字符或规则
     * @return {string} 删除两端空白字符后的字符串
     */
    lib.trim = lib.string.trim = (function () {
        var whitespace = /^[\s\xa0\u3000]+|[\u3000\xa0\s]+$/g;

        return function (str, triment) {
            return str && String(str).replace(triment || whitespace, '') || '';
        };
    }());

    /**
     * 将字符串转换成camel格式
     * 
     * @param {string} source 源字符串
     * 
     * @return {string}
     */
    lib.camelize = function (source) {
        if (!source) {
            return '';
        }

        return source.replace( 
            /-([a-z])/g, 
            function (alpha) {
                return alpha.toUpperCase();
            }
        );
    };


    /**
     * 将字符串转换成pascal格式
     * 
     * @param {string} source 源字符串
     * 
     * @return {string}
     */
    lib.pascalize = function (source) {
        if (!source) {
            return '';
        }

        return source.charAt(0).toUpperCase() + lib.camelize(source.slice(1));
    };

    /**
     * 测试是否包含指定字符
     * 
     * @method module:lib.contains
     * @param {string} source 源字符串
     * @param {string} target 包含的字符串
     * @param {string} seperator 分隔字符
     * @return {boolean} 是否包含的结果
     */
    /**
     * 测试是否包含指定字符
     * 
     * @method module:lib.string.contains
     * @param {string} source 源字符串
     * @param {string} target 包含的字符串
     * @param {string} seperator 分隔字符
     * @return {boolean} 是否包含的结果
     */
    lib.contains = lib.string.contains = function (source, target, seperator) {
        seperator = seperator || ' ';
        source = seperator + source + seperator;
        target = seperator + lib.trim(target) + seperator;
        return ~source.indexOf(target);
    };

    /* ========================== 类模拟 ========================== */

    (function () {
    
        // 创建新类
        /**
         * 创建新类
         * 
         * @param {(Object | Function)} prototype 类的原型对象或初始化函数
         * @return {Function} 新类构造函数
         */
        lib.newClass = function (prototype) {
            if (lib.isFunction(prototype)) {
                prototype = {
                    initialize: prototype
                };
            }

            var newClass = function () {
                var result = this.initialize
                    ? this.initialize.apply(this, arguments)
                    : this;

                return result;
            };

            newClass.prototype = prototype || {};
            newClass.prototype.constructor = newClass;

            newClass.extend = curry(extend, newClass);
            newClass.implement = curry(implement, newClass);

            return newClass;
        };

        function extend(newClass, params) {
            var subClass = lib.newClass();
            var F = function () {};
            F.prototype = newClass.prototype;

            subClass.prototype = new F();
            subClass.prototype.parent = curry(parent, newClass);

            subClass.implement(params);

            return subClass;
        }

        function parent(newClass, name) {
            var method = newClass.prototype[name];
            if (method) {
                return method.apply(this, slice(arguments, 1));
            }
            throw new Error('parent Class has no method named ' + name);
        }

        function implement(newClass, params) {
            
            if (lib.isFunction(params)) {
                var F = function () {};
                F.prototype = params.prototype;
                params = new F();
            }

            for (var key in params) {
                if (hasOwnProperty.call(params, key)) {
                    newClass.prototype[key] = params[key];
                }
            }

            return newClass;
        }
    })();

    /**
     * 事件功能
     * 
     * @namespace module:lib.observable
     */
    lib.observable = {

        /**
         * 添加事件绑定
         * 
         * @public
         * @param {string=} type 事件类型
         * @param {Function} listener 要添加绑定的监听器
         */
        on: function (type, listener) {
            if (lib.isFunction(type)) {
                listener = type;
                type = '*';
            }

            this._listeners = this._listeners || {};

            var listeners = this._listeners[type] || [];

            if (indexOf(listeners, listener) < 0) {
                listener.$type = type;
                listeners.push(listener);
            }

            this._listeners[type] = listeners;

            return this;
        },


        /**
         * 解除事件绑定
         * 
         * @public
         * @param {string=} type 事件类型
         * @param {Function=} listener 要解除绑定的监听器
         */
        un: function (type, listener) {
            if (lib.isFunction(type)) {
                listener = type;
                type = '*';
            }

            this._listeners = this._listeners || {};

            var listeners = this._listeners[type];

            if (listeners) {
                if (listener) {
                    var index = indexOf(listeners, listener);

                    if (~index) {
                        delete listeners[index];
                    }
                }
                else {
                    listeners.length = 0;
                    delete this._listeners[type];
                }
            }

            return this;
        },

        /**
         * 触发指定事件
         * 
         * @public
         * @param {string} type 事件类型
         * @param {Object} args 透传的事件数据对象
         */
        fire: function (type, args) {
            this._listeners = this._listeners || {};

            var listeners = this._listeners[type];

            if (listeners) {
                each(
                    listeners,
                    function (listener) {

                        args = args || {};
                        args.type = type;

                        listener.call(this, args);

                    },
                    this
                );
            }

            if (type !== '*') {
                this.fire('*', args);
            }

            return this;
        }
    };

    /**
     * 参数配置
     * 
     * @namespace module:lib.configurable
     */
    lib.configurable = {

        /**
         * 设置可配置项
         * 
         * @protected
         * @param {Object} options 配置项
         * @return {Object} 合并更新后的配置项
         */
        setOptions: function (options) {
            if (!options) {
                return clone(this.options);
            }

            var thisOptions  = this.options = clone(this.options);
            var eventNameReg = /^on[A-Z]/;
            var me           = this;

            this.srcOptions = options;

            var val;
            for (var name in options) {
                if (!hasOwnProperty.call(options, name)) {
                    continue;
                }

                val = options[name];

                // 处理配置项中的事件
                if (eventNameReg.test(name) && lib.isFunction(val)) {

                    // 移除on前缀，并转换第3个字符为小写，得到事件类型
                    var type = name.charAt(2).toLowerCase() + name.slice(3);
                    me.on(type, val);

                    delete options[name];
                }
                else if (name in thisOptions) {

                    // 考虑实际情况和性能，只处理一层，非递归处理
                    thisOptions[name] = typeOf(val) === 'object'
                        ? extend(thisOptions[name] || {}, val)
                        : val;
                }
            }

            return thisOptions;
        }
    };


    /**
     * 将对象转换为数组
     *
     * @param {*} source 任意对象
     * @return {Array}
     */   
    lib.toArray = function (source) {
        if (source == null) {
            return [];
        }

        if (lib.isArray(source)) {
            return source;
        }

        var l = source.length;
        if (typeof l === 'number' && typeOf(source) !== 'string') {
            var array = [];
            while (l --) {
                array[l] = source[l];
            }

            return array;
        }
        return [source];
    };


    // Date
    // lib.parseDate
    // lib.formatDate
    
    /* ========================== lib.fn ========================== */

    /** 
     * 为对象绑定方法和作用域
     * 
     * @method module:lib.fn.bind
     * @param {Function} fn 要绑定的函数
     * @param {Object} scope 执行运行时this，如果不传入则运行时this为函数本身
     * @param {...args=} args 函数执行时附加到执行时函数前面的参数
     *
     * @return {Function} 封装后的函数
     */
    /** 
     * 为对象绑定方法和作用域
     * 
     * @method
     * @param {Function} fn 要绑定的函数
     * @param {Object} scope 执行运行时this，如果不传入则运行时this为函数本身
     * @param {...args=} args 函数执行时附加到执行时函数前面的参数
     *
     * @return {Function} 封装后的函数
     */
    lib.bind = lib.fn.bind = fallback(
        Function.bind,
        function (fn, scope) {
            var args = arguments.length > 2 ? slice(arguments, 1) : null,
                F = function(){};

            var bound = function(){
                var context = scope, length = arguments.length;

                // 处理构造函数的 bind
                if (this instanceof bound){
                    F.prototype = fn.prototype;
                    context = new F();
                }
                var result = (!args && !length)
                    ? fn.call(context)
                    : fn.apply(
                        context, 
                        args && length
                            ? args.concat(slice(arguments))
                            : args || arguments
                    );
                return context === scope ? result : context;
            };
            return bound;
        }
    );

    /** 
     * 为函数提前绑定参数（柯里化）
     * 
     * @see http://en.wikipedia.org/wiki/Currying
     * @method module:lib.curry
     * @param {Function} fn 要绑定的函数
     * @param {...args=} args 函数执行时附加到执行时函数前面的参数
     *
     * @return {function} 封装后的函数
     */
    /** 
     * 为函数提前绑定参数（柯里化）
     * 
     * @see http://en.wikipedia.org/wiki/Currying
     * @method module:lib.fn.curry
     * @param {Function} fn 要绑定的函数
     * @param {...args=} args 函数执行时附加到执行时函数前面的参数
     *
     * @return {Function} 封装后的函数
     */
    var curry = lib.curry = lib.fn.curry = function (fn) {
        var args = slice(arguments, 1);
        return function () {
            return fn.apply(this, args.concat(slice(arguments)));
        };
    };

    /* ========================== Event ========================== */

    var eventFix = {
        list: [],
        custom: {}
    };

    /**
     * 为目标元素添加事件监听器
     * 
     * @method
     * @param {(HTMLElement | window)} element 目标元素
     * @param {string} type 事件类型
     * @param {Function} listener 需要添加的监听器

     * @return {(HTMLElement | window)} 目标元素
     */
    lib.on = document.addEventListener
        ? function (element, type, listener) {
            var condition = listener;
            var custom = eventFix.custom[type];
            var realType = type;
            if (custom) {
                realType = custom.base;
                condition = function (event) {
                    if (custom.condition.call(element, event, type)) {
                        listener.call(element, event);
                    }
                };
                listener.index = eventFix.list.length;
                eventFix.list[listener.index] = condition;
            }
            return element.addEventListener(
                realType, 
                condition, 
                !!arguments[3]
            );
        }
        : function (element, type, listener) {
            return element.attachEvent('on' + type, listener);
        };

    /**
     * 为目标元素移除事件监听器
     * 
     * @method
     * @param {(HTMLElement | window)} element 目标元素
     * @param {string} type 事件类型
     * @param {Function} listener 需要移除的监听器
     *             
     * @return {(HTMLElement | window)} 目标元素
     */
    lib.un = document.removeEventListener
        ? function (element, type, listener) {
            var condition = listener;
            var custom = eventFix.custom[type];
            var realType = type;
            if (custom) {
                realType = custom.base;
                condition = eventFix.list[listener.index];
                delete eventFix.list[listener.index];
                delete listener.index;
            }
            element.removeEventListener(
                realType, 
                condition, 
                !!arguments[3]
            );
            return element;
        }
        : function (element, type, listener) {
            element.detachEvent('on' + type, listener);
            return element;
        };

    /**
     * 触发目标元素指定事件
     * 
     * @method
     * @param {(HTMLElement | window)} element 目标元素
     * @param {string} type 事件类型
     *             
     * @return {(HTMLElement | window)} 目标元素
     */
    lib.fire = document.createEvent
        ? function (element, type) {
            var event = document.createEvent('HTMLEvents');
            event.initEvent(type, true, true);
            element.dispatchEvent(event);
            return element;
        }
        : function (element, type) {
            var event = document.createEventObject();
            element.fireEvent('on' + type, event);
            return element;
        };

    /**
     * 阻止事件默认行为
     * 
     * @method
     * @param event 事件对象
     */
    lib.preventDefault = fallback(
        window.Event && Event.prototype.preventDefault,
        function (event) {
            event.returnValue = false;
        }
    );

    /**
     * 阻止事件冒泡
     * 
     * @method
     * @param event 事件对象
     */
    lib.stopPropagation = fallback(
        window.Event && Event.prototype.stopPropagation,
        function (event) {
            event.cancelBubble = true;
        }
    );

    if (!('onmouseenter' in document)){

        var check = function (event) {
            var related = event.relatedTarget;
            if (related == null) {
                return true;
            }

            if (!related) {
                return false;
            }

            return (related !== this 
                && related.prefix !== 'xul' 
                && this.nodeType !== 9 
                && !lib.contains(this, related)
            );
        };

        eventFix.custom.mouseenter = {
            base: 'mouseover',
            condition: check
        };

        eventFix.custom.mouseleave = {
            base: 'mouseout',
            condition: check
        };
    }

    /* ========================== BROWSER ========================== */

    /* jshint -W101 */
    (function () {
        var reg = /(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/;
        var UA = navigator.userAgent.toLowerCase().match(reg)
            || [null, 'unknown', 0];
        var mode = UA[1] === 'ie' && document.documentMode;

        /**
         * 浏览器信息
         * 
         * @namespace module:lib.browser
         * @property {string} name 浏览器名称，
         * 如 ( opera | ie | firefox | chrome | safari )
         * @property {number} version 浏览器版本
         * @property {number} (browser.name) 是否指定浏览器，
         * 如 ie 6 时为 lib.browser.ie = 6
         * @property {boolean} (browser.name+browser.version) 是否指定浏览器及版本，
         * 如 ie 6 时为 lib.browser.ie6 = true
         */
        var browser = lib.browser = {

            name: (UA[1] === 'version') ? UA[3] : UA[1],

            version: mode
                || parseFloat((UA[1] === 'opera' && UA[4]) ? UA[4] : UA[2])

        };


        browser[browser.name] = browser.version | 0;

        browser[browser.name + (browser.version |0)] = true;

    })();

    /* ========================== PAGE ========================== */

    /**
     * PAGE 相关工具函数
     * 
     * @namespace module:lib.page
     */
    lib.page = {};

    /**
     * 获取横向滚动量
     * 
     * @return {number} 横向滚动偏移量
     */
    lib.getScrollLeft = lib.page.getScrollLeft = function () {
        var d = document;
        return (window.pageXOffset
                || d.documentElement.scrollLeft
                || d.body.scrollLeft);
    };

    /**
     * 获取纵向滚动量
     * 
     * @return {number} 纵向滚动偏移量
     */
    lib.getScrollTop = lib.page.getScrollTop = function () {
        var d = document;
        return (window.pageYOffset
                || d.documentElement.scrollTop
                || d.body.scrollTop);
    };

    /**
     * 获取页面视觉区域宽度
     *
     * @return {number} 页面视觉区域宽度
     */
    lib.page.getViewWidth = function () {
        return document.documentElement.clientWidth;
    };

    /**
     * 获取页面视觉区域高度
     *
     * @return {number} 页面视觉区域高度
     */
    lib.page.getViewHeight = function () {
        return document.documentElement.clientHeight;
    };

    /* ========================== DOM ========================== */

    /**
     * DOM 相关工具函数
     * 
     * @namespace module:lib.dom
     */
    lib.dom = {};

    /**
     * 获取事件源对象 
     * 
     * @param e 事件对象
     * @return {object} 获取事件目标对象
     */
    lib.getTarget = function (e) {
        e = e || window.event;
        return e.target || e.srcElement;
    };

    /**
     * 从文档中获取指定的DOM元素
     * 
     * @param {string|HTMLElement} id 元素的id或DOM元素.
     * @return {?HTMLElement} 获取的元素，查找不到时返回null,如果参数不合法，直接返回参数.
     */
    lib.g = function (id) {
        return typeOf(id) === 'string' ? document.getElementById(id) : id;
    };

    /**
     * 根据 className 查找元素集合
     * 
     * @method
     * @param {string} className 要查找的 className
     * @param {HTMLElement=} scope 指定查找的范围
     * 
     * @return {Array.<HTMLElement>} 符合条件的元素数组
     */
    lib.q = document.getElementsByClassName
        ? function (className, scope) {
            return slice((scope || document).getElementsByClassName(className));
        }
        : function (className, scope) {
            scope = scope || document;
            var nodes = scope.getElementsByTagName('*');
            var matches = [];

            for (var i = 0, l = nodes.length; i < l; i++) {
                if (lib.contains(nodes[i].className, className)) {
                    matches.push(nodes[i]);
                }
            }
            return matches;
        };

    /**
     * 获取目标元素符合条件的最近的祖先元素
     * 
     * @param {HTMLElement|string} element 目标元素
     * @param {Function} condition 判断祖先元素条件的函数，function (element)
     *             
     * @return {?HTMLElement} 符合条件的最近的祖先元素，查找不到时返回 null
     */
    lib.getAncestorBy = function (element, condition, arg) {

        while ((element = element.parentNode) && element.nodeType === 1) {
            if (condition(element, arg)) {
                return element;
            }
        }

        return null;
    };

    /**
     * 获取目标元素指定元素className最近的祖先元素
     * 
     * @param {(HTMLElement | string)} element 目标元素或目标元素的id
     * @param {string} className 祖先元素的class，只支持单个class
     *             
     * @return {?HTMLElement} 指定元素className最近的祖先元素，
     * 查找不到时返回null
     */
    lib.getAncestorByClass = function (element, className) {

        return lib.getAncestorBy(
            element,
            lib.hasClass,
            className
        );
    };

    var hasClassList = 'classList' in document.documentElement;

    /**
     * 判断元素是否包含指定的 className
     * 
     * @method
     * @param {HTMLElement} element 目标元素
     * @param {string} className 要判断的 className
     * 
     * @return {boolean} 是否拥有指定的className
     */
    lib.hasClass = hasClassList
        ? function (element, className) {
            return element.classList.contains(className);
        }
        : function (element, className) {
            return lib.contains(element.className, className);
        };
    /**
     * 为目标元素添加 className
     * 
     * @method
     * @param {HTMLElement} element 目标元素
     * @param {string} className 要添加的className
     * 
     * @return {HTMLElement} 目标元素 `element`
     */
    lib.addClass = hasClassList
        ? function (element, className) {
            element.classList.add(className);
            return element;
        }
        : function (element, className) {
            if (!lib.hasClass(element, className)) {
                element.className += ' ' + className;
            }
            return element;
        };

    /**
     * 移除目标元素的 className
     * 
     * @method
     * @param {HTMLElement} element 目标元素
     * @param {string} className 要移除的 className
     * 
     * @return {HTMLElement} 目标元素
     */
    lib.removeClass = hasClassList
        ? function (element, className) {
            element.classList.remove(className);
            return element;
        }
        : function (element, className) {
            element.className = element.className.replace(
                new RegExp('(^|\\s)' + className + '(?:\\s|$)'),
                '$1'
            );
            return element;
        };


    /**
     * 切换目标元素的 className
     * 
     * @method
     * @param {HTMLElement} element 目标元素
     * @param {string} className 要切换的 className
     * 
     * @return {HTMLElement} 目标元素
     */
    lib.toggleClass = hasClassList
        ? function (element, className) {
            element.classList.remove(className);
            return element;
        }
        : function (element, className) {
            element.className = element.className.replace(
                new RegExp('(^|\\s)' + className + '(?:\\s|$)'),
                '$1'
            );
            return element;
        };

    /**
     * 显示目标元素
     * 
     * @param {HTMLElement} element 目标元素
     * @param {?string=} value 指定 display 的值，默认为 'block'
     * @returns {HTMLElement} 目标元素
     */
    lib.show = function (element, value) {
        element.style.display = value || '';
        return element;
    };

    /**
     * 隐藏目标元素
     * 
     * @param {HTMLElement} element 目标元素
     * @returns {HTMLElement} 目标元素
     */
    lib.hide = function (element) {
        element.style.display = 'none';
        return element;
    };

        /**
     * 获取计算样式值
     *
     * @param {HTMLElement} element 目标元素
     * @param {string} key 样式名称
     * 
     * @return {string}
     */
    lib.getStyle = function (element, key) {
        if (!element) {
            return '';
        }

        key = lib.camelize(key);

        var doc = element.nodeType === 9 
            ? element 
            : element.ownerDocument || element.document;

        if (doc.defaultView && doc.defaultView.getComputedStyle) {
            var styles = doc.defaultView.getComputedStyle(element, null);
            if (styles) {
                return styles[key] || styles.getPropertyValue(key);
            }
        }
        else if (element && element.currentStyle) {
            return element.currentStyle[key];
        }
        return ''; 
    };


    /**
     * 获取元素的绝对坐标
     * 
     * @method module:lib.getPosition
     * @method module:lib.dom.getPosition
     * 
     * @param {HTMLElement} element 目标元素
     * @return {Object} 包含 left 和 top 坐标值的对象
     */
    lib.getPosition = lib.dom.getPosition = function (element) {
        var bound = element.getBoundingClientRect();
        var root = document.documentElement;
        var body = document.body;

        var clientTop = root.clientTop || body.clientTop || 0;
        var clientLeft = root.clientLeft || body.clientLeft || 0;
        var scrollTop = window.pageYOffset || root.scrollTop;
        var scrollLeft = window.pageXOffset || root.scrollLeft;

        return {
            left: (bound.left | 0) + scrollLeft - clientLeft,
            top: (bound.top | 0) + scrollTop - clientTop
        };
    };

    /**
     * 设置元素样式
     * 
     * @method module:lib.setStyles
     * @method module:lib.dom.setStyles
     * 
     * @param {HTMLElement} element 目标元素
     * @param {Object} properties 要设置的 CSS 属性
     */
    lib.setStyles = lib.dom.setStyles = function (element, properties) {
        for (var name in properties) {
            if (hasOwnProperty.call(properties, name)) {
                element.style[lib.camelize(name)] = properties[name];
            }
        }
    };

    /**
     * DOM 步进遍历
     * 
     * @inner
     * @param {HTMLElement} element 当前元素
     * @param {string} walk 步进方式，如 previousSibling
     * @param {?string} start 开始元素节点选择
     * @param {?Function} match 对元素匹配的回调函数
     * @param {boolean} all 是否查找所有符合的元素
     * 
     * @return {(HTMLElement | Array.<HTMLElement> | null)} 匹配结果
     */
    var walk = function (element, walk, start, match, all) {
        var el = lib.g(element)[start || walk];
        var elements = [];
        while (el){
            if (el.nodeType == 1 && (!match || match(el))){
                if (!all) return el;
                elements.push(el);
            }
            el = el[walk];
        }
        return (all) ? elements : null;
    };

    lib.extend(lib.dom, {


        /**
         * 获取目标元素的上一个兄弟元素节点
         * 
         * @method module:lib.dom.previous
         * @param {(HTMLElement | string)} element 目标元素或目标元素的 id
         * 
         * @return {?HTMLElement} 目标元素的上一个兄弟元素节点，查找不到时返回 null
         */
        previous: function (element, match) {
            return walk(element, 'previousSibling', null, match);
        },


        /**
         * 获取目标元素的下一个兄弟元素节点
         * 
         * @method module:lib.dom.next
         * @param {(HTMLElement | string)} element 目标元素或目标元素的 id
         * 
         * @return {?HTMLElement} 目标元素的下一个兄弟元素节点，查找不到时返回 null
         */
        next: function (element, match) {
            return walk(element, 'nextSibling', null, match);
        },

        /**
         * 获取目标元素的第一个元素节点
         * 
         * @method module:lib.dom.first
         * @grammar lib.dom.first(element)
         * @param {(HTMLElement | string)} element 目标元素或目标元素的 id
         * @meta standard
         * 
         * @return {?HTMLElement} 目标元素的第一个元素节点，查找不到时返回 null
         */
        first: function (element, match) {
            return walk(element, 'nextSibling', 'firstChild', match);
        },

        /**
         * 获取目标元素的最后一个元素节点
         * 
         * @method module:lib.dom.next
         * @param {(HTMLElement | string)} element 目标元素或目标元素的 id
         * 
         * @return {?HTMLElement} 目标元素的最后一个元素节点，查找不到时返回 null
         */
        last: function (element, match) {
            return walk(element, 'previousSibling', 'lastChild', match);
        },


        /**
         * 获取目标元素的所有子节点
         * 
         * @method module:lib.dom.children
         * @param {(HTMLElement | string)} element 目标元素或目标元素的 id
         * 
         * @return {?Array} 目标元素的所有子节点，查找不到时返回 null
         */
        children: function (element, match) {
            return walk(element, 'nextSibling', 'firstChild', match, true);
        },

        /**
         * 判断一个元素是否包含另一个元素
         * 
         * @method  module:lib.dom.contains
         * @grammar lib.dom.contains(container, contained)
         * @param {(HTMLElement | string)} container 包含元素或元素的 id
         * @param {(HTMLElement | string)} contained 被包含元素或元素的 id
         * @meta standard
         *             
         * @return {boolean} contained 元素是否被包含于 container 元素的 DOM 节点上
         */
        contains = function (container, contained) {
            var g = lib.g;
            container = g(container);
            contained = g(contained);

            //fixme: 无法处理文本节点的情况(IE)
            return container.contains
                ? container !== contained && container.contains(contained)
                : !!(contained.compareDocumentPosition(container) & 8);
        }
    });

    /**
     * 类型判断
     * 
     * @method
     * @param {*} obj 待判断的输入
     * @return {string} 类型判断结果
     */
    lib.typeOf = typeOf;

    return lib;
});
