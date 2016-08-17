function delegate(obj, callback) {
    return function () {
        if (obj) {
            callback.apply(obj, arguments);
        }
    }
}

$.extend($.fn.datagrid.defaults, {
    enableKeyBord: true,//是否绑定键盘操作键
    onEditCondition: function () {
        return true;
    },
    onEditRow: function (row, editRow) { },
    onEndLoad: function (data) {
        var opts = $.data(this, "datagrid").options;
        opts.editRow = null;
        if (opts.editColumns == undefined) {
            var editColumns = [];
            if (opts.frozenColumns) {
                $.each(opts.frozenColumns, function (i, items) {
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].editor) {
                            var obj = {};
                            obj.type = items[i].editor.type;
                            obj.field = items[i].field;
                            editColumns.push(obj);
                        }
                    }
                });
            }
            if (opts.columns) {
                $.each(opts.columns, function (i, items) {
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].editor) {
                            var obj = {};
                            obj.type = items[i].editor.type;
                            obj.field = items[i].field;
                            editColumns.push(obj);
                        }
                    }
                });
            }
            opts.editColumns = editColumns;
        }

        if (opts.editColumns.length > 0) {
            $.each(data.rows, function (i, item) {
                item.editKey = util.Guid.New();
            });
        }
        if (opts.enableKeyBord == true) {
            $(this).datagrid("bindKeyBoard");
            opts.enableKeyBord = null;
        } else if (opts.enableKeyBord == false) {
            $(this).datagrid("unbindKeyBoard");
            opts.enableKeyBord = null;
        }
    },
    onEndClickRow: function (rowIndex, rowData) {
        var opts = $.data(this, "datagrid").options;
        if (opts.editRow) {
            if (compare.call(this, opts.editRow, opts)) { //值未变则不掉服务
                var objT = getValue.call(this, opts.editRow, opts.editColumns);
                //异步操作需要显式的调用onEditEndCallback，如果同步只需要返回true就可以
                opts.onEditRow.call(this, opts.editRow, objT);
            }
            var index = $(this).datagrid("getRowIndex", opts.editRow);
            $(this).datagrid("endEdit", index);
            $(this).datagrid('getPanel').panel('panel').attr('tabindex', 1).focus();

        }
        opts.editRow = null;
        if (rowData) {
            if (opts && opts.editColumns.length > 0) {
                $(this).datagrid('getPanel').panel('panel').attr('tabindex', 1).focus();
                if (opts.onEditCondition.call(this, rowData)) {
                    var index = $(this).datagrid("getRowIndex", rowData);

                    $(this).datagrid("beginEdit", index);
                    var editor = $(this).datagrid('getEditor', { index: index, field: opts.editColumns[0].field });
                    if (editor) {
                        var target = editor.target[0];
                        if (target) {
                            target.focus();
                            target.select();
                        }
                    }
                    opts.editRow = rowData;
                }
            }
        }

        //比较是否有改变
        function compare(row, opts) {
            var objT = getValue.call(this, row, opts.editColumns);
            var cols = opts.editColumns;
            for (var i = 0; i < cols.length; i++) {
                var objV = objT[cols[i].field];
                var rowV = row[cols[i].field];
                if (objT[cols[i].type] == "numberbox") {
                    objV = parseFloat(objV);
                    rowV = parseFloat(rowV);
                }
                if (objV != rowV) {
                    return true;
                }
            }
            return false;
        }
        function getValue(row, cols) {
            var obj = util.Clone(row);
            if (row.id) {
                for (var i = 0; i < cols.length; i++) {
                    obj[cols[i].field] = getFieldValue.call(this, row, cols[i].field);
                }

            }
            return obj;
        }
        function getFieldValue(row, field) {
            var value = "";
            var index = $(this).datagrid("getRowIndex", rowData);
            var editor = $(this).datagrid('getEditor', { index: index, field: field });
            if (editor) {
                var target = editor.target[0];
                if (target && target.value) {
                    value = target.value;
                }
            }
            return value;
        }
    }
});

$.extend($.fn.datagrid.methods, {
    prevRow: function (jq, row) {
        var opts = $.data(jq[0], "datagrid").options;
        var data = $.data(jq[0], "datagrid").data;
        var index = $(jq[0]).datagrid("getRowIndex", row);
        if (index >= 0) {
            index--;
            index += data.rows.length;
            index %= data.rows.length;
            return data.rows[index];
        }
    },
    nextRow: function (jq, row) {
        var opts = $.data(jq[0], "datagrid").options;
        var data = $.data(jq[0], "datagrid").data;
        var index = $(jq[0]).datagrid("getRowIndex", row);
        if (index >= 0) {
            index++;
            index %= data.rows.length;
            return data.rows[index];
        }
    },
    unbindKeyBoard: function (jq) {
        return jq.each(function () {
            $(this).datagrid('getPanel').panel('panel').attr('tabindex', 1).unbind('keydown');
        });
    },
    bindKeyBoard: function (jq) {
        return jq.each(function () {
            $(this).datagrid('getPanel').panel('panel').attr('tabindex', 1).bind('keydown', delegate(this, function (e) {
                var row = $(this).datagrid("getSelected");
                var opts = $.data(this, "datagrid").options;
                switch (e.keyCode) {
                    case 27://Esc
                        cancleEditRow.call(this, row, opts);
                        break;
                    case 38: // up
                        movePrev.call(this, row, opts);
                        e.preventDefault();
                        break;
                    case 40: // down
                        moveNext.call(this, row, opts);
                        e.preventDefault();
                        break;
                    case 13://enter
                        if (opts && opts.editColumns.length > 0) {
                            if (opts.editRow) {
                                submitRow.call(this, row, opts);
                            } else {
                                editRow.call(this, row, opts);
                            }
                        } else {
                            if (opts.onDblClickRow) {
                                var index = $(this).datagrid("getRowIndex", opts.editRow);
                                opts.onDblClickRow.call(this, index, row);
                            }
                        }
                        e.preventDefault();

                }


                function moveNext(row, opts) {//down键  
                    if (row) {
                        var r = $(this).datagrid("nextRow", row);
                        focusRow.call(this, r, opts);
                    }
                }

                function movePrev(row, opts) { //选中上一行
                    if (row) {
                        var r = $(this).datagrid("prevRow", row);
                        focusRow.call(this, r, opts);
                    }
                }


                function editRow(row) {  //开始编辑
                    if (opts.onEndClickRow) {
                        var index = $(this).datagrid("getRowIndex", row);
                        opts.onEndClickRow.call(this, index, row);
                    }
                }
                function submitRow(row, opts) {
                    if (opts.onEndClickRow) {
                        var index = $(this).datagrid("getRowIndex", row);
                        opts.onEndClickRow.call(this, index, null);
                    }
                }
                function cancleEditRow(row, opts) {
                    if (opts.editRow) {
                        var index = $(this).datagrid("getRowIndex", opts.editRow);
                        $(this).datagrid("endEdit", index);
                        $(this).datagrid('getPanel').panel('panel').attr('tabindex', 1).focus();
                        opts.editRow = null;
                    }
                }
                function focusRow(row, opts) {
                    var index = $(this).datagrid("getRowIndex", row);
                    $(this).datagrid("selectRow", index);
                    if (opts.onClickRow) {
                        opts.onClickRow.call(this, index, row);
                    }
                    if (opts.onEndClickRow) {
                        opts.onEndClickRow.call(this, index, row);
                    }
                }

            }));
        });
    }
});


//treegrid标题右键菜单
$.extend($.fn.treegrid.defaults, {
    enableKeyBord: true,//是否绑定键盘操作键
    onEditCondition: function () {
        return true;
    },
    onEditRow: function (row, editRow) { },
    onEndLoad: function (node, data) {
        var opts = $.data(this, "datagrid").options;
        opts.editRow = null;
        if (opts.editColumns == undefined) {
            var editColumns = [];
            if (opts.frozenColumns) {
                $.each(opts.frozenColumns, function (i, items) {
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].editor) {
                            var obj = {};
                            obj.type = items[i].editor.type;
                            obj.field = items[i].field;
                            editColumns.push(obj);
                        }
                    }
                });
            }
            if (opts.columns) {
                $.each(opts.columns, function (i, items) {
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].editor) {
                            var obj = {};
                            obj.type = items[i].editor.type;
                            obj.field = items[i].field;
                            editColumns.push(obj);
                        }
                    }
                });
            }
            opts.editColumns = editColumns;
        }

        if (opts.editColumns.length > 0) {
            $.each(data, function (i, item) {
                item.editKey = util.Guid.New();
            });
        }
        if (opts.enableKeyBord == true) {
            $(this).treegrid("bindKeyBoard");
            opts.enableKeyBord = null;
        } else if (opts.enableKeyBord == false) {
            $(this).treegrid("unbindKeyBoard");
            opts.enableKeyBord = null;
        }
    },
    onEndClickRow: function (rowData) {
        var opts = $.data(this, "datagrid").options;
        if (opts.editRow) {
            if (compare.call(this, opts.editRow, opts)) { //值未变则不掉服务
                var objT = getValue.call(this, opts.editRow, opts.editColumns);
                //异步操作需要显式的调用onEditEndCallback，如果同步只需要返回true就可以
                opts.onEditRow.call(this, opts.editRow, objT);
            }
            $(this).treegrid("endEdit", opts.editRow.id);
            $(this).treegrid('getPanel').panel('panel').attr('tabindex', 1).focus();

        }
        opts.editRow = null;
        if (rowData) {
            if (opts && opts.editColumns.length > 0) {
                $(this).treegrid('getPanel').panel('panel').attr('tabindex', 1).focus();
                if (opts.onEditCondition.call(this, rowData)) {
                    $(this).treegrid("beginEdit", rowData.id);
                    var index = $(this).treegrid("getRowIndex", rowData);
                    var editor = $(this).treegrid('getEditor', { index: index, field: opts.editColumns[0].field });
                    if (editor) {
                        var target = editor.target[0];
                        if (target) {
                            target.focus();
                            target.select();
                        }
                    }
                    opts.editRow = rowData;
                }
            }
        }

        //比较是否有改变
        function compare(row, opts) {
            var objT = getValue.call(this, row, opts.editColumns);
            var cols = opts.editColumns;
            for (var i = 0; i < cols.length; i++) {
                var objV = objT[cols[i].field];
                var rowV = row[cols[i].field];
                if (objT[cols[i].type] == "numberbox") {
                    objV = parseFloat(objV);
                    rowV = parseFloat(rowV);
                }
                if (objV != rowV) {
                    return true;
                }
            }
            return false;
        }
        function getValue(row, cols) {
            var obj = util.Clone(row);
            if (row.id) {
                for (var i = 0; i < cols.length; i++) {
                    obj[cols[i].field] = getFieldValue.call(this, row, cols[i].field);
                }

            }
            return obj;
        }
        function getFieldValue(row, field) {
            var value = "";
            var editor = $(this).treegrid('getEditor', { index: row.id, field: field });
            if (editor) {
                var target = editor.target[0];
                if (target && target.value) {
                    value = target.value;
                }
            }
            return value;
        }
    }
});
//扩展编辑
$.extend($.fn.treegrid.methods, {
    getDataArray: function (data) {
        var array = [];
        $.each(data, function (i, item) {
            getArray(array, item);
        });
        function getArray(array, c) {
            array.push(c);
            if (c.children && c.state == "open") {
                $.each(c.children, function (i, item) {
                    getArray(array, item);
                });
            }
        }
        return array;
    },
    getRowIndex: function (jq, row) {
        var opts = $.data(jq[0], "treegrid").options;
        var data = $.data(jq[0], "treegrid").data;
        var idField = opts.idField;
        var dataArray = $.fn.treegrid.methods.getDataArray(data);
        var index = -1;
        $.each(dataArray, function (i, item) {
            if (item[idField] == row[idField]) {
                index = i;
                return false;
            }
        });
        return index;
    },
    prevRow: function (jq, row) {
        var opts = $.data(jq[0], "treegrid").options;
        var data = $.data(jq[0], "treegrid").data;
        var idField = opts.idField;
        var dataArray = $.fn.treegrid.methods.getDataArray(data);
        var index = -1;
        $.each(dataArray, function (i, item) {
            if (item[idField] == row[idField]) {
                index = i;
                return false;
            }
        });
        if (index >= 0) {
            index--;
            index += dataArray.length;
            index %= dataArray.length;
            return dataArray[index];
        }
    },
    nextRow: function (jq, row) {
        var opts = $.data(jq[0], "treegrid").options;
        var data = $.data(jq[0], "treegrid").data;
        var idField = opts.idField;
        var dataArray = $.fn.treegrid.methods.getDataArray(data);
        var index = -1;
        $.each(dataArray, function (i, item) {
            if (item[idField] == row[idField]) {
                index = i;
                return false;
            }
        });
        if (index >= 0) {
            index++;
            index %= dataArray.length;
            return dataArray[index];
        }
    },
    unbindKeyBoard: function (jq) {
        return jq.each(function () {
            $(this).treegrid('getPanel').panel('panel').attr('tabindex', 1).unbind('keydown');
        });
    },
    bindKeyBoard: function (jq) {
        return jq.each(function () {
            $(this).treegrid('getPanel').panel('panel').attr('tabindex', 1).bind('keydown', delegate(this, function (e) {
                var row = $(this).treegrid("getSelected");
                var opts = $.data(this, "datagrid").options;

                switch (e.keyCode) {
                    case 27://Esc
                        cancleEditRow.call(this, row, opts);
                        break;
                    case 39: //right
                        if (row && row.state == 'closed') {
                            $(this).treegrid("expand", row.id);
                        }
                        break;
                    case 37: //left
                        if (row && row.attributes.hasExpand) {
                            $(this).treegrid("collapse", row.id);
                        }
                        break;
                    case 38: // up
                        movePrev.call(this, row, opts);
                        e.preventDefault();
                        break;
                    case 40: // down
                        moveNext.call(this, row, opts);
                        e.preventDefault();
                        break;
                    case 13://enter
                        if (opts && opts.editColumns.length > 0) {
                            if (opts.editRow) {
                                submitRow.call(this, row, opts);
                            } else {
                                editRow.call(this, row, opts);
                            }
                        } else {
                            if (opts.onDblClickRow) {
                                opts.onDblClickRow.call(this, row);
                            }
                        }
                        e.preventDefault();

                }


                function moveNext(row, opts) {//down键  
                    if (row) {
                        var r = $(this).treegrid("nextRow", row);
                        focusRow.call(this, r, opts);
                    }
                }

                function movePrev(row, opts) { //选中上一行
                    if (row) {
                        var r = $(this).treegrid("prevRow", row);
                        focusRow.call(this, r, opts);
                    }
                }


                function editRow(row) {  //开始编辑
                    if (opts.onEndClickRow) {
                        var index = $(this).treegrid("getRowIndex", row);
                        opts.onEndClickRow.call(this, index, row);
                    }
                }
                function submitRow(row, opts) {
                    if (opts.onEndClickRow) {
                        var index = $(this).treegrid("getRowIndex", row);
                        opts.onEndClickRow.call(this, index, null);
                    }
                }
                function cancleEditRow(row, opts) {
                    if (opts.editRow) {
                        $(this).treegrid("endEdit", opts.editRow.id);
                        $(this).treegrid('getPanel').panel('panel').attr('tabindex', 1).focus();
                        opts.editRow = null;
                    }
                }
                function focusRow(row, opts) {
                    $(this).treegrid("select", row.id);
                    if (opts.onClickRow) {
                        var index = $(this).treegrid("getRowIndex", row);
                        opts.onClickRow.call(this, index, row);
                    }
                    if (opts.onEndClickRow) {
                        var index = $(this).treegrid("getRowIndex", row);
                        opts.onEndClickRow.call(this, index, row);
                    }
                }

            }));
        });
    }
});