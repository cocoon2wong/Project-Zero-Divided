/*
 * @Author: Conghao Wong
 * @Date: 2025-03-31 15:42:19
 * @LastEditors: Conghao Wong
 * @LastEditTime: 2025-03-31 19:52:39
 * @Github: https://cocoon2wong.github.io
 * Copyright 2025 Conghao Wong, All Rights Reserved.
 */

var dark_status = 0;
apply_dark_mode();


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); }
    }
    return "";
}


function get_dark_status() {
    let _status = getCookie('dark_status');
    if (_status.length) {
        dark_status = parseInt(_status);
    }
    return dark_status;
}


function apply_dark_mode(dark_status = null) {
    if (dark_status == null) {
        dark_status = get_dark_status();
    }

    update_nav_color(dark_status);

    if (dark_status == 1) {
        $('body').find('*').addClass('dark-mode');
    } else {
        $('body').find('*').removeClass('dark-mode');
    }

    setCookie('dark_status', String(dark_status));
}


function dark_mode_toggle() {
    dark_status = get_dark_status();
    dark_status = dark_status ? 0 : 1;
    apply_dark_mode(dark_status);
}
