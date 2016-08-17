(function ($) {
    function _init(target) {
        var searchgrid = $.data(target, "searchgrid");
        var opts = searchgrid.options;
        var grid = searchgrid.grid;
        $(target).addClass("combogrid-f").combo($.extend({}, opts, {
            onShowPanel: function () {
                var p = $(this).searchgrid("panel");
                var _height = p.outerHeight() - p.height();
                var _minHeight = p._size("minHeight");
                var _maxHeight = p._size("maxHeight");
                var grid = $(this).searchgrid("grid");
                grid.datagrid("resize", { width: "100%", height: (isNaN(parseInt(opts.panelHeight)) ? "auto" : "100%"), minHeight: (_minHeight ? _minHeight - _height : ""), maxHeight: (_maxHeight ? _maxHeight - _height : "") });
                var row = grid.datagrid("getSelected");
                if (row) {
                    grid.datagrid("scrollTo", grid.datagrid("getRowIndex", row));
                }
                opts.onShowPanel.call(this);
            }
        }));
        var panel = $(target).combo("panel");
        if (!grid) {
            grid = $("<table></table>").appendTo(panel);
            searchgrid.grid = grid;
        }
        var combo = $.data(target, "combo").combo;
        if (combo) {
            var arrow = $(combo).find(".combo-arrow");
            if (arrow) {
                $(arrow).addClass("searchgrid-arrow");
            }
        }
        grid.datagrid($.extend({}, opts, {
            border: false, singleSelect: (!opts.multiple),
            onLoadSuccess: function (data) {
                var values = $(target).combo("getValues");
                var onSelect = opts.onSelect;
                opts.onSelect = function () {
                };
                bindData(target, values, searchgrid.remainText);
                opts.onSelect = onSelect;
                opts.onLoadSuccess.apply(target, arguments);
            },
            onClickRow: clickRow,
            onSelect: function (index, row) {
                selectRow();
                opts.onSelect.call(this, index, row);
            }, onUnselect: function (index, row) {
                selectRow();
                opts.onUnselect.call(this, index, row);
            }, onSelectAll: function (rows) {
                selectRow();
                opts.onSelectAll.call(this, rows);
            }, onUnselectAll: function (rows) {
                if (opts.multiple) {
                    selectRow();
                }
                opts.onUnselectAll.call(this, rows);
            }
        }));
        function clickRow(index, row) {
            searchgrid.remainText = false;
            selectRow();
            if (!opts.multiple) {
                $(target).combo("hidePanel");
            }
            opts.onClickRow.call(this, index, row);
        };
        function selectRow() {
            var vv = $.map(grid.datagrid("getSelections"), function (row) {
                return row[opts.idField];
            });
            vv = vv.concat(opts.unselectedValues);
            if (!opts.multiple) {
                vv = vv.length ? [vv[0]] : [""];
            }
            bindData(target, vv, searchgrid.remainText);
        };
    };
    function nav(target, dir) {
        var searchgrid = $.data(target, "searchgrid");
        var opts = searchgrid.options;
        var grid = searchgrid.grid;
        var length = grid.datagrid("getRows").length;
        if (!length) {
            return;
        }
        var tr = opts.finder.getTr(grid[0], null, "highlight");
        if (!tr.length) {
            tr = opts.finder.getTr(grid[0], null, "selected");
        }
        var _a1a;
        if (!tr.length) {
            _a1a = (dir == "next" ? 0 : length - 1);
        } else {
            var _a1a = parseInt(tr.attr("datagrid-row-index"));
            _a1a += (dir == "next" ? 1 : -1);
            if (_a1a < 0) {
                _a1a = length - 1;
            }
            if (_a1a >= length) {
                _a1a = 0;
            }
        }
        grid.datagrid("highlightRow", _a1a);
        if (opts.selectOnNavigation) {
            searchgrid.remainText = false;
            grid.datagrid("selectRow", _a1a);
        }
    };
    function bindData(target, dataList, _a1d) {
        var searchgrid = $.data(target, "searchgrid");
        var opts = searchgrid.options;
        var grid = searchgrid.grid;
        var values = $(target).combo("getValues");
        var opts = $(target).combo("options");
        var onChange = opts.onChange;
        opts.onChange = function () {
        };
        var gridOpts = grid.datagrid("options");
        var gridOnSelect = gridOpts.onSelect;
        var gridOnUnSelectAll = gridOpts.onUnselectAll;
        gridOpts.onSelect = gridOpts.onUnselectAll = function () {
        };
        if (!$.isArray(dataList)) {
            dataList = dataList.split(opts.separator);
        }
        var selectedRows = [];
        $.map(grid.datagrid("getSelections"), function (row) {
            if ($.inArray(row[opts.idField], dataList) >= 0) {
                selectedRows.push(row);
            }
        });
        grid.datagrid("clearSelections");
        grid.data("datagrid").selectedRows = selectedRows;
        var ss = [];
        for (var i = 0; i < dataList.length; i++) {
            var data = dataList[i];
            var index = grid.datagrid("getRowIndex", data);
            if (index >= 0) {
                grid.datagrid("selectRow", index);
            }
            ss.push(getText(data, grid.datagrid("getRows")) || getText(data, grid.datagrid("getSelections")) || getText(data, opts.mappingRows) || data);
        }
        opts.unselectedValues = [];
        var idArray = $.map(selectedRows, function (row) {
            return row[opts.idField];
        });
        $.map(dataList, function (_a2a) {
            if ($.inArray(_a2a, idArray) == -1) {
                opts.unselectedValues.push(_a2a);
            }
        });
        $(target).combo("setValues", values);
        opts.onChange = onChange;
        opts.onSelect = gridOnSelect;
        opts.onUnselectAll = gridOnUnSelectAll;
        if (!_a1d) {
            var s = ss.join(opts.separator);
            if ($(target).combo("getText") != s) {
                $(target).combo("setText", s);
            }
        }
        $(target).combo("setValues", dataList);
        function getText(id, rows) {
            for (var i = 0; i < rows.length; i++) {
                if (id == rows[i][opts.idField]) {
                    return rows[i][opts.textField];
                }
            }
            return undefined;
        };
    };
    function query(target, q) {
        var searchgrid = $.data(target, "searchgrid");
        var opts = searchgrid.options;
        var grid = searchgrid.grid;
        searchgrid.remainText = true;
        if (opts.multiple && !q) {
            bindData(target, [], true);
        } else {
            bindData(target, [q], true);
        }
        if (opts.mode == "remote") {
            grid.datagrid("clearSelections");
            grid.datagrid("loadData", []);
            opts.onSearch.call(target, q);
        } else {
            if (!q) {
                return;
            }
            grid.datagrid("clearSelections").datagrid("highlightRow", -1);
            var rows = grid.datagrid("getRows");
            var qq = opts.multiple ? q.split(opts.separator) : [q];
            $.map(qq, function (q) {
                q = $.trim(q);
                if (q) {
                    $.map(rows, function (row, i) {
                        if (q == row[opts.textField]) {
                            grid.datagrid("selectRow", i);
                        } else {
                            if (opts.filter.call(_a2d, q, row)) {
                                grid.datagrid("highlightRow", i);
                            }
                        }
                    });
                }
            });
        }
    };
    function enter(target) {
        var searchgrid = $.data(target, "searchgrid");
        var opts = searchgrid.options;
        var grid = searchgrid.grid;
        var tr = opts.finder.getTr(grid[0], null, "highlight");
        searchgrid.remainText = false;
        if (tr.length) {
            var rowIndex = parseInt(tr.attr("datagrid-row-index"));
            if (opts.multiple) {
                if (tr.hasClass("datagrid-row-selected")) {
                    grid.datagrid("unselectRow", rowIndex);
                } else {
                    grid.datagrid("selectRow", rowIndex);
                }
            } else {
                grid.datagrid("selectRow", rowIndex);
            }
        }
        var vv = [];
        $.map(grid.datagrid("getSelections"), function (row) {
            vv.push(row[opts.idField]);
        });
        $(target).searchgrid("setValues", vv);
        if (!opts.multiple) {
            $(target).searchgrid("hidePanel");
        }
        //回车后触发onclickrow事件
        var row = grid.datagrid("getSelected");
        if (row) {
            var index = grid.datagrid("getRowIndex", row);
            opts.onClickRow.call(target, index, row);
        } else {
            $(target).combo("setValue", "");
            $(target).combo("setText", "");
        }
    };
    $.fn.searchgrid = function (_options, _param) {
        if (typeof _options == "string") {
            var _a35 = $.fn.searchgrid.methods[_options];
            if (_a35) {
                return _a35(this, _param);
            } else {
                return this.combogrid(_options, _param);
            }
        }
        _options = _options || {};
        return this.each(function () {
            var _a36 = $.data(this, "searchgrid");
            if (_a36) {
                $.extend(_a36.options, _options);
            } else {
                _a36 = $.data(this, "searchgrid", { options: $.extend({}, $.fn.searchgrid.defaults, $.fn.searchgrid.parseOptions(this), _options) });
            }
            _init(this);
        });
    };
    $.fn.searchgrid.methods = {
        options: function (jq) {
            var opts = jq.combo("options");
            return $.extend($.data(jq[0], "combogrid").options, { width: opts.width, height: opts.height, originalValue: opts.originalValue, disabled: opts.disabled, readonly: opts.readonly });
        }, grid: function (jq) {
            return $.data(jq[0], "searchgrid").grid;
        },
        setValues: function (jq, rows) {
            return jq.each(function () {
                var opts = $(this).searchgrid("options");
                if ($.isArray(rows)) {
                    rows = $.map(rows, function (row) {
                        if (typeof row == "object") {
                            var v = row[opts.idField];
                            (function () {
                                for (var i = 0; i < opts.mappingRows.length; i++) {
                                    if (v == opts.mappingRows[i][opts.idField]) {
                                        return;
                                    }
                                }
                                opts.mappingRows.push(row);
                            })();
                            return v;
                        } else {
                            return row;
                        }
                    });
                }
                bindData(this, rows);
            });
        },
        setValue: function (jq, data) {
            return jq.each(function () {
                $(this).searchgrid("setValues", [data]);
            });
        },
        clear: function (jq) {
            return jq.each(function () {
                $(this).searchgrid("grid").datagrid("clearSelections");
                $(this).combo("clear");
            });
        },
        reset: function (jq) {
            return jq.each(function () {
                var opts = $(this).searchgrid("options");
                if (opts.multiple) {
                    $(this).searchgrid("setValues", opts.originalValue);
                } else {
                    $(this).searchgrid("setValue", opts.originalValue);
                }
            });
        },
        loadData: function (jq, data) {
            return $.data(jq[0], "searchgrid").grid.datagrid("loadData", data);
        },
        options: function (jq) {
            return $.data(jq[0], "searchgrid").options;
        }
    };
    $.fn.searchgrid.parseOptions = function (_a3b) {
        var t = $(_a3b);
        return $.extend({}, $.fn.combogrid.parseOptions(_a3b), $.parser.parseOptions(_a3b, ["idField", "textField", "mode"]));
    };
    $.fn.searchgrid.defaults = $.extend({}, $.fn.combogrid.defaults, {
        height: 24, loadMsg: null, idField: null, textField: null, unselectedValues: [], mappingRows: [], mode: "remote", delay: 1000, keyHandler: {
            up: function (e) {
                nav(this, "prev");
                e.preventDefault();
            },
            down: function (e) {
                nav(this, "next");
                e.preventDefault();
            }, left: function (e) {
            }, right: function (e) {
            }, enter: function (e) {
                enter(this);
            }, query: function (q, e) {
                query(this, q);
            },
            onSearch: function () { },
        }, filter: function (q, row) {
            var opts = $(this).searchgrid("options");
            return (row[opts.textField] || "").toLowerCase().indexOf(q.toLowerCase()) == 0;
        }
    });
})(jQuery);