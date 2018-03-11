// @author: wuyong
// @date: 2018/01/11
// @description: app module js, use sync ajax method to request RESTFUL Api.

var app = 'abtest';
var module = 'runtime';

var module_page = "/" + [app,module].join('/');
var url_runtime_page_update = module_page + '/update';

var api_version = "v1"
var module_api = "/" + [api_version,"api",app,module].join('/');
var url_runtime_get = module_api + '/{{{id}}}';//GET
var url_runtime_list = module_api + '/list';//GET
var url_runtime_search = module_api + '/list';//GET
var url_runtime_add = module_api; //POST
var url_runtime_update = module_api;//PUT
var url_runtime_delete = module_api + '/{{{id}}}';//DELETE

var policy_module_api = "/" + [api_version,"api",app,"policy"].join('/');
var url_policy_list = policy_module_api + '/list';//GET

var policy_group_module_api = "/" + [api_version,"api",app,"policy_group"].join('/');
var url_policy_group_list = policy_group_module_api + '/list';//GET

// 命名空间
namespace('so.global.platform.abtest');
so.global.platform.abtest.runtime = function () {};
so.global.platform.abtest.runtime.prototype = {
    init: function () {
        runtime.info();
    },
    search: function () {
        isSerach = true;
        var name = $.trim($('#search_name').val());
        var status = $.trim($('#search_status').val());
        var is_delete = $.trim($('#search_isDelete').val());
        var params = new Object();

        if (name.length > 0) {
            params.name = name;
        }
        if (status.length > 0) {
            params.status = status;
        }
        if (is_delete.length > 0) {
            params.is_delete = is_delete;
        }
        if (isEmpty(params)) {
            alert('请输入查询条件哦');
            return;
        }
        // 分页
        if (isFirstSerach == 0) {
            pageNum = 1;
            isFirstSerach++;
        }
        offset = (pageNum - 1) * limit;
        params.offset = offset;
        params.limit = limit;
        sync_post_ajax(url_runtime_search, function (data) {
            runtime.appendTable(data.data.list);
            var totleCount = data.data.totleCount;
            if (isFirstSearch) {
                runtime.paginate(totleCount);
                isFirstSearch = false;
            }
        }, params);
    },
    info: function () {
        isSerach = false;
        offset = (pageNum - 1) * limit;
        sync_get_ajax(url_runtime_list, function (data) {
            runtime.appendTable(data.data.list);
            var totleCount = data.data.totleCount;
            if (isFirstList) {
                runtime.paginate(totleCount);
                isFirstList = false;
            }
        }, {
            offset: offset,
            limit: limit
        });
    },
    getAvailableGroups: function (){
        sync_get_ajax(url_policy_group_list, function (data) {
            var $selectElem = $("#runtime_groupId").select2();
            data.data.list.forEach(function (item) {
                var option = new Option(item.Name, item.Id, true, false)
                $selectElem.append(option)
            });
            $selectElem.trigger('change')
        }, {
            status: 0,
            is_delete: 0
        });
    },
    getAvailablePolicies: function (){
        sync_get_ajax(url_policy_list, function (data) {
            var $selectElem = $("#runtime_policyId").select2();
            data.data.list.forEach(function (item) {
                var option = new Option(item.Name, item.Id, true, false)
                $selectElem.append(option)
            });
            $selectElem.trigger('change')
        }, {
            status: 0,
            is_delete: 0
        });
    },
    get: function (id) {
        if(id==null || typeof(id)!="string"){
            alert("id not string or id is null")
            return;
        }
        sync_get_ajax(url_runtime_get.replace(/{{{id}}}/,id), function (data) {
            runtime.setHtml(data.data);
        }, {
        });
    },
    flushList: function () {

    },
    deletes: function (id) {
        if(id==null || typeof(id)!="number"){
            alert("id not number or id is null")
            return;
        }
        if (!window.confirm('你确定要删除吗？')) {
            return;
        }
        sync_delete_ajax(url_runtime_delete.replace(/{{{id}}}/,id), function (data) {
            alert('删除成功');
            $('#tableTbody').empty();
            runtime.info();
        },{
        });
    },
    runtime: function (id, status) {
        switch (status) {
            case 0:
                if (!window.confirm('你确定要通过吗？')) {
                    return;
                }
                break
            case 2:
                if (!window.confirm('你确定要拒绝吗？')) {
                    return;
                }
                break
            case 3:
                if (!window.confirm('你确定要下线吗？')) {
                    return;
                }
                break
            case 4:
                if (!window.confirm('你确定要上线吗？')) {
                    return;
                }
                break
        }
        sync_put_ajax(url_runtime_update, function (data) {
            switch (status) {
                case 0:
                    alert("通过审核")
                    break
                case 2:
                    alert("拒绝审核")
                    break
                case 3:
                    alert("下线操作")
                    break
                case 4:
                    alert("上线操作")
                    break
            }
            $('#tableTbody').empty();
            runtime.info();
        },{id:id,status:status});
    },
    // 将获取搭配信息放入到update
    setHtml: function (data) {

        $('#runtime_id').val(data.Id);
        $('#runtime_serverName').val(data.ServerName);
        if (data.PolicyId > 0){
            $('#runtime_policyId').val(data.PolicyId);
            $('#runtime_policyId').select2().trigger("change");
        }else{
            //$("#runtime_policyId").attr("disabled","disabled");
        }
        if (data.GroupId > 0) {
            $('#runtime_groupId').val(data.GroupId);
            $('#runtime_groupId').select2().trigger("change");
        }else{
            //$("#runtime_groupId").attr("disabled","disabled");
        }
        $('#runtime_status').val(data.Status);
        $('#runtime_isdelete').val(data.IsDelete);
    },
    add: function () {
        var params = runtime.getParam();
        if (params.policyId>0 && params.groupId>0){
            alert("策略和策略组不能都选，只能2选1")
            return;
        }
        if (params == false) {
            return;
        }
        sync_post_ajax(url_runtime_add, function (data) {
            alert('添加完成');
        }, params);
    },
    update: function () {
        // 阻止默认的提交事件
        // event.preventDefault();
        var params = runtime.getParam();
        if (params == false) {
            return;
        }
        if (params.policyId>0 && params.groupId>0){
            alert("策略和策略组不能都选，只能2选1")
            return;
        }
        sync_put_ajax(url_runtime_update, function (data) {
            alert('修改成功!!!');
            runtime.get(params.id);
        }, params);
    },
    // 显示列表
    appendTable: function (data, isAudit=false) {
        if (data.length == 0) {
            alert('没有数据呢!!!');
            return;
        }
        var html = '';
        data.forEach(function (item) {
            html += '<tr>';

            html += '<td><input type="hidden" name="id" value="' + item.Id+ '"></td>';
            html += '<td>' + item.Id + '</td>';
            html += '<td>' + item.ServerName + '</td>';
            if (item.PolicyId > 0) {
                html += '<td>' + item.PolicyName+ '</td>';
            }else{
                html += '<td>' + "" + '</td>';
            }
            if (item.GroupId > 0) {
                html += '<td>' + item.GroupName+ '</td>';
            }else{
                html += '<td>' + "" + '</td>';
            }
            //html += '<td>' + '<button type="button" class="info-info" role="button" data-toggle="popover" data-trigger="focus" title="详细信息" data-content=\'' + infoHtml + '\'>查看</button>' + '</td>';
            html += '<td>' + item.CreateTime+ '</td>';
            html += '<td>' + item.UpdateTime+ '</td>';
            var status = '';
            switch (item.Status + '') {
                case '0':
                    status = '通过';
                    break;
                case '1':
                    status = '审核中';
                    break;
                case '2':
                    status = '拒绝';
                    break;
                case '3':
                    status = '下线';
                    break;
                case '4':
                    status = '上线';
                    break;
                default:
                    status = '未知状态';
            }
            html += '<td>' + status + '</td>';
            // END_STATUS
            html += '<td>' + (item.IsDelete == 0 ? '有效' : '删除') + '</td>';
            
            var editUrl = url_runtime_page_update + '?id=' + item.Id;
            if (isAudit) {
                html += '<td>'
                html += '<a class="btn mini purple" href="' + editUrl + '"><i class="icon-edit"></i> Edit</a>';
                html += '<a class="btn mini black" href="javascript:runtime.deletes(' + item.Id + ');"><i class="icon-trash"></i> Delete</a>';
                html += item.Status==1||item.Status==2 ? '<a class="btn mini purple" href="javascript:runtime.runtime(' + item.Id + ',0);"><i class="icon-edit"></i> 通过</a>':"";
                html += item.Status==0||item.Status==1 ? '<a class="btn mini black" href="javascript:runtime.runtime(' + item.Id + ',2);"><i class="icon-trash"></i> 拒绝 </a>':"";
                html += item.Status==4 ? '<a class="btn mini black" href="javascript:runtime.runtime(' + item.Id + ',3);"><i class="icon-trash"></i>下线</a>':"";
                html += item.Status==0||item.Status==3 ? '<a class="btn mini black" href="javascript:runtime.runtime(' + item.Id + ',4);"><i class="icon-trash"></i>上线</a>':"";
                html += '</td>'
            } else {
                html += '<td>'
                html += '<a class="btn mini purple" href="' + editUrl + '"><i class="icon-edit"></i> Edit</a>';
                html += item.Status==1||item.Status==2 ? '<a class="btn mini black" href="javascript:runtime.deletes(' + item.Id + ');"><i class="icon-trash"></i> Delete</a>':"";
                html += item.Status==1||item.Status==2 ? '<a class="btn mini purple" href="javascript:runtime.runtime(' + item.Id + ',0);"><i class="icon-edit"></i> 通过</a>':"";
                html += item.Status==0||item.Status==1 ? '<a class="btn mini black" href="javascript:runtime.runtime(' + item.Id + ',2);"><i class="icon-trash"></i> 拒绝 </a>':"";
                html += item.Status==4 ? '<a class="btn mini black" href="javascript:runtime.runtime(' + item.Id + ',3);"><i class="icon-trash"></i>下线</a>':"";
                html += item.Status==0||item.Status==3 ? '<a class="btn mini black" href="javascript:runtime.runtime(' + item.Id + ',4);"><i class="icon-trash"></i>上线</a>':"";
                html += '</td>'
            }
            // END_OPEAR
            html += '</tr>';
        });
        $('#tableTbody').empty();
        $('#tableTbody').append(html);
        $('.info-info').each(function (index) {
            $(this).popover();
        });
    },
    getParam: function () {
        var params = new Object();

        var id = $.trim($('#runtime_id').val());
        var serverName = $.trim($('#runtime_serverName').val());
        var policyId = $.trim($('#runtime_policyId').val());
        var groupId = $.trim($('#runtime_groupId').val());
        var is_delete = $.trim($('#runtime_isdelete').val());
        var status = $.trim($('#runtime_status').val());

        if (id.length > 0) {
            params.id = id;
        }
        if (serverName.length > 0) {
            params.serverName = serverName;
        }

        if (policyId.length > 0) {
            params.policyId = policyId;
        }

        if (groupId.length > 0) {
            params.groupId = groupId;
        }

        if (status.length > 0) {
            params.status = status;
        }

        if (is_delete.length > 0) {
            params.is_delete = is_delete;
        } else {
            params.is_delete = 0;
        }

        return params;
    },
    paginate: function (count) {
        $('#pager').jBootstrapPage({
            pageSize: limit,
            total: count,
            maxPageButton: 10,
            onPageClicked: function (obj, pageIndex) {
                // $('#pageIndex').html('您选择了第<font color=red>'+(pageIndex+1)+'</font>页');
                pageNum = pageIndex + 1;
                if (isSerach) {
                    runtime.search();
                } else {
                    runtime.info();
                }
            }
        });
    },
    parseArray: function (key, $arr) {
        var infoHtml = '';
        if ($.isArray($arr)) {
            for (var i = 0; i < $arr.length; i++) {
                infoHtml += key + ' : ' + $arr[i] + '\n';
            }
        } else {
            infoHtml += key + ' : ' + $arr + '\n';
        }
        return infoHtml;
    },
    directUrl: function (url) {
        var urlObj = window.url('{}', url);
        var urlPath1 = urlObj.path + '?';
        var urlPath2 = urlObj.path + '/?';
        if (url.indexOf(urlPath1) < 0 && url.indexOf(urlPath2) < 0) {
            return false;
        }
        return true;
    },
}

var runtime = new so.global.platform.abtest.runtime();

// 校验规则
var runtime_rules = {
    runtime_serverName: {
        required: true,
        minlength: 5,
        maxlength: 20
    },
    runtime_policyId: {
        required: true
    },
    runtime_groupId: {
        required: true
    },
    runtime_status: {
        required: true,
        digits: true,
        range: [0,4]
    },
    runtime_isDelete: {
        required: true,
        digits: true,
        range: [0,1]
    }
};
var runtime_messages = {
    runtime_serverName: {
        required: '该项必填',
        minlength: '最小长度为5',
        maxlength: '最大长度为40'
    },
    runtime_policyId: {
        required: '该项必填'
    },
    runtime_groupId: {
        required: '该项必填'
    },
    runtime_status: {
        required: '该项必填',
        digits: '只能是数字',
        range: '范围0~4'
    },
    runtime_isDelete: {
        required: '该项必填',
        digits: '只能是数字',
        range: '范围0~1'
    }
};
