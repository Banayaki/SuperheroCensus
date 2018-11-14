var isDeleteMode = false;

function onLoad() {
    $("input:not(#search)").prop("disabled", true);
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
    let res = type + base;
    document.getElementById("export_loader").href = res;
    document.getElementById("export_loader").click();
    // $("#export_loader").click();
    // $("#export_loader").attr("href") = ;
});

$("#name_sort").click(function () {
    let names = [];
    let cards = [];
    $.each($(".card_name"), function () {
        cards.push($(this).clone());
        names.push($(this).text());
    });

    for (let index = names.length - 1; index > 0; --index) {
        for (let in_index = 0; in_index < index; ++in_index) {
            if (names[in_index] > names[in_index + 1]) {
                let temp = names[in_index];
                names[in_index] = names[in_index + 1];
                names[in_index + 1] = temp;

                temp = cards[in_index];
                cards[in_index] = cards[in_index + 1];
                cards[in_index + 1] = temp;

                // $(cards[in_index]).closest(".grid_item_card").swap($(cards[in_index + 1]).closest(".grid_item_card"));
                // Что тут происходит? Почему он не может нормально переставлять элементы
            }
        }
    }

});

jQuery.fn.swap = function (b) {
    b = jQuery(b)[0];
    var a = this[0],
        a2 = a.cloneNode(true),
        b2 = b.cloneNode(true),
        stack = this;

    a.parentNode.replaceChild(b2, a);
    b.parentNode.replaceChild(a2, b);

    stack[0] = a2;
    return this.pushStack(stack);
};

$("#power_sort").click(function () {
    let power_val = [];
    let cards = [];
    $.each($(".power_input"), function () {
        cards.push($(this));
        power_val.push($(this).val());
    });

    for (let index = power_val.length - 1; index > 0; --index) {
        for (let in_index = 0; in_index < index; ++in_index) {
            if (power_val[in_index] < power_val[in_index + 1]) {
                let temp = power_val[in_index];
                power_val[in_index] = power_val[in_index + 1];
                power_val[in_index + 1] = temp;

                temp = cards[in_index];
                cards[in_index] = cards[in_index + 1];
                cards[in_index + 1] = temp;
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

$("div").on('click', ".head_change_pencil", function () {
    $(".navigation_bar").fadeOut(400, function () {
        $(".change_mode").fadeIn(400)
    });

    $("#new_hero_card").fadeOut(400);

    $(".head_change_pencil").hide();
    // Ужасный поиск нужных инпутов.
    let input_tags = $(this).parent("div").siblings(".hero_desc").children("label").children("input");
    input_tags.toggleClass("editable_input");
    input_tags.prop("disabled", false);
});

$("div").on('click', ".grid_item_card", function () {
    if (isDeleteMode) {
        $(this).toggleClass("choosed_for_delete")
    }
});

$("#cancel_adding_btn").click(function () {
    $("input").prop("disabled", true);
    $("input").removeClass("editable_input");
    $(".add_mode").fadeOut(400, function () {
        $(".navigation_bar").fadeIn(400)
    });
    $(".page_center_addhero").fadeOut(400, function () {
        $(".page_center").fadeIn(400);
    });
});

$("#cancel_changes_btn").click(function () {
    $("input").prop("disabled", true);
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
    $("input").prop("disabled", true);

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
    $(".choosed_for_delete").hide();
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

    if (message_box.text() === "" && heroname.length !== 0) {
        if (!check_name(heroname)) {
            message_box.append("Hero with this name is exist<br><br>");
        } else {
            // Скачать картинку на сервер!
            let filename = "img/unknown_hero.png";
            let isalive = "checked" ? isAlive : false;
            create_new_card(heroname, filename, universe, power, desc, isalive, phone);
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
        "            <article id=\"" + id + "\" class=\"card\">\n" +
        "                <div class=\"card_head\">\n" +
        "                    <span class=\"card_name\">" + name + "</span>\n" +
        "                    <a class=\"head_change_pencil\" onclick=\"\"><img class=\"head_image\" src=\"img/pencil.png\"></a>\n" +
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
            return;
        }
    });
    return isEq;
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
