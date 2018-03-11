// @author: wuyong
// @date: 2018/01/11
// @description: app module js, use sync ajax method to request RESTFUL Api.

var app = 'abtest';
var module = 'policy';

var module_page = "/" + [app,module].join('/');
var url_policy_page_update = module_page + '/update';

var api_version = "v1"
var module_api = "/" + [api_version,"api",app,module].join('/');
var url_policy_get = module_api + '/{{{id}}}';//GET
var url_policy_list = module_api + '/list';//GET
var url_policy_search = module_api + '/list';//GET
var url_policy_add = module_api; //POST
var url_policy_update = module_api;//PUT
var url_policy_delete = module_api + '/{{{id}}}';//DELETE

// 命名空间
namespace('so.global.platform.abtest');
so.global.platform.abtest.policy = function () {};
so.global.platform.abtest.policy.prototype = {
    init: function () {
        policy.info();
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
        sync_post_ajax(url_policy_search, function (data) {
            policy.appendTable(data.data.list);
            var totleCount = data.data.totleCount;
            if (isFirstSearch) {
                policy.paginate(totleCount);
                isFirstSearch = false;
            }
        }, params);
    },
    info: function () {
        isSerach = false;
        offset = (pageNum - 1) * limit;
        sync_get_ajax(url_policy_list, function (data) {
            policy.appendTable(data.data.list);
            var totleCount = data.data.totleCount;
            if (isFirstList) {
                policy.paginate(totleCount);
                isFirstList = false;
            }
        }, {
            offset: offset,
            limit: limit
        });
    },
    get: function (id) {
        if(id==null || typeof(id)!="string"){
            alert("id not string or id is null")
            return;
        }
        sync_get_ajax(url_policy_get.replace(/{{{id}}}/,id), function (data) {
            policy.setHtml(data.data);
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
        sync_delete_ajax(url_policy_delete.replace(/{{{id}}}/,id), function (data) {
            alert('删除成功');
            $('#tableTbody').empty();
            policy.info();
        },{
        });
    },
    policy: function (id, status) {
        if (status == 1) {
            if (!window.confirm('你确定要通过吗？')) {
                return;
            }
        } else {
            if (!window.confirm('你确定要拒绝吗？')) {
                return;
            }
        }
        sync_get_ajax(url_policy_policy + '? id=' + id + '&status=' + status, function (data) {
            if (status == 1) {
                alert('通过完成');
            } else {
                alert('拒绝完成');
            }
            $('#tableTbody').empty();
            policy.review();
        });
    },
    // 将获取搭配信息放入到update
    setHtml: function (data) {

        $('#policy_id').val(data.Id);
        $('#policy_name').val(data.Name);
        $('#policy_divmodel').val(data.DivModel)
        $('#policy_divdata').val(data.DivData);
        $('#policy_status').val(data.Status)
        $('#policy_isdelete').val(data.IsDelete)
    },
    add: function () {
        var params = policy.getParam();
        if (params == false) {
            return;
        }
        sync_post_ajax(url_policy_add, function (data) {
            alert('添加完成');
        }, params);
    },
    update: function () {
        // 阻止默认的提交事件
        // event.preventDefault();
        var params = policy.getParam();
        if (params == false) {
            return;
        }
        sync_put_ajax(url_policy_update, function (data) {
            alert('修改成功!!!');
            policy.get(params.id);
        }, params);
    },
    // 显示列表
    appendTable: function (data) {
        if (data.length == 0) {
            alert('没有数据呢!!!');
            return;
        }
        var html = '';
        data.forEach(function (item) {
            html += '<tr>';

            html += '<td><input type="hidden" name="id" value="' + item.Id+ '"></td>';
            html += '<td>' + item.Id + '</td>';
            html += '<td>' + item.Name + '</td>';
            html += '<td>' + item.DivModel + '</td>';
            var infoHtml = item.DivData;
            if ($.trim(item.DivData).length > 0) {
                var divDataObj = JSON.parse(item.DivData);
                divDataObj.forEach(function(){
                    
                })
            }
            //html += '<td>' + '<button type="button" class="info-info" role="button" data-toggle="popover" data-trigger="focus" title="详细信息" data-content=\'' + infoHtml + '\'>查看</button>' + '</td>';
            html += '<td>' + item.DivData + '</td>';
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
                default:
                    status = '未知状态';
            }
            html += '<td>' + status + '</td>';
            // END_STATUS

            html += '<td>' + (item.IsDelete == 0 ? '有效' : '删除') + '</td>';
            var editUrl = url_policy_page_update + '?id=' + item.Id;
            html += '<td>'
                + '<a class="btn mini purple" href="' + editUrl + '"><i class="icon-edit"></i> Edit</a>' 
                + '<a class="btn mini black" href="javascript:policy.deletes(' + item.Id + ');"><i class="icon-trash"></i> Delete</a></td>';
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

        var id = $.trim($('#policy_id').val());
        var name = $.trim($('#policy_name').val());
        var divmodel = $.trim($('#policy_divmodel').val());
        var divdata = $.trim($('#policy_divdata').val());
        var is_delete = $.trim($('#policy_isdelete').val());
        var status = $.trim($('#policy_status').val());

        if (id.length > 0) {
            params.id = id;
        }
        if (name.length > 0) {
            params.name = name;
        }

        if (divmodel.length > 0) {
            params.divmodel = divmodel;
        }

        if (divdata.length > 0) {
            params.divdata = divdata;
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
                    policy.search();
                } else {
                    policy.info();
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

var policy = new so.global.platform.abtest.policy();

// 校验规则
var policy_rules = {
    policy_name: {
        required: true,
        minlength: 1,
        maxlength: 40
    },
    policy_divmodel: {
        required: true
    },
    policy_divdata: {
        required: true
    },
    policy_status: {
        required: true,
        digits: true,
        range: [0,2] 
    },
    policy_isdelete: {
        required: true,
        digits: true,
        range: [0,1]
    }
};
var policy_messages = {
    policy_name: {
        required: '该项必填',
        minlength: '最小长度为1',
        maxlength: '最大长度为40'
    },
    policy_divmodel: {
        required: '该项必填'
    },
    policy_divdata: {
        required: '该项必填'
    },
    policy_status: {
        required: '该项必填',
        digits: '只能是数字',
        range: '范围0~2'
    },
    policy_isdelete: {
        required: '该项必填',
        digits: '只能是数字',
        range: '范围0~1'
    }
};

