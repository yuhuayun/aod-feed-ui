$(function () {
    function getData() {
        $.ajax({
            url:"http://192.168.1.120:8080/monitor/queryMonitorData",
            success:function(backdata){
                // console.log(backdata)
                $('tbody').html(template('user', backdata));
                $("#pagintor").bootstrapPaginator({
                    bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage: 1, //当前页
                    totalPages: 10, //总页数
                    size: "small", //设置控件的大小，mini, small, normal,large
                    onPageClicked: function (event, originalEvent, type, page) {
                        //为按钮绑定点击事件 page:当前点击的按钮值
                    }
                });
            }
        })
    }

    getData()


})