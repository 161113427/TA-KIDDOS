const registerViewAdjust = () => {
    if ($(window)
        .width() < 1000) {
        $("body")
            .removeClass("overflow-hidden");
        $(".register-side")
            .hide();
        // $("div.box")
        //     .removeClass("col-sm-6")
        //     .addClass("col-sm-12");

    } else {
        $("body")
            .addClass("overflow-hidden");
        $(".register-side")
            .show();
        // $(".box")
        //     .addClass("col-sm-6")
        //     .removeClass("col-sm-12");

    }

    if ($(window)
        .height() < 700)
        $("form")
        .addClass("w-100")
        .removeClass("w-75");
    else
        $("form")
        .addClass("w-75")
        .removeClass("w-100");
    $(window)
        .resize(function () {
            if ($(window)
                .width() < 993) {
                $("body")
                    .removeClass("overflow-hidden");
                $(".register-side")
                    .hide();
            } else {
                $("body")
                    .addClass("overflow-hidden");
                $(".register-side")
                    .show();
            }
            if ($(window)
                .height() < 700)
                $("form")
                .addClass("w-100")
                .removeClass("w-75");
            else
                $("form")
                .addClass("w-75")
                .removeClass("w-100");
        })
}
const homeViewAdjust = () => {
    if ($(window)
        .scrollTop() < 150) {
        $("nav")
            .removeClass("bg-dark");
        // $("nav").css("transition", "0.2s all cubic-bezier(0.15, -0.3, 0.24, 1)")
    } else {
        $("nav")
            .addClass("bg-dark");
    }
    $(window)
        .scroll(function () {
            if ($(window)
                .width() > 1024) {
                if ($(window)
                    .scrollTop() < 150) {
                    $("nav")
                        .removeClass("bg-purple")
                        .css("transition", "0.25s");
                    // $("nav").css("transition", "0.2s all cubic-bezier(0.15, -0.3, 0.24, 1)")
                } else {
                    $("nav")
                        .addClass("bg-purple")
                        .css("transition", "0.25s");
                }
            }

            if ($(window)
                .scrollTop() > 300) {
                $(".feature")
                    .fadeIn("slow");
                $(".header")
                    .addClass("wipe-out")
                    .removeClass("wipe-in");
            } else {
                $(".feature")
                    .fadeOut();
                $(".header")
                    .addClass("wipe-in")
                    .removeClass("wipe-out");
            }
        });

    // ubah navbar untuk resolusi <1024
    $(window)
        .width(function () {
            if ($(window)
                .height() < 680) {
                $(".header")
                    .addClass("h-full");
                $(".btn-download")
                    .removeClass("font-weight-bolder");
            }
            if ($(window)
                .width() < 992) {
                $("nav")
                    .addClass("bg-light")
                    .removeClass("bg-dark")
                    .removeClass("navbar-dark")
                    .addClass("navbar-light")
                    .removeClass("px-5");
                $(".nav-item")
                    .removeClass("text-white")
                    .addClass("text-dark");
                $(".navbar-collapse")
                    .addClass("fade");

                $(".nav-link")
                    .hover(function () {
                        $(".nav-link")
                            .removeClass("neon-box");
                    });
                $("#download a")
                    .addClass("w-75")
                    .removeClass("w-25");
                $(".home-image")
                    .addClass('d-none');
                $(".feature .row")
                    .removeClass("row")
                    .addClass("flex-row");
            } else {
                $("nav")
                    .addClass("px-5")
                    .removeClass("navbar-light")
                    .addClass("navbar-dark")
                    .removeClass("bg-light");
                $(".navbar-collapse")
                    .removeClass("fade");
                $("#download a")
                    .removeClass("w-75")
                    .addClass("w-25");
                $(".nav-item")
                    .addClass("text-white")
                    .removeClass("text-dark");
                $(".home-image")
                    .removeClass('d-none');
                $(".feature .flex-row")
                    .addClass("row")
                    .removeClass("flex-row");
            }
            // fungsi ketika layar di resize
            $(window)
                .resize(function () {
                    // ubah navbar untuk resolusi <1024 ketika resize layar
                    if ($(window)
                        .width() < 992) {
                        $("nav")
                            .addClass("bg-light")
                            .removeClass("bg-dark")
                            .removeClass("navbar-dark")
                            .addClass("navbar-light")
                            .removeClass("px-5");
                        $(".nav-item")
                            .removeClass("text-white")
                            .addClass("text-dark");
                        $(".navbar-collapse")
                            .addClass("fade");
                        $("#download a")
                            .addClass("w-75")
                            .removeClass("w-25");
                        $(".nav-link")
                            .click(function () {
                                $(".nav-link")
                                    .removeClass("neon-box");
                            });
                        $(".home-image")
                            .addClass('d-none');
                        $(".feature .row")
                            .removeClass("row")
                            .addClass("flex-row");
                    } else {
                        $("nav")
                            .addClass("px-5")
                            .removeClass("navbar-light")
                            .addClass("navbar-dark")
                            .removeClass("bg-light");
                        $(".navbar-collapse")
                            .removeClass("fade");
                        $("#download a")
                            .removeClass("w-75")
                            .addClass("w-25");
                        $(".nav-item")
                            .addClass("text-white")
                            .removeClass("text-dark");
                        $(".nav-link:last-child")
                            .addClass("neon-box");
                        $(".home-image")
                            .removeClass('d-none');
                        $(".feature .flex-row")
                            .addClass("row")
                            .removeClass("flex-row");
                    }

                    if ($(window)
                        .height() < 680) {
                        $(".header")
                            .addClass("h-full");
                        $(".btn-download")
                            .removeClass("font-weight-bolder");
                    }

                });
        });
}
const parentViewAdjust = () => {
    $(window)
        .width(function () {
            if ($(window)
                .width() < 1024) {
                $(".top-box")
                    .removeClass("d-flex");
            } else {
                $(".top-box")
                    .addClass("d-flex");
            }
            if ($(window)
                .width() < 992) {
                $(".main-info")
                    .removeClass("d-flex");
            } else {
                $(".main-info")
                    .addClass("d-flex")
            }
        });
    $(window)
        .resize(() => {
            if ($(window)
                .width() < 1024) {
                $(".top-box")
                    .removeClass("d-flex");
            } else {
                $(".top-box")
                    .addClass("d-flex");
            }

            if ($(window)
                .width() < 992) {
                $(".main-info")
                    .removeClass("d-flex");
            } else {
                $(".main-info")
                    .addClass("d-flex");
            }
        });
    $(".carousel-item")
        .first()
        .addClass("active");
    $(".carousel-control-next")
        .click(() => {
            $(".menu-active")
                .removeClass("menu-active");
            $('detail-app')
                .remove();
            $('location-app')
                .remove();
            $('video-app')
                .remove();
            $('settings-app')
                .remove();
        });
    $(".carousel-control-prev")
        .click(() => {
            $(".menu-active")
                .removeClass("menu-active");
            $('detail-app')
                .remove();
            $('location-app')
                .remove();
            $('video-app')
                .remove();
            $('settings-app')
                .remove();
        })

    $(".carousel-control-prev")
        .css({ "bottom": "auto", "padding": "0.85rem", "opacity": "1" });
    $(".carousel-control-next")
        .css({ "bottom": "auto", "padding": "0.85rem", "opacity": "1" });
}

export { registerViewAdjust, homeViewAdjust, parentViewAdjust };