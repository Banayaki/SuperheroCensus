let in_drag = false;
// Ссылка на изменяемую карту (нужно для отката изменений)
let changed_card;
// Копия изменяемой карты до изменений
let backup;


$("#grid").on("mousemove", function () {
    $(this).sortable({
        revert:true,
        containment: $("body"),
        items: $(".draggable"),
        handle: $(".card_head, .back_header"),
        distance: 50,
        opacity: 0.9,
        start: function() {
            in_drag = true;
            $("#new_card_image").css("display", "none");
            $("#trash_card_image").css("display", "inline-block");

            $(".navigation_bar").fadeOut(200, function () {
                $(".delete_mode").fadeIn(200)
            });
            $(".head_image").fadeOut(100);
        },
        stop: function () {
            in_drag = false;
            $("#trash_card_image").css("display", "none");
            $("#new_card_image").css("display", "inline-block");

            $(".delete_mode").fadeOut(200, function () {
                $(".navigation_bar").fadeIn(200)
            });
            $(".head_image").fadeIn(100);
        }
    });
});


$("#trash_card_image").droppable({
    drop: function (event, ui) {
        $(ui.draggable).addClass("choosed_for_delete");
        $(".page_center").toggleClass("hide_animation");
        $(".header").toggleClass("hide_animation");
        $('.modal_dialog').show();
    }
});

$("#dialog_accept").click(function () {
    delete_cards_from_server();
    $("#dialog_cancel").click();
    $("#cancel_delete_btn").click();
});

$("#dialog_cancel").click(function () {
    $(".page_center").toggleClass("hide_animation");
    $(".header").toggleClass("hide_animation");
    $('.modal_dialog').fadeOut(600);
});

$("#grid").on("mouseup", ".card", function (event) {
    if ($(event.target).attr('class') !== "head_image" && !in_drag) {
        $(this).toggleClass("flip");
    }
});

$("div").on('click', ".head_change_pencil", function (event) {
    $("#grid").sortable("disable");

    $(".navigation_bar").fadeOut(400, function () {
        $(".change_mode").fadeIn(400)
    });

    $("#new_hero_card").fadeOut(400);

    $(".head_change_pencil").hide();
    let input_tags = $(this).parents(".card").find("input, textarea");

    backup = $(this).parents(".flipper").clone();
    changed_card = $(this).parents(".card");

    input_tags.prop("disabled", false);
    input_tags.toggleClass("editable_input");

    event.stopPropagation();
});


$("#cancel_changes_btn").click(function () {
    changed_card.replaceWith(backup);
    backup = "";
    changed_card = "";
    $("input:not(#search)").prop("disabled", true);
    $("input").removeClass("editable_input");
    $(".change_mode").fadeOut(400, function () {
        $(".navigation_bar").fadeIn(400)
    });
    $(".head_change_pencil").show();
    $("#new_hero_card").fadeIn(400);

    $("#grid").sortable("enable");

});

$("#accept_changes").click(function () {
    $("input").removeClass("editable_input");
    $("input:not(#search)").prop("disabled", true);

    $(".change_mode").fadeOut(400, function () {
        $(".navigation_bar").fadeIn(400)
    });
    $(".head_change_pencil").show();
    $("#new_hero_card").fadeIn(400);

    $("#grid").sortable("enable");


    let name = $(changed_card).find(".card_name").text();
    let image_path = $(changed_card).find(".hero_image").attr("src");
    let universe = $(changed_card).find(".universe_input").val();
    let power = $(changed_card).find(".power_input").val();
    let desc = $(changed_card).find(".desc_input").val();
    let is_alive = $(changed_card).find(".is_alive_input").val();
    let phone = $(changed_card).find(".phone_input").val();

    let data = {
        "heroname": name,
        "image_path": image_path,
        "universe": universe,
        "power": power,
        "desc": desc,
        "alive": is_alive === "on" ? "Y" : "N",
        "phone": phone
    };

    let json = JSON.stringify(data);
    $.ajax({
        method: 'POST',
        url: 'doAction',
        data: {
            'action': 'change',
            'data': json
        },
        contentType: 'application/json',
        success: function () {
            console.log("Change finish success!");
        },
        error: function () {
            console.log("Change failed :C");
            changed_card.replaceWith(backup);
        }
    });
});
