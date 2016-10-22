$(document).ready(function ()
{
    // highlight the code
    $('pre code').each(function (i, block)
    {
        hljs.highlightBlock(block);
    });

    $(".selector-code-collapse button").bs_button().click(function ()
    {
        var $pre = $(this).parent().find("pre");
        if ($pre.data("shown"))
        {
            $pre.data("shown", false);
            $pre.slideUp("fast")
        }
        else
        {
            $pre.data("shown", true);
            $pre.slideDown("fast")
        }
    });

    $("#container-01 button.selector-alert").bs_button().click(function ()
    {
        $.fn.alert("utils.js makes this so easy!");
    });
    $("#container-01 button.selector-dialogue").bs_button().click(function ()
    {
        var id = $.utils.createUUID();
        var $content = $("<div />")
                            .append($("<ol />")
                                .append($("<li />").text("An"))
                                .append($("<li />").text("Ordered"))
                                .append($("<li />").text("List"))
                            .append($("<p />").text("This is just a <p> tag to explain that the input below is using $.utils.labeledInput() to add content as the dialogue opens"))
                            .append($("<div />").addClass("text"))
                        );

        $.fn.dialogue({
            title: "Dialogue", 
            content: $content,
            buttons: [
                { text: "Close", click: function ($modal) { $modal.dismiss(); } },
                { text: "Highlight <p />", click: function ($modal) { $modal.find("p").css({ color: "#f00" }) } },
                { text: "Alert", click: function () { $.fn.alert("utils.js makes this so easy!"); } },
            ],
            open: function ($modal)
            {
                $modal.find(".text").labeledInput({ label: "Text input", placeholder: "Text field" });
            }
        });
    });

    $("#container-1 nav").bs_navbar(
    {
        label: "Section 1",
        groups: [
            {
                position: "right",
                elements: [
                    $("<li />").bs_dropdown(
                    {
                        title: "Menu 1",
                        callback: function (data)
                        {
                            $("#output-1").html(data + ": Dropdown");
                        },
                        elements: [
                            { text: "1st", data: "-1st- is just dull" },
                            { text: "2nd", data: "Gorganzola is the best" },
                            { text: "3rd", data: "Sausages are great" },
                            { prior: "seperator", text: "1st after divider", data: "1st-after-divider" }
                        ]
                    })
                ]
            }
        ]
    });

    $("#container-2 nav").bs_navbar(
    {
        callback: function (data)
        {
            $("#output-2").html(data + ": Global");
        },
        label: "Section 2",
        groups: [
            {
                callback: function (data)
                {
                    $("#output-2").html(data + ": Left");
                },
                position: "left",
                elements: [
                    { text: "Link 1", data: "Group1-Link1" },
                    { text: "Link 2", data: "Group1-Link2" },
                    $("<li />").bs_dropdown(
                    {
                        title: "Menu 2",
                        callback: function (data)
                        {
                            $("#output-2").html(data + ": Dropdown");
                        },
                        elements: [
                            { text: "1st", data: "-1st-" },
                            { text: "2nd", data: "Gorganzola" },
                            { text: "3rd", data: "Sausages" },
                            { prior: "seperator", text: "1st after divider", data: "1st-after-divider" }
                        ]
                    })
                ]
            },
            {
                position: "right",
                callback: function (data)
                {
                    $("#output-2").html(data + ": Right");
                },
                elements: [
                    { text: "Link 1", data: "Group2-Link1" },
                    { text: "Link 2", data: "Group2-Link2" }
                ]
            }

        ]
    });


    $("#container-3 button:first").bs_button().click(function ()
    {
        $("#switcher").bs_switcher("next");
    });
    $("#switcher").bs_switcher();

    $("#container-4 .text").labeledInput({ label: "Text input", placeholder: "Text field" });
    $("#container-4 .number").labeledInput({ label: "Number input", placeholder: "Number field", inputtype: "number" });
    $("#container-4 .password").labeledInput({ label: "Password input", placeholder: "Password field", inputtype: "password", labelposition: "right", labelcss: { textAlign: "left" } });

    $("#container-5 button").bs_button().click(function ()
    {
        $("#container-5 div").bs_progress("update", $(this).data("value"));
    });

    $("#container-5 div.percentage").bs_progress({ valuenow: 50 });
    $("#container-5 div.number").bs_progress({ valuenow: 75, valuemin: 25, valuemax: 80 });

    $("#container-6 .trail").bs_breadcrumb({
        trail: [ { text: "Home", link: "#" }, { text: "Library", link: "https://google.co.uk" }, { text: "Data" }]
    });

    $("#container-7 table").bs_table(
    { 
        titles: ["Firstname","Surname","Shoe size"], 
        data: [ 
            ["Joe","Blogs","8"],
            ["Kate","Doe","6"],
            ["Fred","Flintstone",null],
        ], 
        classes: ["hover", "table-striped"],
        rowclick: function (colData)
        {
            $("#container-7").find(".feedback").text("Clicked row: " + colData);
        }
    });

    $("#container-8 .selector-alert").bs_button().click(function ()
    {
        $.utils.bs_alert({
            title: "Title in bold!",
            msg: "Followed by the message",
            position: $(this).data("position"),
            type: $(this).data("type")
        });
    });
});