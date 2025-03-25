/*
 * @Author: Conghao Wong
 * @Date: 2025-03-25 19:41:54
 * @LastEditors: Conghao Wong
 * @LastEditTime: 2025-03-25 19:59:56
 * @Github: https://cocoon2wong.github.io
 * Copyright 2025 Conghao Wong, All Rights Reserved.
 */


function make_nav_small() {
    $(".navbar-nav").removeClass("navbar-nav-float-disable");
    $(".navbar-nav").addClass("navbar-nav-float-enable");
    $(".navbar-custom").removeClass("navbar-float-disable");
    $(".navbar-custom").addClass("navbar-float-enable");
}


function make_nav_big() {
    $(".navbar-nav").removeClass("navbar-nav-float-enable");
    $(".navbar-nav").addClass("navbar-nav-transition");
    $(".navbar-nav").addClass("navbar-nav-float-disable");
    $(".navbar-custom").removeClass("navbar-float-enable");
    $(".navbar-custom").addClass("navbar-float-disable");
}


$(function () {
    // Shorten the navbar after scrolling a little bit down
    var shorten = $('.top-nav-regular').length ? true : false;

    // The init state is the short navigation bar
    make_nav_small();

    $(window).scroll(function () {
        if (!shorten) {
            return;
        }

        if ($(".navbar").offset().top > 200) {
            make_nav_big();
        } else {
            make_nav_small();
        }
    });
});
