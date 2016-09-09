$(document).ready(function ()
{

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


    $("#container-3 button").bs_button().click(function ()
    {
        $("#switcher").bs_switcher("next");
    });
    $("#switcher").bs_switcher();

    $("#container-4 .text").labeledInput({ label: "Text input", placeholder: "Text field" });
    $("#container-4 .number").labeledInput({ label: "Number input", placeholder: "Number field", inputtype: "number" });
    $("#container-4 .password").labeledInput({ label: "Password input", placeholder: "Password field", inputtype: "password", labelposition: "right", labelcss: { textAlign: "left" } });

});