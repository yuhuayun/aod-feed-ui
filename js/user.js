$(function () {
  function getData() {
    $.ajax({
      url: "http://172.42.3.229:8080/aod-feed/monitor/queryMonitorData",
      success: function (backdata) {
        console.log(backdata)
        $('tbody').html(template('user', backdata));
      }
    })
  }
  getData()
  // 刷新按钮
  $("#newly-increased").on("click", function () {
    setInterval(function(){
      getData()
    },5000)
  })
 
  // 禁用，启用事件
  $('tbody').on('click', 'button', function (e) {
    var s1=$(this)
    var serviceId = $(this).parent().siblings().eq(0).html();
    console.log(serviceId)
    var status = undefined;
    if ($(this).html() == '已启用') {
      status = 2;
    } else {
      status = 1;
    }
    console.log(status)
    $.ajax({
      url: "http://172.42.3.229:8080/aod-feed/monitor/updateStatus/" + serviceId + "/" + status,
      type: 'post',
      success: function (backdata) {
        console.log(backdata)
        if (backdata.data=="2") {
          s1.html("已禁用")
        } else {
          s1.html("已启用")
        }
        // getData()
      }
    })
  })

})