$(function () {
    // 首页渲染 
    var current = 1;
    function getData() {
        $.ajax({
            url: "http://172.42.3.229:8080/aod-feed/serviceConfig/page",
            data: {
                current: current
            },
            success: function (backdata) {
                console.log(backdata)
                $('tbody').html(template('first', backdata));
                // 让启用禁止选中
                if($("#serve_d input[name=check1]")){
                    $("#serve_d input[name=check1]").attr("disabled",true)
                    $("#check1").attr("disabled",true)
                }
                $("#pagintor").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: current,
                    totalPages: Math.ceil(backdata.total / backdata.size),
                    size: "small",
                    onPageClicked: function (event, originalEvent, type, page) {
                        $("#serve_s").prop("checked", false);
                        current = page;
                        getData()
                    }
                });
            }
        })
    }
    getData();
    // 点击取消清空数据
    $(".btn-default").on("click",function(){
        window.location.reload()
    })
    //    复选框
    $("#serve_s").on("click", function () {       
        $("#serve_d input[name=check2]").prop("checked", $(this).prop("checked"));
      
    })
    // 批量删除
    $(".deleteBatches").click(function () {
        var checkedList = new Array();
        $("input[name='check2']:checked").each(function () {
            checkedList.push($(this).parent().siblings().eq(5).attr("data-id"));
        });
        if (checkedList == "") {
            return alert("请选择要删除的内容")
        }
        $.ajax({
            url: "http://172.42.3.229:8080/aod-feed/serviceConfig/deleteBatchIds",
            data: {
                idList: checkedList.toString(),
            },
            dataType: "json",
            type: "post",
            success: function (backdata) {
                $("[name ='check2']:checkbox").attr("checked", false);
                $('.modal').modal('hide')
                window.location.reload();
            }
        })
    })
    
    $("body").on("click", "#serve_d", function () {
        var allLength = $("#serve_d input").length;
        var selectLength = $("#serve_d input:checked").length;
        if (allLength == selectLength) {
            $("#serve_s").prop("checked", true);
        } else {
            $("#serve_s").prop("checked", false);
        }
    })
    // 单一删除
    $('#serve_d').on('click', '.delete-s', function () {
        var s1=$(this).attr("data-status")
        if(s1=="1"){
            $(this).attr("disabled",true)
        }else{
            $(this).attr("disabled",false)
        }
        var id = $(this).parent().attr("data-id");
        $("#delete-d").click(function () {
            $('.modal').modal('hide')
            $.ajax({
                url: "http://172.42.3.229:8080/aod-feed/serviceConfig/deleteById/" + id,
                type: "post",
                success: function (backdata) {
                    getData();
                    window.location.href = "./first.html";
                }
            })
        })
    })
    // 编辑
    $('#serve_d').on('click', '#compile', function () {
        var id = $(this).parent().siblings().eq(1).html();
        var idc = $(this).parent().attr("data-id");
        var severName = $(this).parent().siblings().eq(2).html();
        var remark = $(this).parent().siblings().eq(3).html();
        var remarks=$(this).parent().siblings().eq(3).attr("data-remark");
        $("#serveID").val(id);
        $("#serveName").val(severName);
        $("#exampleInputEmail1").val(remarks);
        var loginPostData = JSON.stringify($("#exampleInputEmail1").val())
        $("#submit-s").bootstrapValidator({
            excluded: [':disabled'],
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            //3. 指定校验字段
            fields: {
                remark: {
                    validators: {
                        notEmpty: {
                            message: '内容不能为空'
                        },
                        stringLength: {
                            min: 1,
                            max: 50,
                            message: '字节长度必须在1到50之间'
                        },
                    }
                },
            }
        }).on('success.form.bv', function (e) {
            e.preventDefault();
            var remark = $("#exampleInputEmail1").val();
            var formData = {
                "id": idc,
                "remark": remark
            };
            $.ajax({
                contentType: 'application/json;charset=UTF-8',
                url: "http://172.42.3.229:8080/aod-feed/serviceConfig/update",
                type: "post",
                dataType: "json",
                data: JSON.stringify(formData),
                success: function (backdata) {
                    $('.modal-add').modal('hide')
                    $("#exampleInputEmail1").val("");
                    getData();
                    window.location.href = "./first.html";

                }
            })
        })
    })
    //  初始化新增页面
    $.ajax({
        url: "http://172.42.3.229:8080/aod-feed/serviceConfig/serviceInfo",
        success: function (backdata) {
            console.log(backdata)
            var arr = [];
            arr = JSON.parse(backdata)
            for (var i = 0; i < arr.length; i++) {
                var id = arr[i].serviceId
                var serviceDesc = arr[i].serviceDesc
                var option = "<option value=" + serviceDesc + ">" + id + "</option>";
                $("#ulID").append(option);
            }
            $("#ulID").bind("change", function () {
                var serviceName = $("#ulID option:selected").val();
                var hiddens=$("#ulID option:selected").html();
                $("#serviceName").val(serviceName);
                $("#hiddens").val(hiddens)

            })
        }
    })
    // 新增提交
    $("#newly").bootstrapValidator({
        excluded: [':disabled'],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //3. 指定校验字段
        fields: {
            remark: {
                validators: {
                    notEmpty: {
                        message: '内容不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 50,
                        message: '字节长度必须在1到50之间'
                    },
                }
            },
        }

    }).on('success.form.bv', function (e) {
        e.preventDefault();
        var serviceId = $("#ulID option:selected").text();
        var serviceName = $("#serviceName").val();
        var remark = $("#tempRemark").val();
        var formData = {
            "serviceId": serviceId,
            "serviceName": serviceName,
            "remark": remark
        };
        if ($("#hiddens").val()== "") {
            return alert("请选择id")
        }
        $.ajax({
            contentType: 'application/json;charset=UTF-8',
            url: "http://172.42.3.229:8080/aod-feed/serviceConfig/insert",
            type: "post",
            dataType: "json",
            data: JSON.stringify(formData),
            success: function (backdata) {
                console.log(backdata)
                $('.modal-newly').modal('hide');
                $("#tempRemark").val("");
                window.location.href = "./first.html";
                getData();
            }
        })
    })

    // 增加弹出框代码
    function tableBubble() {
        var flag = true;
        $('tbody').on('mouseover', 'td.introduct', function (e) {
            if (flag) {
                flag = false;
                var cons = $(this).text();
                $(this).append($("<p class='emersion'>" + cons + "</p>"));
                $('p.emersion').css({
                    "position": "absolute",
                    "top": "44px",
                    "left": "25%",
                    "max-width": "300px",
                    // "max-height": "350px",
                    "border-radius": "4px",
                    "padding-left": "5px",
                    "background": "linear-gradient(to top,rgb(228, 229, 240),rgb(233, 233, 242),rgb(245, 245, 250),rgb(254, 254, 255))",
                    "border": "1px solid rgb(124, 124, 124)",
                    "box-shadow": "0 0 1px 4px rgb(231, 232, 242)",
                    "z-index": "999",
                    "word-break": "normal",
                    "white-space": "normal"
                });
            }
        })
        $('tbody').on('mouseleave', 'td', function () {
            flag = true;
            $(this).children('p.emersion').remove();
        });
    }
    tableBubble();
})