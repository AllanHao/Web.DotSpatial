(function ($) {
    function buildControl(target) {
        var opts = $.data(target, 'refrencebutton').options;
        if (!$(target).hasClass("easyui-ref-input")) {
            $(target).addClass("easyui-ref-input");
        }
        //只有当前上层没有dom结构包裹的时候才进行dom包裹
        if (!$(target).parent().hasClass("easyui-ref-ifr")) {
            var wrap = "<span class='easyui-ref-ifr'></span>";
            $(target).wrap(wrap);
            var bar = "<span class='easyui-ref-btn easyui-ref-clear'></span><span class='easyui-ref-btn easyui-ref-search'></span>";

            var clr = "<div style='clear:both'></div>";
            var append = bar + clr;
            $(append).insertAfter(target);
            //绑定事件
            bindEvent(target);
        }

        if (opts.id) {
            $(target).attr('id', opts.id);
        } else {
            $(target).attr('id', '');
        }
        setReadOnly.call(target, opts.readonly);
    }
    function bindEvent(target) {
        $(target).parent().find(".easyui-ref-btn").hover(function () {
            if (isreadonly.call($(this).parent().find(".easyui-ref-input"))) { return; }
            $(this).css("background-position-x", "-68px");
        }, function () {
            $(this).css("background-position-x", "-51px");
        });
        $(target).parent().find(".easyui-ref-btn").mousedown(function () {
            if (isreadonly.call($(this).parent().find(".easyui-ref-input"))) { return; }
            $(this).css("background-position-x", "-34px");
        });
        $(target).parent().find(".easyui-ref-btn").mouseup(function () {
            if (isreadonly.call($(this).parent().find(".easyui-ref-input"))) { return; }
            $(this).css("background-position-x", "-68px");
        });
        $(target).parent().find(".easyui-ref-btn").bind("click", function () {
            if (isreadonly.call($(this).parent().find(".easyui-ref-input"))) { return; }
            var opts = $.data(target, 'refrencebutton').options;
            if ($(this).hasClass("easyui-ref-clear")) {
                var result = opts.clearHandler.call(target, getOpts.call(target));
                if (result == null || result == undefined || result == true) {
                    if (!isreadonly.call(target)) {
                        clear(target);
                    }
                }
            } else if ($(this).hasClass("easyui-ref-search")) {
                opts.selectHandler.call(target, getOpts.call(target));
            }
        });
        $(target).mouseup(function (e) {
            $(this).select();
            e.preventDefault();
        });

        $(target).focus(function () {
            var data = $.data(this, "refrencebutton").data;
            $(target).val(data.value);
        });
        $(target).blur(function () {
            var data = $.data(this, "refrencebutton").data;
            $(target).val(data.text);
        });
        $(target).keydown(function (e) {

            if (isreadonly.call(this)) {
                return false;
            }
            if (e.keyCode == 8) {
                clear(this);
            }
            return false;
        });
    }
    function clear(target) {
        $(target).val("");
        setOpts.call(target, { key: -1, value: "", text: "" });
    }

    function setReadOnly(readonly) {
        if (readonly) {
            $(this).attr("readonly", "readonly");
            $(this).css("background-color", "rgb(235, 235, 228)");
            $(this).parent().find(".easyui-ref-btn").css("cursor", "default");

        } else {
            $(this).removeAttr("readonly");
            $(this).css("background-color", "#fff");
            $(this).parent().find(".easyui-ref-btn").css("cursor", "pointer");
        }
    }
    function setOpts(opts) {
        if (opts == null || opts == undefined) return false;
        if (!opts.key) return false;
        if (!opts.value) opts.value = "";
        if (!opts.text) opts.text = "";
        var state = $.data(this, 'refrencebutton');
        if (!state) {
            $.data(
                   this,
                   'refrencebutton',
                   {
                       options: $.extend({}, $.fn.refrencebutton.defaults, $.fn.refrencebutton.parseOptions(this), { data: opts })
                   }
                   );

            bindEvent(this);
        }
        $.data(this, "refrencebutton").data = opts;
        if (isfocus.call(this)) {
            $(this).val(opts.value);
            $(this).select();
        } else {
            $(this).val(opts.text);
        }
        return true;
    }
    function getOpts() {
        var data = $.data(this, "refrencebutton").data;
        return data;
    }
    function isfocus() {
        return false;
    }
    function isreadonly() {
        return $(this).attr("readonly");
    }

    $.fn.refrencebutton = function (options, param) {
        if (typeof options == 'string') {
            return $.fn.refrencebutton.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'refrencebutton');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'refrencebutton', {
                    options: $.extend({}, $.fn.refrencebutton.defaults, $.fn.refrencebutton.parseOptions(this), options)
                });
                $(this).removeAttr('disabled');
            }

            buildControl(this);
        });
    };

    $.fn.refrencebutton.methods = {
        options: function (jq) {
            return $.data(jq[0], 'refrencebutton').options;
        },
        clear: function (jq) {
            return jq.each(function () {
                clear(this);
            });
        },
        readOnly: function (jq, r) {
            return jq.each(function () {
                setReadOnly.call(this, r);
            });
        },
        getOpts: function (jq) {
            var opts = null;
            jq.each(function () {
                opts = getOpts.call(this);
            });
            if (opts == null) {
                opts = { key: -1, value: '', text: '' };
            }
            return opts;
        },
        setOpts: function (jq, opts) {
            return jq.each(function () {
                setOpts.call(this, opts);
            });
        }
    };

    $.fn.refrencebutton.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.parser.parseOptions(target, ['id', 'keyField', 'valueField', 'textField']), {});
    };

    $.fn.refrencebutton.defaults = {id: null,key: -1,value: "",text: "",readonly: false,
        clearHandler: function (opts) {
            return true;
        },
        selectHandler: function (opts) {
            return true;
        }
    };

})(jQuery);