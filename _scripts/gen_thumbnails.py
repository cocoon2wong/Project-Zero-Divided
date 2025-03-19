"""
@Author: Conghao Wong
@Date: 2025-03-19 17:06:20
@LastEditors: Conghao Wong
@LastEditTime: 2025-03-19 17:40:52
@Github: https://cocoon2wong.github.io
@Copyright 2025 Conghao Wong, All Rights Reserved.
"""


import os

from PIL import Image

ROOT_DIR = './gallery'
TARGET_DIR = './gallery_thumbnails'
DOWN_SCALE = 10


def dir_check(path: str):
    if not os.path.exists(path):
        os.makedirs(path)
    return path


if __name__ == '__main__':
    for gallery in os.listdir(ROOT_DIR):
        if os.path.isdir(g := os.path.join(ROOT_DIR, gallery)):
            for pic in os.listdir(g):
                path = os.path.join(g, pic)
                with Image.open(path) as img:
                    x, y = img.size[:2]
                    img.thumbnail((x//DOWN_SCALE, y//DOWN_SCALE))
                    if path.endswith('jpeg'):
                        img = img.transpose(Image.TRANSPOSE)
                        img = img.transpose(Image.FLIP_LEFT_RIGHT)
                    img.save(os.path.join(
                        dir_check(os.path.join(TARGET_DIR, gallery)),
                        pic
                    ))
