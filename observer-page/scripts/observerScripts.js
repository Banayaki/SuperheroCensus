var isDeleteMode = false;

function onLoad() {
    $( "input" ).prop( "disabled", true );
}

function onDelete() {
    $(".navigation_bar").fadeOut(400, function (){
        $(".delete_mode").fadeIn(400)
    });
    isDeleteMode = true;
    $(".head_image").hide();
}

$(".head_change_pencil").click(function () {
    $(".navigation_bar").fadeOut(400, function (){
        $(".change_mode").fadeIn(400)
    });
    $(this).hide();
    // Ужасный поиск нужных инпутов.
    let input_tags = $(this).parent("div").siblings(".hero_desc").children("label").children("input");
    input_tags.toggleClass("editable_input");
    if (input_tags.prop("disabled") === false) {
        input_tags.prop("disabled", true)
    } else {
        input_tags.prop("disabled", false);
    }
});

$(".grid_item_card").click(function () {
    if (isDeleteMode) {
        $(this).toggleClass("choosed_for_delete")
    }
});

$("#cancel_changes_btn").click(function () {
    $("input").prop("disabled", true);
    $("input").removeClass("editable_input");
    $(".change_mode").fadeOut(400, function (){
        $(".navigation_bar").fadeIn(400)
    });
    $(".head_change_pencil").show();
});

$("#cancel_delete_btn").click(function () {
    isDeleteMode = false;
    $(".grid_item_card").removeClass("choosed_for_delete");
    $(".delete_mode").fadeOut(400, function (){
        $(".navigation_bar").fadeIn(400)
    });
    $(".head_image").show();
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
