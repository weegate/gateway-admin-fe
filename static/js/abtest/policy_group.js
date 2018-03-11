// @author: wuyong
// @date: 2018/01/11
// @description: app module js, use sync ajax method to request RESTFUL Api.

var app = 'abtest';
var module = 'policy_group';

var module_page = "/" + [app,module].join('/');
var url_policy_group_page_update = module_page + '/update';

var api_version = "v1"
var module_api = "/" + [api_version,"api",app,module].join('/');
var url_policy_group_get = module_api + '/{{{id}}}';//GET
var url_policy_group_list = module_api + '/list';//GET
var url_policy_group_search = module_api + '/list';//GET
var url_policy_group_add = module_api; //POST
var url_policy_group_update = module_api;//PUT
var url_policy_group_delete = module_api + '/{{{id}}}';//DELETE

var policy_module_api = "/" + [api_version,"api",app,"policy"].join('/');
var url_policy_list = policy_module_api + '/list';//GET

// 命名空间
namespace('so.global.platform.abtest');
so.global.platform.abtest.policy_group = function () {};
so.global.platform.abtest.policy_group.prototype = {
    init: function () {
        policy_group.info();
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
        sync_get_ajax(url_policy_group_search, function (data) {
            policy_group.appendTable(data.data.list);
            var totleCount = data.data.totleCount;
            if (isFirstSearch) {
                policy_group.paginate(totleCount);
                isFirstSearch = false;
            }
        }, params);
    },
    info: function () {
        isSerach = false;
        offset = (pageNum - 1) * limit;
        sync_get_ajax(url_policy_group_list, function (data) {
            policy_group.appendTable(data.data.list);
            var totleCount = data.data.totleCount;
            if (isFirstList) {
                policy_group.paginate(totleCount);
                isFirstList = false;
            }
        }, {
            offset: offset,
            limit: limit
        });
    },
    getAvailablePolicies: function (){
        sync_get_ajax(url_policy_list, function (data) {
            var $selectElem = $("#policy_group_policyIds").select2();
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
        sync_get_ajax(url_policy_group_get.replace("{{{id}}}",id), function (data) {
            policy_group.setHtml(data.data);
        }, {
            id: id
        });
    },
    flushList: function () {

    },
    deletes: function (id) {
        if (!window.confirm('你确定要删除吗？')) {
            return;
        }
        sync_delete_ajax(url_policy_group_delete.replace("{{{id}}}",id) , function (data) {
            alert('删除成功');
            $('#tableTbody').empty();
            policy_group.info();
        },{
            id : id
        });
    },
    policy_group: function (id, status) {
        if (status == 1) {
            if (!window.confirm('你确定要通过吗？')) {
                return;
            }
        } else {
            if (!window.confirm('你确定要拒绝吗？')) {
                return;
            }
        }
        sync_get_ajax(url_policy_group_policy_group + '? id=' + id + '&status=' + status, function (data) {
            if (status == 1) {
                alert('通过完成');
            } else {
                alert('拒绝完成');
            }
            $('#tableTbody').empty();
            policy_group.review();
        });
    },
    // 将获取搭配信息放入到update
    setHtml: function (data) {
        $('#policy_group_id').val(data.Id);
        $('#policy_group_name').val(data.Name);
        $('#policy_group_policyIds').val(data.PolicyIds.split(","));
        $('#policy_group_policyIds').select2().trigger("change");
        $('#policy_group_permissions').val(data.Permissions);
        $('#policy_group_isDelete').val(data.isDelete);
        $('#policy_group_status').val(data.Status);
    },
    add: function () {
        var params = policy_group.getParam();
        if (params == false) {
            return;
        }
        sync_post_ajax(url_policy_group_add, function (data) {
            alert('添加完成');
        }, params);
    },
    update: function () {
        // 阻止默认的提交事件
        // event.preventDefault();
        var params = policy_group.getParam();
        if (params == false) {
            return;
        }
        sync_put_ajax(url_policy_group_update, function (data) {
            alert('修改成功!!!');
            policy_group.get(params.id);
        }, params);
    },
    // 显示列表
    appendTable: function (data, isAudit = false) {
        if (data.length == 0) {
            alert('没有数据呢!!!');
            return;
        }
        var html = '';
        data.forEach(function (item) {
            // alert(JSON.stringify(item.category));
            html += '<tr>';

            html += '<td><input type="hidden" name="id" value="' + item.Id + '"></td>';
            html += '<td>' + item.Id + '</td>';
            html += '<td>' + item.Name + '</td>';
            html += '<td>' + item.Policies + '</td>';
            html += '<td>' + item.CreateTime+ '</td>';
            html += '<td>' + item.UpdateTime + '</td>';
            if (isAudit) {

            } else {
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
                    default:
                        status = '未知状态';
                }
                html += '<td>' + status + '</td>';
            }
            // END_STATUS

            html += '<td>' + (item.IsDelete == 0 ? '有效' : '删除') + '</td>';
            if (isAudit) {
                var editUrl = url_policy_group_page_update + '?id=' + item.Id;
                html += '<td><a class="btn mini purple" href="' + editUrl + '"><i class="icon-edit"></i> Edit</a>' + '<a class="btn mini purple" href="javascript:policy_group.policy_group(' + item.Id + ',1);"><i class="icon-edit"></i> 通过</a>' + '<a class="btn mini black" href="javascript:policy_group.policy_group(' + item.Id + ',9);"><i class="icon-trash"></i> 拒绝 </a></td>';
            } else {
                var editUrl = url_policy_group_page_update + '?id=' + item.Id;
                html += '<td><a class="btn mini purple" href="' + editUrl + '"><i class="icon-edit"></i> Edit</a>' + '<a class="btn mini black" href="javascript:policy_group.deletes(' + item.Id + ');"><i class="icon-trash"></i> Delete</a></td>';
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

        var id = $.trim($('#policy_group_id').val());
        var name = $.trim($('#policy_group_name').val());
        var policyIds = $('#policy_group_policyIds').val().join();
        var permissions = $.trim($('#policy_group_permissions').val());
        var is_delete = $.trim($('#policy_group_isDelete').val());
        var status = $.trim($('#policy_group_status').val());

        if (id.length > 0) {
            params.id = id;
        }
        if (name.length > 0) {
            params.name = name;
        }

        if (policyIds.length > 0) {
            params.policyIds = policyIds;
        }

        if (permissions.length > 0) {
            params.permissions = permissions;
        }

        if (status.length > 0) {
            params.status = status;
        }

        if (is_delete.length > 0) {
            params.isDelete = is_delete;
        } else {
            params.isDelete = 0;
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
                    policy_group.search();
                } else {
                    policy_group.info();
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
var policy_group = new so.global.platform.abtest.policy_group();
// 校验规则
var policy_group_rules = {
    policy_group_name: {
        required: true,
        minlength: 2,
        maxlength: 40
    },
    policy_group_policyIds: {
        required: true
    },
    policy_group_permissions: {
        required: true,
        digits: true,
        range: [1, 99]
    }
};
var policy_group_messages = {
    policy_group_name: {
        required: '该项必填',
        minlength: '最小长度为2',
        maxlength: '最大长度为40'
    },
    policy_group_policyIds: {
        required: '该项必填'
    },
    policy_group_permissions: {
        required: '该项必填',
        digits: '只能是数字',
        range: '范围1~99'
    }
};
