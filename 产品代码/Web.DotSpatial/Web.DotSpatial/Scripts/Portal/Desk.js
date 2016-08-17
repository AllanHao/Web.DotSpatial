(function ($) {
    $(document).ready(function () {
        UI.fn.init.brandGrid();
        UI.fn.init.initPage();
       // UI.fn.data.loadBrandTotal();
    });
    UI = {
        fn: {
            init: {
                initPage: function () {
                    $("#btnSearch").linkbutton({
                        onClick: function () {
                            $.messager.alert("提示", "该模块还未开发...", "info");
                        }
                    });
                },
                brandGrid: function () {
                    $("#brandViewList").datagrid({
                        fitColumns: true,
                        columns: [
                                [
                                    { field: 'VarietyName', title: '业态', width: 100, rowspan: 3, align: 'center' },
                                    { field: 'SumCount', title: '总数', width: 100, rowspan: 3, align: 'center' },
                              { title: '品牌', colspan: 10, width: 300, align: 'center' },
                              { title: '联系人', colspan: 6, width: 300, align: 'center' }
                                ], [
                                { field: 'Add1', title: '新增', colspan: 5, width: 100, align: 'center' },
                                { field: 'Sum1', title: '累计', colspan: 5, width: 100, align: 'center' },
                                { field: 'Add2', title: '新增', colspan: 3, width: 100, align: 'center' },
                                { field: 'Sum2', title: '累计', colspan: 3, width: 100, align: 'center' }
                                ],
                                [
                                { field: 'Count', title: '数量', width: 100, align: 'center' },
                                { field: 'SameRate', title: '同比', width: 100, align: 'center' },
                                { field: 'AroundRate', title: '环比', width: 100, align: 'center' },
                                { field: 'Progress', title: '完整度', width: 100, align: 'center' },
                                { field: 'NoContactCount', title: '无联系人', width: 100, align: 'center' },

                                 { field: 'Count1', title: '数量', width: 100, align: 'center' },
                                { field: 'SameRate1', title: '同比', width: 100, align: 'center' },
                                { field: 'AroundRate1', title: '环比', width: 100, align: 'center' },
                                { field: 'Progress1', title: '完整度', width: 100, align: 'center' },
                                { field: 'NoContactCount1', title: '无联系人', width: 100, align: 'center' },

                                { field: 'Count2', title: '数量', width: 100, align: 'center' },
                                { field: 'SameRate2', title: '同比', width: 100, align: 'center' },
                                { field: 'AroundRate2', title: '环比', width: 100, align: 'center' },

                                { field: 'Count3', title: '数量', width: 100, align: 'center' },
                                { field: 'SameRate3', title: '同比', width: 100, align: 'center' },
                                { field: 'AroundRate3', title: '环比', width: 100, align: 'center' }
                                ]
                        ]
                    });
                }
            },
            data: {
                loadBrandTotal: function () {
                    doActionAsync("IWEHAVE.ERP.CommonBizBP.Agent.GetBrandTotalBPProxy", {}, function (data) {
                        if (data) {
                            $("#totalBrand").text(data.TotalBrand);
                            $("#totalProgress").text(data.Progress);
                            $("#totalLackBrand").text(data.LockBrand);
                            $("#totalNoContact").text(data.NoContactBrand);
                        }
                    }, null, null, false);
                }
            }
        }
        
    }
})(jQuery);