function onDelete() {
    $(".navigation_bar").fadeOut(400, function (){
        $(".delete_mode").fadeIn(400)
    });
}

$(".grid_item_card").click(function () {
    if ($(".navigation_bar").css('display') === 'none') {
        $(this).toggleClass("choosed_for_delete")
    }
});

$("#cancel_delete_btn").click(function () {
    $(".delete_mode").fadeOut(400, function (){
        $(".navigation_bar").fadeIn(400)
    });
    $(".grid_item_card").removeClass("choosed_for_delete")
});