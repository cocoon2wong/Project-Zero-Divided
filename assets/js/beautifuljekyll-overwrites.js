/*
 * @Author: Conghao Wong
 * @Date: 2025-04-09 11:06:19
 * @LastEditors: Conghao Wong
 * @LastEditTime: 2025-04-09 14:46:07
 * @Github: https://cocoon2wong.github.io
 * Copyright 2025 Conghao Wong, All Rights Reserved.
 */

function _copy_codes(button) {
    const codeBlock = button.closest('.highlight').querySelector('pre code');
    const text = codeBlock.innerText;

    navigator.clipboard.writeText(text).then(() => {
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    }).catch(err => {
        console.error('Copy Failed', err);
    });
}


$(function () {
    $('pre.highlight').before('<div class="codebox-title"></div>');
    $('.codebox-title').append('\
        <a class="btn btn-colorful" \
            onclick="_copy_codes(this)">\
            Copy\
        </a>');
});
