function onDelete() {
    $(".navigation_bar").fadeOut(400, function (){
        $(".delete_mode").fadeIn(400)
    });
}

function onChange() {
    $(".navigation_bar").fadeOut(400, function (){
        $(".change_mode").fadeIn(400)
    });
    $("input").toggleClass("editable_input");
    $("input").prop("disabled", false);
}

$(".grid_item_card").click(function () {
    if ($(".delete_mode").css('display') !== 'none') {
        $(this).toggleClass("choosed_for_delete")
    }
});

$("#cancel_changes_btn").click(function () {
    $(".change_mode").fadeOut(400, function (){
        $(".navigation_bar").fadeIn(400)
    });
    $("input").removeClass("editable_input");
    $("input").prop("disabled", true);

});

$("#cancel_delete_btn").click(function () {
    $(".delete_mode").fadeOut(400, function (){
        $(".navigation_bar").fadeIn(400)
    });
    $(".grid_item_card").removeClass("choosed_for_delete")
});

$("#accept_changes").click(function () {
    $(".page_center").toggleClass("hide_animation");
    $(".header").toggleClass("hide_animation");
    $('.modal_dialog').show();
});

$("#dialog_cancel").click(function () {
    $(".page_center").toggleClass("hide_animation");
    $(".header").toggleClass("hide_animation");
    $('.modal_dialog').fadeOut(600);
});

$('#delete_selected').click(function () {
    $(".page_center").toggleClass("hide_animation");
    $(".header").toggleClass("hide_animation");
    $('.modal_dialog').show();
});

$("#dialog_delete_selected").click(
//    BACKEND
);
