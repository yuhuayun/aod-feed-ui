$(function(){
    var searchKV = window.location.search.slice(1);
    var id = searchKV.split('=')[1];
    console.log(id)
    var current=1;
    function getData() {
    $.ajax({
        url:"http://172.42.3.229:8080/aod-feed/panel/pageAllScuess?id="+id,
        data: {
            current: current
        },
        success:function(backdata){
            $('tbody').html(template('scuess', backdata));
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
getData()
})