
function add_request(hero) {
    let array = [];
    hero["alive"] === "on" ? hero["alive"] = "Y" : hero["alive"] = "N";
    array.push(hero);
    add_list_request(array);
}

function add_list_request(added) {
    let json = JSON.stringify({
        'action': 'Add',
        'data': added
    });

    logger(INFO, "Sending cards on server");
    $.ajax({
        method: 'POST',
        url: 'doAction',
        data: json,
        contentType: 'application/json',
        success: function () {
            logger(INFO, "Loading finish success!");
            for (let hero in added) {
                create_new_card(added[hero]);
            }
            $("#cancel_adding_btn").click();
            generify_dialog("Cards was successfully added", false);
        },
        error: function (response) {
            let msg = response.responseText;
            logger(ERROR, msg);
            $("#cancel_adding_btn").click();

            if (msg.includes("UNIQUE constraint failed")) {
                add_unique_failed_dialog();
            } else if (msg.includes("unknown universe")) {
                add_foreign_failed_dialog(msg);
            } else {
                generify_dialog(msg, true)
            }
        }
    });
}

function change_request(changed) {
    change_list_request([changed]);
}

function change_list_request(changed) {
    let req = JSON.stringify({
        'action': 'Change',
        'data': changed
    });

    logger(INFO, "Change the card: " + name);
    $.ajax({
        method: 'POST',
        url: 'doAction',
        data: req,
        success: function () {
            logger(INFO, "Change finish success!");
            generify_dialog("Cards was successfully changed", false)
        },
        error: function (response) {
            logger(ERROR, response.responseText);
            let msg = response.responseText;
            let error_msg = "Row was updated or deleted by another transaction";
            if (msg.includes(error_msg)) {
                changed_card.parents(".grid_item_card").remove();
                change_dialog(error_msg);
            } else if (msg.includes("Unknown universe")) {
                add_foreign_failed_dialog(msg);
            } else {
                generify_dialog(msg, true)
            }
        }
    });
}

function delete_request(name) {
    let json = JSON.stringify({
        'action': 'Delete',
        'data': name
    });
    logger(INFO, "Starting delete card " + name);
    $.ajax({
        method: 'POST',
        url: 'doAction',
        data: json,
        contentType: 'application/json',
        success: function () {
            logger(INFO, "Delete finish success!");
            $(".choosed_for_delete").remove();
            generify_dialog("Cards was successfully deleted", false)
        },
        error: function (response) {
            logger(ERROR, response.responseText);
            $(".draggable").removeClass("choosed_for_delete");

            generify_dialog(response.responseText, true);
        }
    });
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

            generify_dialog(response.responseText, true);
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

function generify_dialog(msg, error) {
    let error_msg = "";
    if (error) {
        error_msg = "Page will be reloaded. Server response with error: ";
    }
    $(".modal_dialog_text").text(error_msg + msg);
    $(".disagree_button").hide();
    $(".agree_button").one("click", function () {
        toggle_center_header();
        $(".modal_dialog").fadeOut(300);
        setTimeout(function () {
            $(".disagree_button").show();
            if (error) location.reload();
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
                $("input:not(#search, .filter), textarea").prop("disabled", false);
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

function add_unique_failed_dialog() {
    $(".modal_dialog_text").text("UNIQUE constraint failed. Page will be reloaded");
    $(".agree_button_text").text("OK");
    $(".disagree_button").hide();
    $(".agree_button").one("click", function () {
        toggle_center_header();
        $(".modal_dialog").fadeOut(300);
        setTimeout(function () {
            $(".agree_button_text").text("Yep!");
            $(".disagree_button").show();
            location.reload();
        }, 300);
        $(".agree_button").off();
    });

    toggle_center_header();
    $(".modal_dialog").fadeIn(300);
}

function add_foreign_failed_dialog(msg) {
    $(".modal_dialog_text").text(msg);
    $(".agree_button_text").text("OK");
    $(".disagree_button").hide();
    $(".agree_button").on("click", function () {
        toggle_center_header();
        $(".modal_dialog").fadeOut(300);
        setTimeout(function () {
            location.reload();
            $(".agree_button_text").text("Yep!");
            $(".disagree_button").show();
        }, 300);
        $(".agree_button").off();
    });

    toggle_center_header();
    $(".modal_dialog").fadeIn(300);
}


function success_import_dialog() {
    add_list_request(added);
    change_list_request(changed);

    $(".modal_dialog_text").text("Card was successfully imported");
    $(".agree_button_text").text("It's good!");
    $(".disagree_button").hide();
    $(".agree_button").one("click", function () {
        others = [];
        toggle_center_header();
        $(".modal_dialog").fadeOut(300);
        setTimeout(function () {
            $(".agree_button_text").text("Yep!");
            $(".disagree_button").show();
        }, 300);
    });

    $(".modal_dialog").fadeIn(300);
}

function import_dialog() {
    $(".modal_dialog_text").text("You definitely want to import?");
    $(".agree_button").one("click", function () {
        $("#import_loader").prop("disabled", false);
        $("#import_loader").click();
        $(".disagree_button").click();
    });
    $(".disagree_button").one("click", function (){
        $("#import_loader").prop("disabled", true);
        toggle_center_header();
        $(".modal_dialog").fadeOut(300);
        $(".disagree_button, .agree_button").off();
    });

    toggle_center_header();
    $(".modal_dialog").fadeIn(300);
}

function error_on_import() {
    $(".modal_dialog_text").text("Incorrect JSON");
    $(".agree_button_text").text("It's a pity!");
    $(".disagree_button").hide();
    $(".agree_button").one("click", function () {
        toggle_center_header();
        $(".modal_dialog").fadeOut(300);
        setTimeout(function () {
            $(".agree_button_text").text("Yep!");
            $(".disagree_button").show();
        }, 300);
    });

    $(".modal_dialog").fadeIn(300);
}


function delete_dialog () {
    $(".modal_dialog_text").text("Are you sure?");
    $(".agree_button").on("click", function () {
        delete_cards_from_server();
        $(".disagree_button").click();
    });
    $(".disagree_button").on("click", function () {
        toggle_center_header();
        $(".modal_dialog").fadeOut(100);
        $(".disagree_button, .agree_button").off();
    });

    $(".modal_dialog").fadeIn(300);
}

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

function check_for_ajax(hero) {
    hero["image_path"] === null ? hero["image_path"] = "img/unknown_hero.png" : false;
    hero["alive"] = "checked" || hero["alive"] === "on" || hero["alive"] ? hero["alive"] === "Y" : false;
    hero["alive"] = "" || hero["alive"] === null || !hero["alive"] ? hero["alive"] === "N"  : false;
}