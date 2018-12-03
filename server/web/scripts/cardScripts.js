let in_drag = false;
// Ссылка на изменяемую карту (нужно для отката изменений)
let changed_card;
// Копия изменяемой карты до изменений
let backup;
let args;


// noinspection JSJQueryEfficiency
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

            $("#delete_area").toggleClass("active");

            $(".navigation_bar").fadeOut(200, function () {
                $(".delete_mode").fadeIn(200)
            });
            $(".head_image").fadeOut(100);
        },
        stop: function () {
            in_drag = false;
            $("#trash_card_image").css("display", "none");
            $("#new_card_image").css("display", "inline-block");

            $("#delete_area").toggleClass("active");

            $(".delete_mode").fadeOut(200, function () {
                $(".navigation_bar").fadeIn(200)
            });
            $(".head_image").fadeIn(100);
        }
    });
});

$("#delete_area, #trash_card_image").droppable({
    tolerance: "touch",
    drop: function (event, ui) {
        $(ui.draggable).addClass("choosed_for_delete");
        toggle_center_header();
        delete_dialog();
    }
});

function delete_dialog () {
    $(".modal_dialog_text").text("Are you sure?");
    $(".agree_button").on("click", function () {
        delete_cards_from_server();
        $(".disagree_button").click();
    });
    $(".disagree_button").on("click", function () {
        toggle_center_header();
        $(".modal_dialog").fadeOut(600);
        $(".disagree_button, .agree_button").off();
    });

    $(".modal_dialog").fadeIn(300);
}

let grid = $("body");
grid.on("mouseup", ".card_head, .back_header", function (event) {
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

    backup = $(this).parents(".card").clone();
    changed_card = $(this).parents(".card");

    input_tags.prop("disabled", false);
    input_tags.toggleClass("editable_input");

    event.stopPropagation();
});

$("#accept_changes").click(function () {
    let name = $(changed_card).find(".card_name").text();
    let image_path = $(changed_card).find(".hero_image").attr("src");
    let universe = $(changed_card).find(".universe_input").val();
    let power = $(changed_card).find(".power_input").val();
    let desc = $(changed_card).find(".desc_input").val();
    let is_alive = $(changed_card).find(".is_alive_input").val();
    let phone = $(changed_card).find(".phone_input").val();

    let error_msg = "";
    if (!check_phone(phone)) {
        error_msg += "Wrong phone number. ";
    }
    if (!check_power(power)) {
        error_msg += "Wrong power value (0 <= power <= 100). ";
    }
    if (!check_universe(universe)) {
        error_msg += "Wrong universe name. ";
    }
    if (error_msg !== "") {
        change_dialog_edit_error(error_msg);
        return;
    }

    $("input, textarea").removeClass("editable_input");
    $("input:not(#search), textarea").prop("disabled", true);

    $(".change_mode").fadeOut(400, function () {
        $(".navigation_bar").fadeIn(400)
    });
    $(".head_change_pencil").show();
    $("#new_hero_card").fadeIn(400);

    $("#grid").sortable("enable");

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

    logger(INFO, "Change the card: " + name);
    $.ajax({
        method: 'POST',
        url: 'doAction',
        data: req,
        success: function () {
            logger(INFO, "Change finish success!");
        },
        error: function (response) {
            logger(ERROR, response.responseText);
            let error_msg = "Row was updated or deleted by another transaction";
            if (response.responseText.includes(error_msg)) {
                changed_card.parents(".grid_item_card").remove();
                change_dialog(error_msg);
            } else {
                change_dialog_generify(response.responseText)
            }
        }
    });
});

function change_dialog_edit_error(msg) {
    $(".modal_dialog_text").text(msg);
    $(".agree_button_text").text("OK");
    $(".disagree_button").hide();
    $(".agree_button").on("click", function () {

        toggle_center_header();
        $(".modal_dialog").fadeOut(300);
        setTimeout(function () {
            $(".agree_button_text").text("Yep!");
            $(".disagree_button").show();
        }, 300);
        $(".agree_button").off();
    });

    toggle_center_header();
    $(".modal_dialog").fadeIn(300);
}

function change_dialog_generify(msg) {
    $(".modal_dialog_text").text("Server response with error: " + msg);
    $(".agree_button_text").text("OK");
    $(".disagree_button").hide();
    $(".agree_button").on("click", function () {
        changed_card.replaceWith(backup);

        toggle_center_header();
        $(".modal_dialog").fadeOut(300);
        setTimeout(function () {
            $(".agree_button_text").text("Yep!");
            $(".disagree_button").show();
        }, 300);
    });
    toggle_center_header();
    $(".modal_dialog").fadeIn(300);
}


function change_dialog() {
    $(".modal_dialog_text").text("Row was updated or deleted by another transaction. Would you add this card?");

    $(".agree_button").on("click", function() {
        $("#add_param_heroname").val(args['heroname']);
        $("#add_param_universe").val(args['universe']);
        $("#add_param_power").val(args['power']);
        $("#add_param_phone").val(args['phone']);
        $("#add_param_desc").val(args['desc']);
        $("#add_param_checkbox").attr('checked', args['alive'] === 'Y' ? "selected": "");
        $(".navigation_bar").fadeOut(400, function () {
            $(".add_mode").fadeIn(400)
        });

        let page_center = $(".page_center");
        page_center.fadeOut(400, function () {
            $(".page_center_addhero").fadeIn(400, function () {
                $("input:not(#search), textarea").prop("disabled", false);
            });
        });

        $(".disagree_button").click();
    });
    $(".disagree_button").on("click", function() {
        toggle_center_header();
        $(".modal_dialog").fadeOut(300);
        $(".disagree_button, .agree_button").off();
    });

    toggle_center_header();
    $(".modal_dialog").fadeIn(300);
}

$("#cancel_changes_btn").click(function () {
    changed_card.replaceWith(backup);
    backup = "";
    changed_card = "";
    $("input:not(#search), textarea").prop("disabled", true);
    $("input, textarea").removeClass("editable_input");
    $(".change_mode").fadeOut(400, function () {
        $(".navigation_bar").fadeIn(400)
    });
    $(".head_change_pencil").show();
    $("#new_hero_card").fadeIn(400);

    $("#grid").sortable("enable");

});

$("#add_card_btn").click(function () {
    let message_box = $("#message");
    let heroname = $("#add_param_heroname").val();
    let file = $("#fileloader").prop('files')[0];
    let universe = $("#add_param_universe").val();
    let power = Number($("#add_param_power").val());
    let desc = $("#add_param_desc").val();
    let isAlive = $("#add_param_checkbox").val();
    let phone = $("#add_param_phone").val();

    message_box.text("");

    if (heroname === "") {
        message_box.append("Empty heroname<br><br>");
    }

    if (file != null) {
        if (!(file.size > 0 && file.size < 2048000)) {
            message_box.append("File is too big ( bigger than 2048 bites ), or too small!<br><br>");
        }
        if (file.type !== "image/png" && file.type !== "image/jpeg") {
            message_box.append("You're trying to upload not image file!<br><br>");
        }
    }

    if (!(/^[a-zA-Z]+$/.test(universe))) {
        message_box.append("Incorrect universe name<br><br>");
    }
    if (power == null || !(power >= 0 && power <= 100)) {
        message_box.append("Incorrect power value<br><br>");
    }
    if (phone !== "" && !(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(phone))) {
        message_box.append("You're entered phone number with unknown format. (Example: 89272151817)<br><br>")
    }

    if (message_box.text() === "") {
        let hero = hero_constructor(heroname, "img/unknown_hero.png", universe, power, desc, isAlive, phone);

        if (file != null && file.name !== "") {
            load_card_on_server(hero);
        } else {
            load_card_on_server_default(hero);
        }
        setTimeout(function () {
            clear_inputs()
        }, 500);
    }
});

function load_card_on_server_default(hero) {
    let is_alive_checkbox;
    if (hero["alive"] === "on") {
        hero["alive"] = "Y";
        is_alive_checkbox = "checked";
    } else {
        hero["alive"] = "N";
        is_alive_checkbox = "";
    }

    let json = JSON.stringify({
        'action': 'add',
        'data': hero
    });

    logger(INFO, "Sending card on server with name " + hero["heroname"]);
    $.ajax({
        method: 'POST',
        url: 'doAction',
        data: json,
        contentType: 'application/json',
        success: function () {
            logger(INFO, "Loading finish success!");
            hero["alive"] = is_alive_checkbox;
            create_new_card(hero);
            $("#cancel_adding_btn").click();
        },
        error: function (response) {
            let msg = response.responseText;
            logger(ERROR, msg);
            $("#cancel_adding_btn").click();

            if (msg.includes("UNIQUE constraint failed")) {
                add_unique_failed_dialog();
            } else if (msg.includes("FOREIGN KEY constraint failed")) {
                add_foreign_failed_dialog();
                //TODO foreign error handler
                // Получить список доступных вселенных
            }
        }
    });
}

function add_unique_failed_dialog() {
    $(".modal_dialog_text").text("UNIQUE constraint failed. Page will be reloaded");
    $(".agree_button_text").text("OK");
    $(".disagree_button_text").hide();
    $(".agree_button").on("click", function () {
        toggle_center_header();
        $(".modal_dialog").fadeOut(300);
        location.reload();
        setTimeout(function () {
            $(".agree_button_text").text("Yep!");
            $(".disagree_button").show();
        }, 300);
        $(".agree_button").off();
    });

    toggle_center_header();
    $(".modal_dialog").fadeIn(300);
}

function add_foreign_failed_dialog() {
    $(".modal_dialog_text").text("Unknown universe");
    $(".agree_button_text").text("OK");
    $(".disagree_button").hide();
    $(".agree_button").on("click", function () {
        toggle_center_header();
        $(".modal_dialog").fadeOut(300);
        setTimeout(function () {
            $(".agree_button_text").text("Yep!");
            $(".disagree_button").show();
        }, 300);
        $(".agree_button").off();
    });

    toggle_center_header();
    $(".modal_dialog").fadeIn(300);
}

function load_card_on_server(hero) {
    let image_file = $("#fileloader").prop('files')[0];
    let form_data = new FormData();
    let image_name = hero["heroname"];
    form_data.append('file', image_file);
    form_data.append('name', image_name);

    logger(INFO, "Loading card on server");
    $.ajax({
        method: 'POST',
        url: 'doLoad',
        data: form_data,
        cache: false,
        processData: false,
        contentType: false,
        success: function () {
            logger(INFO, "Image was uploaded");
            hero["image_path"] = "img/" + image_name + ".jpg";
            load_card_on_server_default(hero);
        },
        error: function (response) {
            logger(ERROR, response.responseText);
            hero["image_path"] = "img/unknown_hero.png";
            image_loading_error_dialog();
            load_card_on_server_default(hero);
        }
    });
}

function image_loading_error_dialog() {
    $(".modal_dialog_text").text("Image wasn't uploaded on server. Will be setup standard image");
    $(".agree_button_text").text("OK");
    $(".disagree_button").hide();
    $(".agree_button").on("click", function () {

        toggle_center_header();
        $(".modal_dialog").fadeOut(300);
        setTimeout(function () {
            $(".agree_button_text").text("Yep!");
            $(".disagree_button").show();
        }, 300);
        $(".agree_button").off();
    });

    toggle_center_header();
    $(".modal_dialog").fadeIn(300);
}
