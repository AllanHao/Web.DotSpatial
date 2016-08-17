easyui = {
    getResult: function (dataUrl, arg, callback, callbackArgs, asynccallback, displayLoading) {
        var _data = null;
        var args = {};
        args = arg;
        if (asynccallback) {
            doActionAsync(dataUrl, args, function (result) {
                if (result == null) {
                    _data = null;
                }
                else {
                    _data = result;
                    if (result.ListCount == undefined) {
                        //整理数据
                        $.each(_data, function (i, item) {
                            if (callback) {
                                callback.call(item, callbackArgs);
                            }
                        });
                    }
                }
                asynccallback(_data);
            }, null, null, displayLoading);
        } else {
            doAction(dataUrl, args, function (result) {
                if (result == null) {
                    _data = null;
                }
                else {
                    _data = result;
                    if (result.ListCount == undefined) {
                        //整理数据
                        $.each(_data, function (i, item) {
                            if (callback) {
                                callback.call(item, callbackArgs);
                            }
                        });
                    }
                }
            }, null, null, displayLoading);
        }
        return _data;
    },
    tree: {//获取树型结构id:选择器名称，dataUrl:请求数据地址，args:参数,typeEnum：控件类型
        append: function (id, _data, node, treeEnum) {
            if (treeEnum == "tree") {//一般树
                $(id).tree('append', {
                    parent: node.target,
                    data: _data
                });
            } else if (treeEnum == "combotree") {//下拉列表树
                $(id).combotree('tree').tree('append', {
                    parent: node.target,
                    data: _data
                });
            } else if (treeEnum == "treegrid") {
                $(id).treegrid('append', {
                    parent: node.id,
                    data: _data
                });
            }
            node.state = "open";
        },
        getChildren: function (id, node, dataUrl, arg, treeEnum, callback, callbackArgs) {
            if (node) {
                easyui.getResult(dataUrl, arg, callback, callbackArgs, function (_data) {
                    if (_data != null) {
                        //格式化数据
                        //追加子节点
                        //-------treegrid分页新加代码
                        if (_data.ListData != undefined) {
                            _data = _data.ListData;
                            if (callback) {
                                $.each(_data, function (i, item) {
                                    callback.call(item, callbackArgs);
                                });
                            }
                        }
                        //---------------------
                        var children = [];
                        if (node.target != undefined) {
                            if (treeEnum == "combotree") {
                                children = $(id).combotree("tree").tree('getChildren', node.target);
                            } else {
                                children = $(id).tree('getChildren', node.target);
                            }
                        } else if (node.children != undefined) {
                            children = node.children;
                        }
                        if (children.length > 0) {
                            $.each(children, function (i, item) {
                                for (var j = 0; j < _data.length; j++) {
                                    if (item.ID != undefined) {
                                        if (item.ID == _data[j].ID) {
                                            _data = util.ArrayHelper.removeAt(_data, j);
                                        }
                                    } else {
                                        if (item.id == _data[j].ID) {
                                            _data = util.ArrayHelper.removeAt(_data, j);
                                        }
                                    }
                                }
                            });

                        }
                        easyui.tree.append(id, _data, node, treeEnum);

                    }
                });

            }
        },
        getTreeNode: function (id, dataUrl, args, treeEnum, callback, callbackArgs, loadedCallback, afterloadCallback) {
            easyui.getResult(dataUrl, args, callback, callbackArgs, function (result) {
                if (result != null) {
                    if (loadedCallback) {
                        loadedCallback(result);
                    }

                    if (result.length > 0) {
                        //树
                        if (treeEnum == "tree") {
                            $(id).tree({
                                animate: true,
                                onBeforeExpand: function (node) {
                                    args.ID = parseInt(node.id);
                                    if (!node.attributes.hasExpand) {
                                        node.attributes.hasExpand = true;
                                        easyui.tree.getChildren(id, node, dataUrl, args, treeEnum, callback, callbackArgs);
                                    }
                                }
                            }).tree("loadData", result);

                        } else if (treeEnum == "combotree") {//下拉列表树
                            //下拉组织
                            $(id).combotree({
                                onBeforeExpand: function (node) {
                                    args.ID = parseInt(node.id);
                                    if (!node.attributes.hasExpand) {
                                        node.attributes.hasExpand = true;
                                        easyui.tree.getChildren(id, node, dataUrl, args, treeEnum, callback, callbackArgs);
                                    }

                                }
                            }).combotree('loadData', result);
                        } else if (treeEnum == "treegrid") {//树列表
                            $(id).treegrid({
                                onBeforeExpand: function (node) {
                                    if (!node.attributes.hasExpand) {
                                        args.ID = node.ID;
                                        node.attributes.hasExpand = true;
                                        easyui.tree.getChildren(id, node, dataUrl, args, treeEnum, callback, callbackArgs);
                                    }
                                }
                            }).treegrid('loadData', result);

                        }
                    }
                    if (afterloadCallback) {
                        afterloadCallback(result);
                    }
                }
            });
        }
    },
    combogrid: {//获取combogrid列表数据
        getComboGridList: function (id, args, dataUrl, callback) {
            easyui.getResult(dataUrl, args, null, null, function (result) {
                var _callback = callback;
                if (result != null) {
                    var _dataCount = result.ListCount;
                    var _data = result.ListData;
                    if (callback) {
                        callback(_data);
                    }
                    $(id).combogrid("grid").datagrid('loadData', _data);
                    $(id).combogrid("grid").datagrid('getPager').pagination({
                        pageSize: args.pageSize,
                        total: _dataCount,
                        pageNumber: args.pageIndex,
                        onSelectPage: function (pageNumber, pageSize) {
                            $(id).parent().find("div .datagrid-header-check").children("input[type='checkbox']").eq(0).attr("checked", false);
                            args.pageIndex = pageNumber;
                            args.pageSize = pageSize;
                            easyui.combogrid.getComboGridList(id, args, dataUrl, _callback);
                        },
                        onRefresh: function (pageNumber, pageSize) {
                            $(id).parent().find("div .datagrid-header-check").children("input[type='checkbox']").eq(0).attr("checked", false);
                            args.pageIndex = pageNumber;
                            args.pageSize = pageSize;
                            easyui.combogrid.getComboGridList(id, args, dataUrl, _callback);
                        }
                    });

                }
            });
        }
    },
    datagrid: {//获取DataGrid列表数据
        getDataGridList: function (id, args, dataUrl, callback, loadedCallback) {
            easyui.getResult(dataUrl, args, null, null, function (result) {
                if (result != null && result.ListData != null) {
                    var _dataCount = result.ListCount;
                    var _data = result.ListData;
                    if (callback) {
                        callback(_data);
                    }
                    if (_data == "") {
                        _data = [];
                    }
                    $(id).datagrid('loadData', _data);
                    $(id).datagrid('getPager').pagination({
                        pageSize: args.pageSize,
                        total: _dataCount,
                        pageNumber: args.pageIndex,
                        pageList: [5, 10, 20, 30, 40, 50],
                        onSelectPage: function (pageNumber, pageSize) {
                            $(id).parent().find("div .datagrid-header-check").children("input[type='checkbox']").eq(0).attr("checked", false);
                            args.pageIndex = pageNumber;
                            args.pageSize = pageSize;
                            easyui.datagrid.getDataGridList(id, args, dataUrl, callback, loadedCallback);
                        },
                        onRefresh: function (pageNumber, pageSize) {
                            $(id).parent().find("div .datagrid-header-check").children("input[type='checkbox']").eq(0).attr("checked", false);
                            args.pageIndex = pageNumber;
                            args.pageSize = pageSize;
                            easyui.datagrid.getDataGridList(id, args, dataUrl, callback, loadedCallback);
                        }
                    });
                    if (loadedCallback) {
                        loadedCallback(_data);
                    }

                }
            });

        },
        getDataGridPagerSize: function (id) {
            var pagerSize = {};
            var pager = $("#" + id).datagrid("getPager");
            if (pager) {
                pagerSize.Size = pager.pagination("options").pageSize;
                pagerSize.Page = pager.pagination("options").pageNumber;
            }
            return pagerSize;
        }
    },
    treegrid: {//treegrid分页
        getTreeGridList: function (id, dataUrl, args, callback, callbackArgs, loadedCallback, afterloadCallback, isPecial) {
            easyui.getResult(dataUrl, args, callback, callbackArgs, function (result) {
                if (result != null && result.ListData != null) {
                    var _dataCount = result.ListCount;
                    var _data = result.ListData;

                    if (callback) {
                        $.each(_data, function (i, item) {
                            callback.call(item, callbackArgs);
                        });
                    }

                    if (_data == "") {
                        _data = [];
                    }
                    $(id).treegrid('loadData', []);

                    if (isPecial) {
                        //特殊页面：如toolbar上有combobox之类的，自定义的onBeforeExpand事件的,只需要加载数据就行
                        $(id).treegrid('loadData', _data);
                    } else {
                        $(id).treegrid({
                            onBeforeExpand: function (node) {
                                if (!node.attributes.hasExpand) {
                                    args.ID = node.ID;
                                    node.attributes.hasExpand = true;
                                    //展开子节点不需要分页
                                    args.pageIndex = 0;
                                    args.pageSize = 0;
                                    easyui.tree.getChildren(id, node, dataUrl, args, "treegrid", callback, callbackArgs);
                                }
                            }
                        }).treegrid('loadData', _data);
                    }
                    $(id).treegrid('getPager').pagination({
                        pageSize: args.pageSize,
                        total: _dataCount,
                        pageNumber: args.pageIndex,
                        onSelectPage: function (pageNumber, pageSize) {
                            args.ID = 0;
                            args.pageIndex = pageNumber;
                            args.pageSize = pageSize;
                            easyui.treegrid.getTreeGridList(id, dataUrl, args, callback, callbackArgs, loadedCallback, afterloadCallback, isPecial);
                        },
                        onRefresh: function (pageNumber, pageSize) {
                            args.ID = 0;
                            args.pageIndex = pageNumber;
                            args.pageSize = pageSize;
                            easyui.treegrid.getTreeGridList(id, dataUrl, args, callback, callbackArgs, loadedCallback, afterloadCallback, isPecial);
                        }
                    });

                    if (loadedCallback) {
                        loadedCallback(_data);
                    }

                }
            });

        }
    }

}