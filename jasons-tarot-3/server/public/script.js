$(document).ready(function () {
    function setRandTarot() {
        var images = [
            "la_justice.png",
            "le_diable.png",
            "le_monde.png",
            "le_pendu.png",
            "rayne_de_baton.png",
            "reyne_depee.png",
            "la_lune.png",
            "le_empereur.png",
            "le_soleil.png",
            "valet_depee.png",
            "cavalier_de_baton.png",
            "le_bateleur.png",
            "le_mat.png",
            "le_pape.png",
            "limpiratrice.png",
            "reyne_debaton.png"
        ];
        var i;
        i = parseInt(Math.random() * images.length);
        $("#tarot").fadeOut(function () {
            $("#tarot").attr("src", "img/" + images[i]);
            $("#tarot").fadeIn();
        });
    }
    function setDeathTarot() {
        $("#tarot").fadeOut(function () {
            $("#tarot").attr("src", "img/le_mort.png");
            $("#tarot").fadeIn();
        });
    }
    $("#refresh-card").click(function () {
        $("#message").text("");
        $.get("checktoken")
            .done(function (data, status) {
                if (data["message"] == "0") {
                    setRandTarot();
                }
                else if (data["message"] == "1") {
                    setDeathTarot();
                }
                else {
                    $("#tarot").fadeOut();
                    $("#message").text(data["message"]);
                    $("#message").fadeIn();
                }
            })
            .fail(function (data) {
                setRandTarot();
            })
    });
});