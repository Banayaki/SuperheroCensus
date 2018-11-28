let in_drag = false;
// Ссылка на изменяемую карту (нужно для отката изменений)
let changed_card;
// Копия изменяемой карты до изменений
let backup;
let args;


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
        $('#delete_modal_dialog').show();
    }
});

$("#dialog_delete_accept").click(function () {
    delete_cards_from_server();
    $("#dialog_delete_cancel").click();
    $("#cancel_delete_btn").click();
});

$("#dialog_delete_cancel").click(function () {
    $(".page_center").toggleClass("hide_animation");
    $(".header").toggleClass("hide_animation");
    $('#delete_modal_dialog').fadeOut(600);
});

$("#grid").on("mouseup", ".card_head, .back_header", function (event) {
    if ($(event.target).attr('class') !== "head_image" && !in_drag) {
        $(this).parents(".card").toggleClass("flip");
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
    args = data;

    let req = JSON.stringify({
        'action': 'change',
        'data': data
    });
    $.ajax({
        method: 'POST',
        url: 'doAction',
        data: req,
        dataType: "json",
        success: function () {
            console.log("Change finish success!");
        },
        error: function (response) {
            console.log("Change failed :C");
            let error_msg = "Row was updated or deleted by another transaction";
            let json = JSON.parse(response.responseText);
            if (json['data'].includes(error_msg)) {
                $(".page_center").toggleClass("hide_animation");
                $(".header").toggleClass("hide_animation");
                $('#error_change_dialog').show();
            } else {
                console.log(json['data']);
                changed_card.replaceWith(backup);
            }
        }
    });
});

$("#dialog_change_accept").click(function () {
    changed_card.remove();
    $("#add_param_heroname").val(args['heroname']);
    $("#add_param_universe").val(args['universe']);
    $("#add_param_power").val(args['power']);
    $("#add_param_phone").val(args['phone']);
    $("#add_param_desc").val(args['desc']);
    $("#add_param_checkbox").attr('checked', args['alive'] === 'Y' ? "selected": "");
    $(".navigation_bar").fadeOut(400, function () {
        $(".add_mode").fadeIn(400)
    });
    $(".page_center").fadeOut(400, function () {
        $(".page_center_addhero").fadeIn(400, function () {
            $("input:not(#search), textarea").prop("disabled", false);
        });
    });

    $(".page_center").toggleClass("hide_animation");
    $(".header").toggleClass("hide_animation");
    $('#error_change_dialog').hide();
});

$("#dialog_change_cancel").click(function () {
    changed_card.remove();
    $(".page_center").toggleClass("hide_animation");
    $(".header").toggleClass("hide_animation");
    $('#error_change_dialog').hide();
});

