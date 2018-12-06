let in_drag = false;

let isIncorrectLength = false;
let isIncorrectName = false;
let isMatch = false;
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
    $("input:not(#search, .filter), textarea").prop("disabled", true);

    $(".change_mode").fadeOut(400, function () {
        $(".navigation_bar").fadeIn(400)
    });
    $(".head_change_pencil").show();
    $("#new_hero_card").fadeIn(400);

    $("#grid").sortable("enable");

    let hero = hero_constructor(name, image_path, universe, power, desc, is_alive, phone);
    change_request(hero);
});

$("#add_param_heroname").keyup(function () {
    let message_box = $("#message");
    let heroname = $(this).val();
    if (!isIncorrectLength && heroname.length > 20) {
        message_box.append("Too big name<br><br>");
        isIncorrectLength = true;
    } else if (isIncorrectLength && heroname.length <= 20) {
        errorStringRemover(message_box, "Too big name");
        isIncorrectLength = false;
    }
    if (!isIncorrectName && !(/^[a-zA-Z_ ]+$/.test(heroname))) {
        message_box.append("Incorrect name<br><br>");
        isIncorrectName = true;
    } else if (isIncorrectName && (/^[a-zA-Z_ ]+$/.test(heroname))) {
        errorStringRemover(message_box, "Incorrect name");
        isIncorrectName = false;
    }

    if (!isMatch && !check_name(heroname)) {
        message_box.append("Hero with this name is exist<br><br>");
        isMatch = true;
    } else if (isMatch && check_name(heroname)) {
        errorStringRemover(message_box, "Hero with this name is exist");
        isMatch = false;
    }
});

$("#cancel_changes_btn").click(function () {
    changed_card.replaceWith(backup);
    backup = "";
    changed_card = "";
    $("input:not(#search, .filter), textarea").prop("disabled", true);
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

    if (heroname === "" || isIncorrectLength || isIncorrectName || isMatch) {
        message_box.append("Wrong heroname. Why you click on button, when message still be here<br><br>");
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
    add_request(hero)
}





