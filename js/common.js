$(function () {
    $(".lt_main a.glyphicon-align-justify").first().click(function () {
        $('.lt_aside').toggle();
        $('.lt_main').toggleClass("fullScreen");
        $('.footer').toggleClass("fullScreen");
    })
    // 弹出确认modal
    $(".lt_main a.glyphicon-log-out").click(function () {
        $('.modal-sure').modal('show');
    })
    // 关闭modal 调用登出接口
    $('.modal-sure button.btn-danger').click(function () {
        $('.modal-sure').modal('hide');
    })
    // 侧边栏 展开 收起
    $('.lt_aside ul >li:eq(1)>a').click(function () {
        console.log('你点我啦');
        $(this).siblings('ol').slideToggle();
    })

})