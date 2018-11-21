let isDeleteMode = false;
// Ссылка на изменяемую карту (нужно для отката изменений)
let changed_card;
// Копия изменяемой карты до изменений
let backup;

function onLoad() {
    $("input:not(#search)").prop("disabled", true);
    $.ajax({
        type: 'POST',
        url: 'load',
        success: function (response) {
            json = JSON.parse(response);
            load_card_from_json(json);
        },
        error: function (response) {
            alert("server shutdown");
        }
    });
}

// Событие клика на кнопку импорта. Открывает диалоговое окно клиенту, что бы тот отправил файл (json)
$("#import_btn").click(function () {
    $("#import_loader").prop("disabled", false);
    document.getElementById("import_loader").click();
});

// Обработка файла переданного пользователем
$("#import_loader").on('change', function () {
    let json;
    let fileReader = new FileReader();
    let file = $("#import_loader").prop('files')[0];
    if (file.type === "application/json") {
        fileReader.onload = function () {
            // noinspection JSCheckFunctionSignatures
            json = JSON.parse(fileReader.result);
            load_card_from_json(json);
        };
        fileReader.readAsText(file);
    }
});

function load_card_from_json(json) {
    $(".grid_item_card").remove();
    Object.keys(json).forEach(function (key) {
        let heroname = key;
        let values = json[key];
        if (check_name(heroname)) {
            let image_path = '';
            let universe = '';
            let power = '';
            let desc = '';
            let is_alive = '';
            let phone = '';
            for (key in values) {
                if (key === 'image_path') image_path = values[key];
                else if (key === 'universe') universe = values[key];
                else if (key === 'power') power = values[key];
                else if (key === 'desc') desc = values[key];
                else if (key === 'alive') is_alive = "checked" ? values[key] === 'Y' : false;
                else if (key === 'phone') phone = values[key];
                else {
                    return true;
                }
            }
            image_path = check_img(image_path);
            create_new_card(heroname, image_path, universe, power, desc, is_alive, phone);
            $("input:not(#search)").prop("disabled", true);
        }
    })
}

$("#export_btn").click(function () {
    let data = {};
    $.each($(".grid_item_card"), function () {
        let name = $(this).find(".card_name").text();
        let image_path = $(this).find(".hero_image").attr("src");
        let universe = $(this).find(".universe_input").val();
        let power = $(this).find(".power_input").val();
        let desc = $(this).find(".desc_input").val();
        let is_alive = $(this).find(".is_alive_input").val();
        let phone = $(this).find(".phone_input").val();
        data[name] = {
            "image_path": image_path,
            "universe": universe,
            "power": power,
            "desc": desc,
            "alive": is_alive,
            "phone": phone
        };
    });
    let json = JSON.stringify(data);
    let type = 'data:application/octet-stream;base64, ';
    let base = btoa(json);
    document.getElementById("export_loader").href = type + base;
    document.getElementById("export_loader").click();
    // $("#export_loader").click();
    // $("#export_loader").attr("href") = ;
});

$("#name_sort").click(function () {
    let names = [];
    let cards = [];
    $.each($(".grid_item_card"), function () {
        cards.push(this);
        names.push($(this).find(".card_name").text());
    });

    for (let index = names.length - 1; index > 0; --index) {
        for (let in_index = 0; in_index < index; ++in_index) {
            if (names[in_index] > names[in_index + 1]) {
                let temp = names[in_index];
                names[in_index] = names[in_index + 1];
                names[in_index + 1] = temp;


                let left_temp = cards[in_index];
                let right_temp = cards[in_index + 1];
                $(cards[in_index]).replaceWith(right_temp);
                $(cards[in_index + 1]).after(left_temp);

                cards[in_index] = cards[in_index + 1];
                cards[in_index + 1] = left_temp;
            }
        }
    }
});

$("#power_sort").click(function () {
    let power_val = [];
    let cards = [];
    $.each($(".grid_item_card"), function () {
        cards.push(this);
        power_val.push($(this).find(".power_input").val());
    });

    for (let index = power_val.length - 1; index > 0; --index) {
        for (let in_index = 0; in_index < index; ++in_index) {
            if (power_val[in_index] < power_val[in_index + 1]) {
                let temp = power_val[in_index];
                power_val[in_index] = power_val[in_index + 1];
                power_val[in_index + 1] = temp;


                let left_temp = cards[in_index];
                let right_temp = cards[in_index + 1];
                $(cards[in_index]).replaceWith(right_temp);
                $(cards[in_index + 1]).after(left_temp);

                cards[in_index] = cards[in_index + 1];
                cards[in_index + 1] = left_temp;
            }
        }
    }
});

$("#search").keyup(function () {
    let _this = this;
    $.each($(".card_name"), function () {
        if ($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1) {
            $(this).closest(".grid_item_card").hide();
        } else {
            $(this).closest(".grid_item_card").show();
        }
    })
});

function onDelete() {
    $(".navigation_bar").fadeOut(400, function () {
        $(".delete_mode").fadeIn(400)
    });
    isDeleteMode = true;
    $(".head_image").hide();
    $("#new_hero_card").fadeOut(400);
}

function onAddHero() {
    $(".navigation_bar").fadeOut(400, function () {
        $(".add_mode").fadeIn(400)
    });
    $(".page_center").fadeOut(400, function () {
        $(".page_center_addhero").fadeIn(400, function () {
            $("input").prop("disabled", false);
        });
    });
}

// noinspection JSJQueryEfficiency
$("div").on('click', ".head_change_pencil", function () {
    $(".navigation_bar").fadeOut(400, function () {
        $(".change_mode").fadeIn(400)
    });

    $("#new_hero_card").fadeOut(400);

    $(".head_change_pencil").hide();
    let input_tags = $(this).parent("div").siblings(".hero_desc").find("input");

    backup = $(this).parent("div").siblings(".hero_desc").clone();
    changed_card = $(this).parent("div").siblings(".hero_desc");

    input_tags.toggleClass("editable_input");
    input_tags.prop("disabled", false);
});

// noinspection JSJQueryEfficiency
$("div").on('click', ".grid_item_card", function () {
    // Избегаем двойного клика
    if (isDeleteMode) {
        $(this).toggleClass("choosed_for_delete");
    }
});

$("#cancel_adding_btn").click(function () {
    $("input:not(#search)").prop("disabled", true);
    $("input").removeClass("editable_input");
    $(".add_mode").fadeOut(400, function () {
        $(".navigation_bar").fadeIn(400)
    });
    $(".page_center_addhero").fadeOut(400, function () {
        $(".page_center").fadeIn(400);
    });
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
});

$("#cancel_delete_btn").click(function () {
    isDeleteMode = false;
    $(".grid_item_card").removeClass("choosed_for_delete");
    $(".delete_mode").fadeOut(400, function () {
        $(".navigation_bar").fadeIn(400)
    });
    $(".head_image").show();
    $("#new_hero_card").fadeIn(400);
});

$("#accept_changes").click(function () {
    $("input").removeClass("editable_input");
    $("input:not(#search)").prop("disabled", true);

    $(".change_mode").fadeOut(400, function () {
        $(".navigation_bar").fadeIn(400)
    });
    $(".head_change_pencil").show();
    $("#new_hero_card").fadeIn(400);
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

$("#dialog_accept").click(function () {
    $(".choosed_for_delete").remove();
    $("#dialog_cancel").click();
    $("#cancel_delete_btn").click();
});

$("#add_card_btn").click(function () {
    let message_box = $("#message");
    let heroname = $("#add_param_heroname").val();
    let file = $("#fileloader").prop('files')[0];
    let universe = $("#add_param_universe").val();
    let power = $("#add_param_power").val();
    let desc = $("#add_param_desc").val();
    let isAlive = $("#add_param_checkbox").val();
    let phone = $("#add_param_phone").val();

    message_box.text("");
    if (!(/^\w+$/.test(heroname))) {
        message_box.append("Please, enter the correct hero name!<br><br>");
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
    if (!(power >= 0 && power <= 100)) {
        message_box.append("Incorrect power value<br><br>");
    }
    if (phone !== "" && !(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(phone))) {
        message_box.append("You'ra entered phone number with unknown format. (Example: 89272151817)<br><br>")
    }

    if (message_box.text() === "") {
        if (!check_name(heroname)) {
            message_box.append("Hero with this name is exist<br><br>");
        } else {
            // Скачать картинку на сервер!
            let image_path;
            if (file != null && file.name !== "") {
                image_path = check_img(file.name);
            } else {
                image_path = 'img/unknown_hero.png'
            }


            let is_alive_checkbox = "checked" ? isAlive : false;
            let is_alive_param = "Y" ? isAlive : "N";
            create_new_card(heroname, image_path, universe, power, desc, is_alive_checkbox, phone);
            load_card_on_server(heroname, image_path, universe, power, desc, is_alive_param, phone);
            $("#cancel_adding_btn").click();
            setTimeout(function () {
                clear_inputs()
            }, 500);
        }
    }
});

function create_new_card(name, file, universe, power, desc, isAlive, phone) {
    $("#new_hero_card").before(
        "<div class=\"grid_item_card\">\n" +
        "            <article id=\"" + name + "\" class=\"card\">\n" +
        "                <div class=\"card_head\">\n" +
        "                    <span class=\"card_name\">" + name + "</span>\n" +
        "                    <a class=\"head_change_pencil\" onclick=\"\">\n" +
        "                        <img class=\"head_image\" alt=\"ChangeCardIcon\" src=\"img/pencil.png\">\n" +
        "                    </a>\n" +
        "                </div>\n" +
        "                <div class=\"hero_image_href\">\n" +
        "                    <img class=\"hero_image\" alt=\"" + name + "\" src=\"" + file + "\">\n" +
        "                </div>\n" +
        "                <div class=\"hero_desc\">\n" +
        "                    <label>\n" +
        "                        <strong>Universe</strong>\n" +
        "                        <input type=\"text\" class=\"universe_input\" value=\"" + universe + "\">\n" +
        "                    </label>\n" +
        "                    <label>\n" +
        "                        <strong>Power</strong>\n" +
        "                        <input type=\"number\" class=\"power_input\" value=\"" + power + "\">\n" +
        "                    </label>\n" +
        "                    <label>\n" +
        "                        <strong>Desc</strong>\n" +
        "                        <input type=\"text\" class=\"desc_input\" value=\"" + desc + "\">\n" +
        "                    </label>\n" +
        "                    <label>\n" +
        "                        <strong>Alive</strong>\n" +
        "                        <input type=\"checkbox\" class=\"is_alive_input\" " + isAlive + ">\n" +
        "                    </label>\n" +
        "                    <label>\n" +
        "                        <strong>Phone</strong>\n" +
        "                        <input type=\"text\" class=\"phone_input\" value=\"" + phone + "\">\n" +
        "                    </label>\n" +
        "                </div>\n" +
        "            </article>\n" +
        "        </div>"
    );
}

// Замыкание????
function check_name(name) {
    let isEq = true;
    $.each($(".card_name"), function () {
        if ($(this).text() === name) {
            isEq = false;

        }
    });
    return isEq;
}

function check_img(url) {
    url.replace("\\", "");
    let img = new Image();
    img.src = url;
    img.onerror = function () {
        url = 'img/unknown_hero.png';
    };
    return url;
}

function clear_inputs() {
    $("#message").prop('value', null);
    $("#add_param_heroname").prop('value', null);
    $("#fileloader").prop('value', null);
    $("#add_param_universe").prop('value', null);
    $("#add_param_power").prop('value', null);
    $("#add_param_desc").prop('value', null);
    $("#add_param_checkbox").prop('value', null);
    $("#add_param_phone").prop('value', null);
}

function load_card_on_server(heroname, image_path, universe, power, desc, isalive, phone) {
    let hero_data = {
        "heroname": heroname,
        "image_path": image_path,
        "universe": universe,
        "power": power,
        "desc": desc,
        "alive": isalive,
        "phone": phone
    };

    let json = JSON.stringify(hero_data);
    $.ajax({
        method: 'POST',
        url: 'newHero',
        data: json,
        contentType: 'application/json',
        dataType: 'json',
        success: function (response) {
            console.log("Loading finish success!")
        },
        error: function (response) {
            console.log("Loading failed :C")
        }
    });
}