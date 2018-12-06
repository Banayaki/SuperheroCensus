let universes = ["All", "Marvel", "DC"];

$(function () {
    $.widget("custom.combobox", {
        _create: function () {
            this.wrapper = $("<span>")
                .addClass("custom-combobox")
                .insertAfter(this.element);

            this.element.hide();
            this._createAutocomplete();
            this._createShowAllButton();
        },

        _createAutocomplete: function () {
            let selected = this.element.children(":selected"),
                value = selected.val() ? selected.text() : "";

            this.input = $("<input>")
                .appendTo(this.wrapper)
                .val(value)
                .attr("title", "")
                .addClass("filter custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left")
                .autocomplete({
                    delay: 0,
                    minLength: 0,
                    source: universes,
                    select: function (event, ui) {
                        // let val = ui.item.value;
                        // if (val === "All") {
                        //     $(".grid_item_card").show();
                        // } else {
                        //     $.each($(".universe_input"), function () {
                        //         let input_val = $(this).val();
                        //         if (input_val === val) {
                        //             $(this).closest(".grid_item_card").show();
                        //         } else {
                        //             $(this).closest(".grid_item_card").hide();
                        //         }
                        //     });
                        // }
                    }
                })
                .tooltip({
                    classes: {
                        "ui-tooltip": "ui-state-highlight"
                    }
                });

            this._on(this.input, {
                autocompleteselect: function (event, ui) {
                    this.input.val(ui.item.value);
                    // ui.item.option.selected = true;
                    // this._trigger( "select", event, {
                    //     item: ui.item.option
                    // });
                },

                autocompletechange: "_removeIfInvalid"
            });
        },

        _createShowAllButton: function () {
            let input = this.input,
                wasOpen = false;

            $("<a>")
                .attr("tabIndex", -1)
                .tooltip()
                .appendTo(this.wrapper)
                .button({
                    icons: {
                        primary: "ui-icon-triangle-1-s"
                    },
                    text: false
                })
                .removeClass("ui-corner-all")
                .addClass("custom-combobox-toggle ui-corner-right")
                .on("mousedown", function () {
                    wasOpen = input.autocomplete("widget").is(":visible");
                })
                .on("click", function () {
                    input.trigger("focus");

                    // Close if already visible
                    if (wasOpen) {
                        return;
                    }

                    // Pass empty string as value to search for, displaying all results
                    input.autocomplete("search", "");
                });
        },

        _removeIfInvalid: function (event, ui) {

            // Selected an item, nothing to do
            if (ui.item) {
                return;
            }

            // Search for a match (case-insensitive)
            let value = this.input.val(),
                valueLowerCase = value.toLowerCase(),
                valid = false;
            for (let index = 0; index < universes.length; ++index) {
                if (universes[index].toLowerCase() === valueLowerCase) {
                    this.selected = valid = true;
                    return false;
                }
            }

            // Found a match, nothing to do
            if (valid) {
                return;
            }

            // Remove invalid value
            this.input
                .val("");
            this.element.val("");
            this._delay(function () {
                this.input.tooltip("close").attr("title", "");
            }, 2500);
            this.input.autocomplete("instance").term = "";
        },

        _destroy: function () {
            this.wrapper.remove();
            this.element.show();
        }
    });

    $("#combobox").combobox();
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

$("#filter_button").on("click", function () {
    let min_val = $("#min_power_filter").val();
    let max_val = $("#max_power_filter").val();
    let universe = $(".custom-combobox-input").val();
    let alive = $("#alive_filter").prop("checked");
    let phone = $("#phone_filter").prop("checked");

    $(".grid_item_card").show();

    $.each($(".grid_item_card"), function () {
        let _this = $(this);
        let hero_power = $(this).find(".power_input").val();
        let hero_universe = $(this).find(".universe_input").val();
        let hero_alive = $(this).find(".is_alive_input").prop("checked");
        let hero_phone = $(this).find(".phone_input").val();

        if (Number(hero_power) < Number(min_val) || Number(hero_power) > Number(max_val)) _this.hide();
        if (universe !== "All" && hero_universe !== universe) _this.hide();
        if (alive !== hero_alive) _this.hide();
        if (!phone && hero_phone != "" || phone && hero_phone == "") _this.hide();
    });
});

$("#without_filter_button").on("click", function () {
    $(".grid_item_card").show();
});