let isDeleteMode = false;


function onLoad() {
    let json = JSON.stringify({'action': 'load'});
    $.ajax({
        type: 'POST',
        url: 'doAction',
        data: json,
        success: function (response) {
            console.log("Successful connection to server");

            $('title').text("Superhero Census - Observer");
            let json = JSON.parse(response);
            load_card_from_json(json, false);
            $("#preloader").fadeOut(1000);
            $(".header").fadeIn(1000);
            $(".page_center").fadeIn(1000);
        },
        error: function (response) {
            console.log("Server is down");

            $('title').text("Superhero Census - Observer");
            $("#preloader").fadeOut(1000);
            $("#shutdown").fadeIn(1000);
        }
    });
}

function load_card_from_json(json, isHardUpdate) {
    $(".grid_item_card").addClass("old");

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


            if (values.hasOwnProperty('universe') && values.hasOwnProperty('power')) {
                universe = values['universe'];
                power = values['power'];
            } else {
                $(".grid_item_card:not(.old)").remove();
                console.log("Incorrect json");
                return;
            }

            if (values.hasOwnProperty('image_path')) image_path = check_img(values['image_path']);
            if (values.hasOwnProperty('desc')) desc = values['desc'];
            if (values.hasOwnProperty('alive')) is_alive = values['alive'];
            if (values.hasOwnProperty('phone')) phone = values['phone'];

            image_path = check_img(image_path);
            create_new_card(heroname, image_path, universe, power, desc, is_alive, phone);
            $("input:not(#search), textarea").prop("disabled", true);
        }
    });

    if (isHardUpdate) {
        let req = JSON.stringify({
            'action': 'hardUpdate',
            'data': json
        });
        $.ajax({
            type: 'POST',
            url: 'doAction',
            data: req,
            success: function (response) {
                console.log("Hard update success finish");
                $(".old").remove();
            },
            error: function (response) {
                $(".grid_item_card:not(.old)").remove();
                console.log("server shutdown");
            }
        });
    }
}

// Событие клика на кнопку импорта. Открывает диалоговое окно клиенту, что бы тот отправил файл (json)
$("#import_btn").click(function () {
    $(".page_center").toggleClass("hide_animation");
    $(".header").toggleClass("hide_animation");
    $("#import_modal_dialog").fadeIn(300);
});

$("#dialog_import_accept").click(function () {
    $("#import_loader").prop("disabled", false);
    document.getElementById("import_loader").click();
    $("#dialog_import_cancel").click();
});

$("#dialog_import_cancel").click(function () {
    $(".page_center").toggleClass("hide_animation");
    $(".header").toggleClass("hide_animation");
    $("#import_modal_dialog").fadeOut(300);
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
            load_card_from_json(json, true);
        };
    }
});

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
            "alive": is_alive === "on" ? "checked" : false,
            "phone": phone
        };
    });
    let json = JSON.stringify(data);
    let type = 'data:application/octet-stream;base64, ';
    let base = btoa(json);
    document.getElementById("export_loader").href = type + base;
    document.getElementById("export_loader").click();
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

function onAddHero() {
    $(".navigation_bar").fadeOut(400, function () {
        $(".add_mode").fadeIn(400)
    });
    $(".page_center").fadeOut(400, function () {
        $(".page_center_addhero").fadeIn(400, function () {
            $("input:not(#search), textarea").prop("disabled", false);
        });
    });
}

// noinspection JSJQueryEfficiency


$("#cancel_adding_btn").click(function () {
    $("input:not(#search), textarea").prop("disabled", true);
    $("input").removeClass("editable_input");
    $(".add_mode").fadeOut(400, function () {
        $(".navigation_bar").fadeIn(400)
    });
    $(".page_center_addhero").fadeOut(400, function () {
        $(".page_center").fadeIn(400);
    });
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

function delete_cards_from_server() {
    let name = $(".choosed_for_delete").find(".card_name").text();
    console.log("Delete - " + name);

    let json = JSON.stringify({
        'action': 'delete',
        'data': name
    });

    $.ajax({
        method: 'POST',
        url: 'doAction',
        data: json,
        contentType: 'application/json',
        success: function () {
            console.log("Delete finish success!");
            $(".choosed_for_delete").remove();
        },
        error: function () {
            console.log("delete failed :C");
        }
    });
}



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

            let is_alive_checkbox;
            let is_alive_param;
            isAlive === "on"  ? is_alive_checkbox = "checked" : false;
            isAlive === "on"  ? is_alive_param = "Y" : is_alive_param = "N";
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
        "<div class=\"grid_item_card overturned draggable\">\n" +
        "            <article id=\""+ name + "\" class=\"card flipper\">\n" +
        "                <div class=\"front\">\n" +
        "                    <div class=\"card_head\">\n" +
        "                        <span class='card_name'>"+ name + "</span>\n" +
        "                        <a class=\"head_change_pencil\" onclick=\"\">\n" +
        "                            <img class=\"head_image\" alt=\"ChangeCardIcon\" src=\"img/pencil.png\">\n" +
        "                        </a>\n" +
        "                    </div>\n" +
        "                    <div class=\"hero_image_href\">\n" +
        "                        <img class=\"hero_image\" alt=\""+ name +"\" src=\"" + file + "\" draggable=\"false\">\n" +
        "                    </div>\n" +
        "                    <div class=\"hero_desc\">\n" +
        "                        <label>\n" +
        "                            <strong>Universe</strong>\n" +
        "                            <input type=\"text\" class=\"universe_input\" value=\""+ universe +"\">\n" +
        "                        </label>\n" +
        "                        <label>\n" +
        "                            <strong>Power</strong>\n" +
        "                            <input type=\"number\" class=\"power_input\" value=\"" + power + "\">\n" +
        "                        </label>\n" +
        "                        <label>\n" +
        "                            <strong>Alive</strong>\n" +
        "                            <input type=\"checkbox\" class=\"is_alive_input\" " + isAlive + ">\n" +
        "                        </label>\n" +
        "                        <label>\n" +
        "                            <strong>Phone</strong>\n" +
        "                            <input type=\"text\" class=\"phone_input\" value=\"" + phone + "\">\n" +
        "                        </label>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "                <div class=\"back\">\n" +
        "                    <label>\n" +
        "                        <strong class='back_header'>Description</strong>\n" +
        "                        <textarea class=\"desc_input\" rows='24'>" + desc + "</textarea>\n" +
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
    if (url == null || url === "") {
        return 'img/unknown_hero.png';
    }
    url.replace("\\", "");
    let img = new Image();
    img.src = url;
    img.onerror = function () {
        return 'img/unknown_hero.png';
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

    let json = JSON.stringify({
        'action': 'add',
        'data': hero_data
    });
    $.ajax({
        method: 'POST',
        url: 'doAction',
        data: json,
        contentType: 'application/json',
        dataType: 'json',
        success: function (response) {
            console.log("Loading finish success!");
        },
        error: function (response) {
            console.log("Loading failed :C");
        }
    });
}

