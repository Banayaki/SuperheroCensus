let isDeleteMode = false;
let isIncorrectLength = false;
let isIncorrectName = false;
let isMatch = false;

let ERROR = "ERROR";
let INFO = "INFO";

let was_in_compare;
let others = [];
let current;
let added = [];
let changed = [];

function onLoad() {
    let json = JSON.stringify({'action': 'load'});
    logger(INFO, "Start loading cards from server");
    $.ajax({
        type: 'POST',
        url: 'doAction',
        data: json,
        success: function (response) {
            logger(INFO, "Successful connection to server and loading cards");

            $('title').text("Superhero Census - Observer");
            let json = JSON.parse(response);
            card_loader(json);
            $("#preloader").fadeOut(1000);
            $(".header").fadeIn(1000);
            $(".page_center").fadeIn(1000);
        },
        error: function (response) {
            logger(ERROR, response.responseText);

            $('title').text("Superhero Census - Observer");
            $("#preloader").fadeOut(1000);
            $("#shutdown").fadeIn(1000);
        }
    });
}

function load_cards_from_json(json) {
    let cards = [];

    Object.keys(json).forEach(function (key) {
        let heroname = key;
        let values = json[key];
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
            logger(ERROR, "Incorrect json format");
            return;
        }

        if (values.hasOwnProperty('image_path')) image_path = check_img(values['image_path']);
        if (values.hasOwnProperty('desc')) desc = values['desc'];
        if (values.hasOwnProperty('alive')) is_alive = values['alive'];
        if (values.hasOwnProperty('phone')) phone = values['phone'];

        let hero = hero_constructor(heroname, image_path, universe, power, desc, is_alive, phone);

        hero["image_path"] = check_img(image_path);
        cards.push(hero);
    });
    return cards;
}

function card_loader(json) {
    let cards = load_cards_from_json(json);
    for (let index = 0; index < cards.length; index++) {
        if (check_name(cards[index]["heroname"])) create_new_card(cards[index]);
    }
    $("input:not(#search), textarea").prop("disabled", true);
}

function import_loading(json) {
    was_in_compare = false;
    let cards = load_cards_from_json(json);
    for (let index = 0; index < cards.length; index++) {
        if (check_name(cards[index]["heroname"])) {
            let checkbox = cards[index]["alive"];
            cards[index]["alive"] === "Y" ? cards[index]["alive"] = "checked" : cards[index]["alive"] = "";
            create_new_card(cards[index]);
            cards[index]["alive"] = checkbox;
            added.push(cards[index]);
        } 
        else others.push(cards[index]);
    }
    $(".complex_dialog_text").text("Choose your's or server cards, what you wanna use");
    $(".right_to_all_btn").on("click", function () {
        if (was_in_compare) {
            let id = current["heroname"].replace(" ", "_");
            $("#" + id).parents(".grid_item_card").remove();
            let checkbox;
            current["alive"] === "checked" ? checkbox = "Y" : checkbox = "N";
            create_new_card(current);
            current["alive"] = checkbox;
            changed.push(current);
        }
        for (let index = 0; index < others.length; index++) {
            let checkbox = others[index]["alive"];
            others[index]["alive"] === "Y" ? others[index]["alive"] = "checked" : others[index]["alive"] = "";
            let id = others[index]["heroname"].replace(" ", "_");
            $("#" + id).parents(".grid_item_card").remove();
            create_new_card(others[index]);
            others[index]["alive"] = checkbox;
            changed.push(others[index]);
        }
        $(".preloaded_card").remove();
        $(".complex_modal_dialog").hide();
        $("input:not(#search), textarea").prop("disabled", true);
        success_import_dialog();
    });

    $(".left_to_all_btn").on("click", function () {
        $(".preloaded_card").remove();
        $(".complex_modal_dialog").hide();
        $("input:not(#search), textarea").prop("disabled", true);
        success_import_dialog();
    });

    $(".right_btn").on("click", function () {
        $(".preloaded_card").remove();
        let id = current["heroname"].replace(" ", "_");
        $("#" + id).parents(".grid_item_card").remove();
        create_new_card(current);
        changed.push(current);
        compare_heroes();
    });

    $(".left_btn").on("click", function () {
        $(".preloaded_card").remove();
        compare_heroes();
    });
    toggle_center_header();
    $(".complex_modal_dialog").fadeIn(300);
    compare_heroes();
}

function compare_heroes() {
    while (others.length !== 0) {

        current = others.pop();
        let id = current["heroname"].replace(" ", "_");

        let name = $("#" + id).find(".card_name").text();
        let image_path = $("#" + id).find(".hero_image").attr("src");
        let universe = $("#" + id).find(".universe_input").val();
        let power = $("#" + id).find(".power_input").val();
        let desc = $("#" + id).find(".desc_input").val();
        let is_alive = $("#" + id).find(".is_alive_input").prop("checked");
        is_alive? is_alive = "Y" : is_alive = "N";
        let phone = $("#" + id).find(".phone_input").val();
        phone == null ? phone = "" : false;

        if (image_path !== current["image_path"] || universe !== current["universe"] || power !== current["power"]
            || desc !== current["desc"] || is_alive !== current["alive"] || phone !== current["phone"]) {
            was_in_compare = true;

            is_alive === "Y" ? is_alive = "checked" : is_alive = "";
            current["alive"] = is_alive;
            preload_card(hero_constructor(name, image_path, universe, power, desc, is_alive, phone));
            preload_card(current);
            $("input:not(#search), textarea").prop("disabled", true);
            return;
        }
    }
    $(".right_btn, .left_btn, .right_to_all_btn, .left_to_all_btn").off();
    $("input:not(#search), textarea").prop("disabled", true);
    $(".complex_modal_dialog").hide();
    success_import_dialog();
}

$("#import_btn").click(function () {
    import_dialog();
});

$("#import_loader").on('change', function () {
    let json;
    let fileReader = new FileReader();
    let file = $("#import_loader").prop('files')[0];
    if (file.type === "application/json") {
        fileReader.onload = function () {
            try {
                json = JSON.parse(fileReader.result);
            } catch (e) {
                error_on_import()
            }
            import_loading(json);
        };
        fileReader.onerror = function () {
            error_on_import();
        };
        fileReader.readAsText(file);
        $("#import_loader").prop("value", "");
    }
    event.stopPropagation();
});



$("#export_btn").click(function () {
    let data = {};
    $.each($(".grid_item_card"), function () {
        let name = $(this).find(".card_name").text();
        let image_path = $(this).find(".hero_image").attr("src");
        let universe = $(this).find(".universe_input").val();
        let power = $(this).find(".power_input").val();
        let desc = $(this).find(".desc_input").val();
        let is_alive = $(this).find(".is_alive_input").prop("checked");
        let phone = $(this).find(".phone_input").val();
        is_alive ? is_alive = "Y" : is_alive = "N";

        data[name] = {
            "heroname": name,
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
        power_val.push(Number($(this).find(".power_input").val()));
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
    delete_request(name);
}

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

function errorStringRemover(msgBox, errorMsg) {
    let temp = msgBox.text();
    let index = temp.indexOf(errorMsg);
    let left = temp.substring(0, index);
    let right = temp.substring(index + errorMsg.length);

    msgBox.text(left + right);
}

function preload_card(hero) {
    $(".complex_content").append(
        '<div class="grid_item_card overturned preloaded_card">\n' +
        '            <article class="card flipper">\n' +
        '                <div class="front">\n' +
        '                    <div class="card_head">\n' +
        '                        <span class="card_name">' + hero["heroname"]+ '</span>\n' +
        '                        <a class="head_change_pencil">\n' +
        '                            <img class="head_image" alt="ChangeCardIcon" src="img/pencil.png">\n' +
        '                        </a>\n' +
        '                    </div>\n' +
        '                    <div class="hero_image_href">\n' +
        '                        <img class="hero_image" alt="Hero Image" src="'+ hero["image_path"] + '">\n' +
        '                    </div>\n' +
        '                    <div class="hero_desc">\n' +
        '                        <label>\n' +
        '                            <strong>Universe</strong>\n' +
        '                            <input type="text" class="universe_input" value="' + hero["universe"] +'">\n' +
        '                        </label>\n' +
        '                        <label>\n' +
        '                            <strong>Power</strong>\n' +
        '                            <input type="text" class="power_input" value="' + hero["power"] +'">\n' +
        '                        </label>\n' +
        '                        <label>\n' +
        '                            <strong>Alive</strong>\n' +
        '                            <input type="checkbox" class="is_alive_input" ' + hero["alive"] +'>\n' +
        '                        </label>\n' +
        '                        <label>\n' +
        '                            <strong>Phone</strong>\n' +
        '                            <input type="text" class="phone_input" value="' + hero["phone"] +'">\n' +
        '                        </label>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '                <div class="back">\n' +
        '                    <label>\n' +
        '                        <strong class="back_header">Description</strong>\n' +
        '                        <textarea class="desc_input" rows="14">' + hero["desc"] +'</textarea>\n' +
        '                    </label>\n' +
        '                </div>\n' +
        '            </article>\n' +
        '        </div>'
    );
}

function create_new_card(hero) {
    let id = hero["heroname"].replace(' ', '_');
    $("#new_hero_card").before(
        "<div class=\"grid_item_card overturned draggable\">\n" +
        "            <article id=\"" + id + "\" class=\"card flipper\">\n" +
        "                <div class=\"front\">\n" +
        "                    <div class=\"card_head\">\n" +
        "                        <span class='card_name'>" + hero["heroname"] + "</span>\n" +
        "                        <a class=\"head_change_pencil\" onclick=\"\">\n" +
        "                            <img class=\"head_image\" alt=\"ChangeCardIcon\" src=\"img/pencil.png\">\n" +
        "                        </a>\n" +
        "                    </div>\n" +
        "                    <div class=\"hero_image_href\">\n" +
        "                        <img class=\"hero_image\" alt=\"" + hero["heroname"] + "\" src=\"" + hero["image_path"] + "\" draggable=\"false\">\n" +
        "                    </div>\n" +
        "                    <div class=\"hero_desc\">\n" +
        "                        <label>\n" +
        "                            <strong>Universe</strong>\n" +
        "                            <input type=\"text\" class=\"universe_input\" value=\"" + hero["universe"] + "\">\n" +
        "                        </label>\n" +
        "                        <label>\n" +
        "                            <strong>Power</strong>\n" +
        "                            <input type=\"number\" class=\"power_input\" value=\"" + hero["power"] + "\">\n" +
        "                        </label>\n" +
        "                        <label>\n" +
        "                            <strong>Alive</strong>\n" +
        "                            <input type=\"checkbox\" class=\"is_alive_input\" " + hero["alive"] + ">\n" +
        "                        </label>\n" +
        "                        <label>\n" +
        "                            <strong>Phone</strong>\n" +
        "                            <input type=\"text\" class=\"phone_input\" value=\"" + hero["phone"] + "\">\n" +
        "                        </label>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "                <div class=\"back\">\n" +
        "                    <label>\n" +
        "                        <strong class='back_header'>Description</strong>\n" +
        "                        <textarea class=\"desc_input\" rows='24'>" + hero["desc"] + "</textarea>\n" +
        "                    </label>\n" +
        "                </div>\n" +
        "            </article>\n" +
        "        </div>"
    );
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

function hero_constructor(heroname, image_path, universe, power, desc, is_alive, phone) {
    return {
        "heroname": heroname,
        "image_path": image_path,
        "universe": universe,
        "power": power,
        "desc": desc,
        "alive": is_alive,
        "phone": phone
    }
}

function check_name(name) {
    name = name.replace(' ', '_');
    let isEq = true;
    if ($("article").is("#" + name)) {
        isEq = false;
        return isEq;
    }
    return isEq;
}

function check_universe(universe) {
   return (/^\w+$/).test(universe);
}

function check_power(power) {
    return power >= 0 && power <= 100;
}

function check_phone(phone) {
    return phone === "" || (/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(phone));
}

function logger(type, text) {
    let current_date = new Date();
    console.log(current_date + " # " + type + ": " + text)
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

function toggle_center_header() {
    $(".page_center").toggleClass("hide_animation");
    $(".header").toggleClass("hide_animation");
}
