var index = (function(win) {
    /**
     * 公用方法集合
     */
    var tempObj = {

        init: function() {

            var query = this.getUrlQuery();

            var redirect = query.r || '';
            var produceName = query.n || '';    
            var produceImage = query.i || '';
           
            this.selector.productImage.src = produceImage;
            document.title = produceName + '下载';
            
            if (this.IsPC()) {
                this.selector.mainTips.innerHTML = '<div class="main__tips">'+ produceName +'</div>';
                win.location =redirect;
            } else {
                if (this.isWeixin()) {
                    if (this.isAndroid()) {
                        this.selector.mainArrow.style.display = 'block';
                        this.selector.mainTips.innerHTML = '<div class="main__tips">下载' + produceName + '，请点击右上角选择</div><div class="main__tips">[在浏览器中打开]</div>'
                    } else {

                        this.selector.mainTips.innerHTML = '<div class="main__tips">仅支持安卓系统</div>'
                    }
                } else {
                    if (this.isAndroid()) {
                        this.selector.mainTips.innerHTML = '<div class="main__tips">'+ produceName +'</div>';
                        win.location =redirect;
                    } else {

                        this.selector.mainTips.innerHTML = '<div class="main__tips">仅支持安卓系统</div>'

                    }
                }
            }
        },
        //r重定向地址 n产品名称 i产品图片
        //debug ?i=http://www.pospal.cn/landing/download/imgs/zizhudiancanji_icon.png&n=安卓自助点餐机&r=test/index.html

        getUrlQuery: function() {
            var query = win.location.search.split('?')[1];
            if (typeof query === 'undefined') {
                return {}
            }
            var result = {};

            query.split("&").forEach(function(part) {
                var item = part.split("=");
                result[item[0]] = decodeURIComponent(item[1]);
            });
            return result;
        },
        isWeixin: function() {
            var ua = win.navigator.userAgent.toLowerCase();
            return !!(ua.match(/MicroMessenger/i) == 'micromessenger');
        },
        isAndroid: function() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
            return isAndroid;
        },
        isIOS: function() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            return isIOS
        },
        IsPC: function() {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"
            ];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        },
        //注入所有的选择器，方便选择器变化，直接修改该对象中的选择器，而不需要全局去更改
        selector: {
            productImage: document.getElementById('productImage'),
            mainTips: document.getElementById('mainTips'),
            mainArrow: document.getElementById('mainArrow'),
            main: document.getElementById('main'),
        },
        //注入所有的接口地址，方便接口变化可以进行，快速变更，不需要全局找引用的对象
        interface: {
            loginUrl: "",
        },
        //注入page中所有的事件，统一管理，建议命名规范：事件_命名，例 click_login
        registerEle: {
            click_login: function() {
                //注册单击事件
            }
        },
        //注入所有ajax请求，页面所有请求，将在这里统一管理，建议命名规范：ajax_命名，例 ajax_login
        /*
         * 该请求中有2种方案,看需求使用
         *  1.不公用一个请求方案
         *  2.公用一个请求，但是回调处理不一样
         * */
        ajaxRequest: {
            //不公用一个请求方案
            ajax_login: function() {
                $.post("", "", function(data) {
                    tempObj.callback.call_login(data);
                });
            },
            //会有多个业务公用这个请求
            ajax_login_T: function(callback) {
                //所有接口地址从interface中获取，callback中tempObj.callback中处理
                $.post("", "", callback);
            },
        },
        //处理所有回调函数，针对一个请求，处理一个回调
        callback: {
            //不共用请求处理回调
            call_login: function(data) {
                //处理回调
            },
            //公用请求处理回调
            call_login_T: function() {
                var temp = function() {

                };
                tempObj.ajaxRequest.ajax_login_T(temp);
            }
        },
        //所有使用的工具类，如果每个项目都单独的unit.js或者common.js等存放一些公共方法的，这里可以不使用
        // PS:这里存放的只是仅针对于这个页面处理的一些tool，一般没必要抛出去，不过看业务而定
        tool: {
            A: function() {
                console.log("");
            }
        }
    };

    window.onload = function() {
        tempObj.init();
    }
})(window);