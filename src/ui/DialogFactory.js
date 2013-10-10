/**
 * ZXUI (Zhixin UI)
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file 弹框组件库，产生常用的组件
 * @author mengke(mengke01@baidu.com)
 */

define(function (require) {

    var lib = require('./lib');
    var Dialog = require('./Dialog');

    /**
     * 获得同Dialog相同的class创建规则
     * 
     * @param {Object} opts 初始化选项
     * @see module:Dialog.options
     * 
     * @param {string} name 名称
     * @returns {Object} 构建好的dialog对象
     */
    function getClass(opts, name) {
        name = name ? '-' + name : '';
        var skin = opts.skin;
        return (opts.prefix || 'ecl-ui-dialog') + name + (skin ? ' ' + skin + name : '');
    }

    /**
     * 创建Dialog对象
     * 
     * @param {Object} opts 初始化选项
     * @see module:Dialog.options
     *
     * @returns {Object} 构建好的dialog对象
     */
    function genDialog(opts) {
        
        var footer = opts.footer || '';

        //设置取消按钮
        if(opts.cancel) {
            var id = Dialog.guid('btn');
            var cls = getClass(opts, 'cancel-btn');
            footer += '<a id="'
                + id 
                + '" href="javascript:;"'
                + ' class="'
                + cls
                + '">'
                + (opts.cancelTitle || '取消')
                + '</a>';
            opts.title = opts.title || '确认';
            opts.cancelId = id;
        }

        //设置确定按钮
        if(opts.confirm) {
            var id = Dialog.guid('btn');
            var cls = getClass(opts, 'confirm-btn');
            footer = '<button id="'
                + id 
                + '"'
                + ' class="'
                + cls
                +'">'
                + (opts.confirmTitle || '确定')
                + '</button>' 
                + footer;
            opts.title = opts.title || '提示';
            opts.confirmId = id;
        }

        opts.footer = footer;

        //创建对话框
        var dlg = new Dialog(opts);
        dlg.render();

        //绑定确定事件
        if(opts.confirmId) {
            lib.on(lib.g(opts.confirmId), 'click', 
                opts._confirm_handler = function(e) {
                    dlg.fire('confirm');
                }
            );
        }

        //绑定取消事件
        if(opts.cancelId) {
            lib.on(lib.g(opts.cancelId), 'click', 
                opts._cancel_handler =function(e) {
                    dlg.fire('cancel');
                }
            );
            dlg.on('hide', function(e) {
                setTimeout(function() {
                    dlg.fire('cancel');
                },0)
            });
        }

        //绑定注销事件
        dlg.on('dispose', function(e) {
            dlg.un('confirm');
            dlg.un('cancel');
            opts.confirmId && lib.un(lib.g(opts.confirmId), 'click', opts._confirm_handler);
            opts.cancelId && lib.un(lib.g(opts.cancelId), 'click', opts._cancel_handler);
            opts = null;
        });

        return dlg.show();
    }

    /**
     * 对话框工厂，提供对话框创建方法
     *
     * @requires lib
     * @requires Dialog
     * @exports DialogFactory
     */
    var DialogFactory = {

        /**
         * 创建一个基本对话框对象
         * 
         * @param {Object} opts 初始化选项
         * @see module:Dialog.options
         * @returns {Object} 构建好的dialog对象
         * @public
         */
        create: function(opts) {
            return genDialog(opts);
        },

        /**
         * 创建一个带确定按钮的对话框对象
         * 
         * @param {Object} opts 初始化选项
         * @see module:Dialog.options
         * @returns {Object} 构建好的dialog对象
         * @public
         */
        alert: function(opts) {
            opts.confirm = 1;
            return genDialog(opts);
        },

        /**
         * 创建一个带确定和取消按钮的对话框对象
         * 
         * @param {Object} opts 初始化选项
         * @see module:Dialog.options
         * @returns {Object} 构建好的dialog对象
         * @public
         */
        confirm: function(opts) {
            opts.confirm = 1;
            opts.cancel = 1;
            return genDialog(opts);
        }
    };

    return DialogFactory;
});