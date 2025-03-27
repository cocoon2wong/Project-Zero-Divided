/*
 * @Author: Conghao Wong
 * @Date: 2025-03-25 19:41:54
 * @LastEditors: Conghao Wong
 * @LastEditTime: 2025-03-27 18:23:38
 * @Github: https://cocoon2wong.github.io
 * Copyright 2025 Conghao Wong, All Rights Reserved.
 */


var MIN_SCROLL = 0;
var NAV_BAR_COLOR = $(':root').css('--navbar-col');
var NAV_FLOAT_COLOR = $(':root').css('--navbar-float-col');

var bias = 0;
var last_position = 0;
var manual_fix_flag = true;


function max_scroll() {
    return $('.intro-header.big-img').height() - 50;
}


function linear(rate, start, end) {
    return rate * (end - start) + start;
}


function linear_color(rate, start, end) {
    var result = '#';

    // Remove the `#`
    start = start.replace('#', '');
    end = end.replace('#', '');

    for (let index = 0; index < Math.min(end.length / 2, 4); index++) {
        var _start = parseInt(start.slice(2 * index, 2 * index + 2), 16);
        var _end = parseInt(end.slice(2 * index, 2 * index + 2), 16);
        var _v = parseInt(rate * (_end - _start) + _start);
        result += _v.toString(16).padStart(2, '0');
    }

    return result;
}


function rgba_to_hex(rgba) {
    let _rgba = rgba.match(/(\d(\.\d+)?)+/g);

    return (
        '#' +
        parseInt(_rgba[0]).toString(16).padStart(2, '0') +
        parseInt(_rgba[1]).toString(16).padStart(2, '0') +
        parseInt(_rgba[2]).toString(16).padStart(2, '0') +
        (parseInt(255 * parseFloat(_rgba[3]))).toString(16).padStart(2, '0')
    );
}


function get_nav_ani_rate() {
    bias = $('.navbar').offset().top;
    var rate = (bias - MIN_SCROLL) / (max_scroll() - MIN_SCROLL);
    return rate > 1.0 ? 1.0 : rate;
}


function set_nav_bar_css(rate, ignore_fonts = false) {
    // For titles
    if (!ignore_fonts) {
        $('.page-heading > h1').css({ 'opacity': String(1 - rate) });
    }

    // `navbar-custom` is the normal navigation bar
    $('.top-navbar-container').css({
        'background-color': '#FFFFFF00',
        'padding-top': String(linear(rate, 20, 0)) + 'px',
        'padding-bottom': String(linear(rate, max_scroll() - 20, 0)) + 'px',
    });

    $('.top-navbar-background-container').css({
        'backdrop-filter': 'blur(' + String(linear(rate ** 4, 0, 10)) + 'px)',
        'background-color': linear_color(
            rate ** 2,
            NAV_BAR_COLOR.substring(0, NAV_BAR_COLOR.length - 2) + '00',
            NAV_BAR_COLOR
        ),
    });

    $('.big-img').css({
        'opacity': linear(rate ** 3, 1.0, 0.0),
    })

    $('.main-page-container-shadow').css({
        'box-shadow': '-5px -5px 10px -4px ' + linear_color(rate, '#00000060', '#00000000'),
    })

    // `navbar-nav` is the small float navigation bar
    $('.top-nav-container').css({
        'background-color': linear_color(
            rate ** 2, NAV_FLOAT_COLOR,
            NAV_BAR_COLOR.substring(0, NAV_BAR_COLOR.length - 2) + '00'
        ),
        'border-radius': String(linear(rate, 15, 0)) + 'px',
        'box-shadow': (
            '0 ' + String(linear(rate ** 0.5, 3, 0)) + 'px ' +
            String(linear(rate ** 0.5, 20, 0)) + 'px ' +
            'rgba(0, 0, 0, ' + String(linear(rate ** 0.5, 0.336, 0)) + ')'
        ),
        'padding-left': String(linear(rate, 10, 0)) + 'px',
        'padding-right': String(linear(rate, 20, 0)) + 'px',
        'border-radius': String(linear(rate, 15, 8)) + 'px',
        'backdrop-filter': 'blur(' + String(linear(rate ** 2, 10, 0)) + 'px)',
    })
}


function head_animation() {
    if (bias > MIN_SCROLL && bias <= max_scroll()) {
        let rate = get_nav_ani_rate();
        set_nav_bar_css(rate);
    }
}


$(function () {
    // Shorten the navbar after scrolling a little bit down
    var shorten = $('.top-nav-regular').length ? true : false;

    // Set init states
    if ($(window).width() <= 1199) {
        set_nav_bar_css(1.0, ignore_fonts = true);
    } else {
        set_nav_bar_css(get_nav_ani_rate());
    }

    $(window).scroll(function () {
        var timer;

        // Update position
        bias = $('.navbar').offset().top;

        if (!shorten || $(window).width() <= 1199) {
            return;
        }

        if (bias > MIN_SCROLL && bias <= max_scroll() && bias != last_position) {
            timer = requestAnimationFrame(head_animation);
            last_position = bias;
            manual_fix_flag = true;
        }

        else {
            cancelAnimationFrame(timer);

            if (manual_fix_flag) {
                var rate = bias > max_scroll() ? 1.0 : 0.0;
                set_nav_bar_css(rate);
                manual_fix_flag = false;
            }
        }
    });
});
