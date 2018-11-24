let in_drag = false;

// noinspection JSUnresolvedFunction
$("#grid").sortable({
    revert:true,
    containment: $("body"),
    items: $(".draggable"),
    distance: 50,
    opacity: 0.9,
    start: function() {
        in_drag = true;
        $("#new_card_image").css("display", "none");
        $("#trash_card_image").css("display", "inline-block");

        $(".navigation_bar").fadeOut(300, function () {
            $(".delete_mode").fadeIn(300)
        });
        $(".head_image").fadeOut(100);
    },
    stop: function () {
        in_drag = false;
        $("#trash_card_image").css("display", "none");
        $("#new_card_image").css("display", "inline-block");

        $(".delete_mode").fadeOut(300, function () {
            $(".navigation_bar").fadeIn(300)
        });
        $(".head_image").fadeIn(100);
    }
});

// noinspection JSUnresolvedFunction
$("#trash_card_image").droppable({
    drop: function (event, ui) {
        $(ui.draggable).addClass("choosed_for_delete");
        $(".page_center").toggleClass("hide_animation");
        $(".header").toggleClass("hide_animation");
        $('.modal_dialog').show();
    }
});

$("#dialog_accept").click(function () {
    if (delete_cards_from_server()) {
        $(".choosed_for_delete").remove();
    }
    $("#dialog_cancel").click();
    $("#cancel_delete_btn").click();

});

$("#dialog_cancel").click(function () {
    $(".page_center").toggleClass("hide_animation");
    $(".header").toggleClass("hide_animation");
    $('.modal_dialog').fadeOut(600);
});



$(".overturned").on("mouseup", ".card", function (event) {
    if ($(event.target).attr('class') !== "head_image" && !in_drag) {
        $(this).toggleClass("flip");
    }
});
