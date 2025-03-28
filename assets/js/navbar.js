/*
 * @Author: Conghao Wong
 * @Date: 2025-03-25 19:41:54
 * @LastEditors: Conghao Wong
 * @LastEditTime: 2025-03-28 15:24:03
 * @Github: https://cocoon2wong.github.io
 * Copyright 2025 Conghao Wong, All Rights Reserved.
 */


var MIN_SCROLL = 0;
var NAV_BAR_COLOR = $(':root').css('--navbar-col');
var NAV_FLOAT_COLOR = $(':root').css('--navbar-float-col');
var NAV_FLOAT_BORDER_COLOR = $(':root').css('--navbar-float-border-col');
var NAV_FLOAT_BORDER_ACTIVE_COLOR = $(':root').css('--hover-col') + 'FF';

var bias = 0;
var last_position = 0;
var manual_fix_flag = true;

let handle;


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


function set_nav_bar_css(rate, no_animation = false) {
    // `navbar-custom` is the normal navigation bar
    $('.top-nav-container').css({
        'background-color': '#FFFFFF00',
        'padding-top': String(linear(rate, 10, 0)) + 'px',
        'padding-bottom': String(linear(rate, max_scroll() - 20, 0)) + 'px',
    });

    $('.top-nav-background-container').css({
        'box-sizeing': 'border-box',
        'backdrop-filter': (
            'saturate(' + String(linear(rate ** 4, 100, 180)) + '%) ' +
            'blur(' + String(linear(rate ** 4, 0, 20)) + 'px)'
        ),
        'background-color': linear_color(
            rate ** 2,
            NAV_BAR_COLOR.substring(0, NAV_BAR_COLOR.length - 2) + '00',
            NAV_BAR_COLOR
        ),
        'border-bottom': '1px solid ' + linear_color(
            rate ** 2,
            NAV_FLOAT_BORDER_COLOR.substring(0, NAV_FLOAT_BORDER_COLOR.length - 2) + '00',
            NAV_FLOAT_BORDER_COLOR,
        ),
    });

    // `navbar-nav` is the small float navigation bar
    $('.top-nav-float-container').css({
        'background-color': linear_color(
            rate ** 2, NAV_FLOAT_COLOR,
            NAV_BAR_COLOR.substring(0, NAV_BAR_COLOR.length - 2) + '00'
        ),
        'border': '1px solid ' + linear_color(
            rate ** 2, NAV_FLOAT_BORDER_COLOR,
            NAV_FLOAT_BORDER_COLOR.substring(0, NAV_FLOAT_BORDER_COLOR.length - 2) + '00',
        ),
        'box-shadow': (
            '0 ' + String(linear(rate ** 0.5, 3, 0)) + 'px ' +
            String(linear(rate ** 0.5, 20, 0)) + 'px ' +
            'rgba(0, 0, 0, ' + String(linear(rate ** 0.5, 0.336, 0)) + ')'
        ),
        'padding-left': String(linear(rate, 4, 0)) + 'px',
        'padding-right': String(linear(rate, 20, 0)) + 'px',
        'backdrop-filter': (
            'saturate(' + String(linear(rate ** 4, 180, 100)) + '%) ' +
            'blur(' + String(linear(rate ** 2, 20, 0)) + 'px)'
        ),
    })

    $('.navbar-nav .nav-link').css({
        'padding-top': String(linear(rate, 10, 15) + 'px'),
        'padding-bottom': String(linear(rate, 10, 15) + 'px'),
    })

    $('.top-nav-active-background-container').addClass('nav-item-active');
    $('.nav-item-active').css({
        'border-radius': String(linear(rate ** 0.8, 17, 1)) + 'px',
        'height': String(linear(rate ** 0.5, 34, 20)) + 'px',
        'margin-top': String(linear(rate ** 0.5, -37, -20)) + 'px',
        'background-color': linear_color(rate ** 0.3, '#FFFFFFA0', '#FFFFFF00'),
        'border-bottom': (
            '1px solid ' +
            linear_color(
                rate ** 8,
                NAV_FLOAT_BORDER_ACTIVE_COLOR.substring(0, NAV_FLOAT_BORDER_ACTIVE_COLOR.length - 2) + '00',
                NAV_FLOAT_BORDER_ACTIVE_COLOR,
            )
        ),
    })

    // For other components
    if (!no_animation) {
        $('.page-heading > h1').css({ 'opacity': String(1 - rate) });

        $('.big-img').css({
            'opacity': linear(rate ** 3, 1.0, 0.0),
        })

        $('.main-page-container').css({
            'box-shadow': '-5px -5px 10px -4px ' + linear_color(
                rate, '#00000060', '#00000000'
            ),
        })
    }
    else {
        $('.top-nav-float-container').css({
            'border': '1px solid #00000000',
        });

        $('.big-img').css({
            'opacity': '1',
        })
    }
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
    $('.navbar-nav').find('li').each(function () {
        let a = $(this).find('a:first')[0];

        if (location.pathname.startsWith($(a).attr('href'))) {
            $(this).addClass('top-nav-active');
            $(this).append('<nav class="top-nav-active-background-container"></nav>');
        }
    })

    if ($(window).width() > 1199 && shorten) {
        set_nav_bar_css(get_nav_ani_rate());
    } else {
        set_nav_bar_css(1.0, no_animation = true);
    }

    $(window).scroll(function () {
        if (!shorten || $(window).width() <= 1199) {
            return;
        }

        // Update position
        bias = $('.navbar').offset().top;

        if (bias > MIN_SCROLL && bias <= max_scroll() && bias != last_position) {
            handle = requestAnimationFrame(head_animation);
            last_position = bias;
            manual_fix_flag = true;
        }

        else {
            cancelAnimationFrame(handle);

            if (manual_fix_flag) {
                var rate = bias > max_scroll() ? 1.0 : 0.0;
                set_nav_bar_css(rate);
                manual_fix_flag = false;
            }
        }
    });
});
