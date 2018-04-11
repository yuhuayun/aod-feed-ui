// 校验匹配规则
function upload(target) {
    var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
    var file = target.value;
    if (!/.csv$/.test(file)) {
        alert("请选择csv文件");
        return false;
    } else {
        var pos = file.lastIndexOf("\\");
        var fileName = file.substring(pos + 1);
        $("#fileName").html(fileName);
        $("#filePath").val(file);
    }
    var fileSize = 0;
    if (isIE && !target.files) { // IE浏览器
        // var filePath = target.value; // 获得上传文件的绝对路径
        console.log(filePath)
        var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
        var file = fileSystem.GetFile(filePath);
        fileSize = file.Size; // 文件大小，单位：b
    } else { // 非IE浏览器
        fileSize = target.files[0].size;
    }
    var size = fileSize / 1024 / 1024;
    if (size > 30) {
        $("#insert").attr("disabled")
        alert("附件不能大于50M,请从新上传文件");
        $("#fileName").html("支持扩展名：.csv");
        $("#filePath").val("");
        if($("#fileName").html("支持扩展名：.csv")){
            alert("请上传文件")
            return 
        }
    }else{
        $("#insert").attr("disabled",false)
    }

}
/// // 校验规则
function removeUpload(target) {
    var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
    var filePath = target.value;
        if (!/.(xls|xlsx)$/.test(filePath)) {
            alert("请选择excel文件");
            return false;
        } else {
            var pos = filePath.lastIndexOf("\\");
            var fileName = filePath.substring(pos + 1);
            $("#removeFileName").html(fileName);
            $("#removeFilePath").val(filePath);
        }
    var fileSize = 0;
    if (isIE && !target.files) { // IE浏览器
        // var filePath = target.value; // 获得上传文件的绝对路径
        console.log(filePath)
        var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
        var file = fileSystem.GetFile(filePath);
        fileSize = file.Size; // 文件大小，单位：b
    } else { // 非IE浏览器
        fileSize = target.files[0].size;
    }
    var size = fileSize / 1024 / 1024;
    if (size > 10) {
        $("#remove").attr("disabled")
        alert("附件不能大于10M,请从新上传文件");
        $("#removeFileName").html("支持扩展名：.xls，xlsx");
    }else{
        $("#remove").attr("disabled",false)
    }
}

$(function () {
    var current = 1;
    // 初始渲染
    function getData() {
        $.ajax({
            url: "http://172.42.3.229:8080/aod-feed/caseInfo/pageAll",
            data: {
                current: current
            },
            success: function (backdata) {
                console.log(backdata)
                $('#tbody').html(template('products', backdata));
                $("#pagintor").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: current,
                    totalPages: Math.ceil(backdata.total / backdata.size),
                    size: "small",
                    onPageClicked: function (event, originalEvent, type, page) {
                        current = page;
                        getData()
                    }
                });
            }
        })
    }
    getData();
    // 文件上传获取ID
    $("#uploadFile").on("click", function () {
        $.ajax({
            url: "http://172.42.3.229:8080/aod-feed/serviceConfig/all",
            success: function (backdata) {
                console.log(backdata);
                for (var i = 0; i < backdata.length; i++) {
                    var option = "<option value=" + backdata[i].serviceName + ">" + backdata[i].serviceId + "</option>";
                    $("#ulID").append(option);
                }
                $("#ulID").bind("change", function () {
                    var serviceId = $("#ulID option:selected").text();
                    console.log(serviceId)
                    var serviceName = $("#ulID option:selected").val();
                    console.log(serviceName)
                    $("#serviceId").val(serviceId);
                    $("#serviceName").val(serviceName);
                    $("#servN").val(serviceName);
                })
            }
        })
    })
    //使用表单校验插件
    $("#uploadForm").bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //3. 指定校验字段
        fields: {
            file: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请选择文件'
                    },
                }
            },
        }
    }).on('success.form.bv', function (e) {
        e.preventDefault();
        var s6=$("#fileName").html()
        if(s6=="支持扩展名：.csv"){
return alert("请上传文件")
        }
        if ($("#serviceId").val() == "") {
            return alert("请选择id")
        }
        var form = document.getElementById("uploadForm");
        var fd = new FormData(form);
        $.ajax({
            url: "http://172.42.3.229:8080/aod-feed/caseInfo/insert",
            type: 'post',
            // cache: false,
            dataType: "json",
            data: fd,
            processData: false,
            contentType: false,
            success: function (backdata) {
                console.log(backdata)
                if (backdata.errCode == "0") {
                    alert("上传成功")
                } else {
                    alert("上传失败")
                }
                window.location.reload()
            }
        })
    });
    $('#fileUpload').change(function () {
        // 获取验证插件对象
        var validator = $("#uploadForm").data('bootstrapValidator'); //获取表单校验实例
        validator.resetForm();
    })
    $("#ulID").bind("change", function () {
        var validator = $("#uploadForm").data('bootstrapValidator'); //获取表单校验实例
        validator.resetForm();
    })
    // 点击取消清空
    $("#abolish").on("click",function(){
        window.location.reload();
    })
    //  剔除 单选批量页面切换
    $('input[type=radio][name=remove]').change(function () {
        if (this.value == '1') {
            $("#batchs").hide()
            $("#singel").show()
            $("#removeFileName").html("支持扩展名：.xls，xlsx");
        } else if (this.value == '2') {
            $("#phone").val("")
            $("#singel").hide()
            $("#batchs").show()
        }
    });
    //  删除
    $("#remove").on("click", function (e) {
        event.preventDefault()
        var form = document.getElementById("rules");
        var fds = new FormData(form);
        var s1 = $("#phone").val()
        var a = $("input[name='remove']:checked").val();
        var s2 = $("#removeFileName").text()
        if (a == "1") {
            if (!(/^((0\d{2,3}-\d{7,8})|(1[358479]\d{9}))$/.test(s1))) {
                alert("请输入正确的电话号码");
                return false;
            }
        } else if (a == "2") {
            if (s2 == "支持扩展名：.xls，xlsx") {
                alert("请选择上传的文件")
                return false;
            }
        }
        $.ajax({
            url: "http://172.42.3.229:8080/aod-feed/panel/deletePanel",
            type: 'post',
            data: fds,
            processData: false,
            contentType: false,
            success: function (backdata) {
                console.log(backdata)
                window.location.reload()
            }
        })
    })
    // 成功页面
    $("#tbody").on("click", "a.success-id", function () {
        var id = $(this).parent().attr("data-id")
        window.location.href = "./success.html?id=" + id
    })
    //  失败页面
    $("#tbody").on("click", "a.err-id", function () {
        var id = $(this).parent().attr("data-id")
        window.location.href = "./err.html?id=" + id
    })
})
// // 校验匹配规则
// function upload(target) {
//     var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
//     var file = target.value;
//     if (!/.csv$/.test(file)) {
//         alert("请选择csv文件");
//         return false;
//     } else {
//         var pos = file.lastIndexOf("\\");
//         var fileName = file.substring(pos + 1);
//         $("#fileName").html(fileName);
//         $("#filePath").val(file);
//     }
//     var fileSize = 0;
//     if (isIE && !target.files) { // IE浏览器
//         // var filePath = target.value; // 获得上传文件的绝对路径
//         console.log(filePath)
//         var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
//         var file = fileSystem.GetFile(filePath);
//         fileSize = file.Size; // 文件大小，单位：b
//     } else { // 非IE浏览器
//         fileSize = target.files[0].size;
//     }
//     var size = fileSize / 1024 / 1024;
//     if (size > 50) {
//         $("#insert").attr("disabled",true)
//         alert("附件不能大于50M,请从新上传文件");
//     }else{
//         $("#insert").attr("disabled",false)
//     }

// }
// /// // 校验规则
// function removeUpload(target) {
//     var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
//     var filePath = target.value;
//         if (!/.(xls|xlsx)$/.test(filePath)) {
//             alert("请选择excel文件");
//             return false;
//         } else {
//             var pos = filePath.lastIndexOf("\\");
//             var fileName = filePath.substring(pos + 1);
//             $("#removeFileName").html(fileName);
//             $("#removeFilePath").val(filePath);
//         }
//     var fileSize = 0;
//     if (isIE && !target.files) { // IE浏览器
//         // var filePath = target.value; // 获得上传文件的绝对路径
//         console.log(filePath)
//         var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
//         var file = fileSystem.GetFile(filePath);
//         fileSize = file.Size; // 文件大小，单位：b
//     } else { // 非IE浏览器
//         fileSize = target.files[0].size;
//     }
//     var size = fileSize / 1024 / 1024;
//     if (size > 10) {
//         $("#remove").attr("disabled",true)
//         alert("附件不能大于10M,请从新上传文件");
//     }else{
//         $("#remove").attr("disabled",false)
//     }

// }