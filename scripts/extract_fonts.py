"""从 Windows 系统字体中提取本工程需要的三款字体到 public/fonts/。

用法：
    python scripts/extract_fonts.py

Windows 自带 Microsoft YaHei 与 Bahnschrift，本脚本把 .ttc 字体集合拆成
单个 .ttf，便于 Chrome 通过 @font-face 直接加载。字体文件不入库。
"""
import os
import sys

try:
    from fontTools.ttLib import TTFont
except ImportError:
    sys.exit("需要 fonttools：pip install fonttools")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "fonts")
FONT_DIR = os.environ.get("WINDIR", r"C:\Windows") + r"\Fonts"

JOBS = [
    ("msyhbd.ttc", "MSYH-Bold.ttf", 0),
    ("msyh.ttc", "MSYH.ttf", 0),
    ("bahnschrift.ttf", "Bahnschrift.ttf", None),
]


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    missing = []
    for src_name, dst_name, index in JOBS:
        src = os.path.join(FONT_DIR, src_name)
        if not os.path.exists(src):
            missing.append(src_name)
            continue
        dst = os.path.join(OUT_DIR, dst_name)
        font = TTFont(src) if index is None else TTFont(src, fontNumber=index)
        font.save(dst)
        print(f"ok  {src_name} -> {dst_name}")

    if missing:
        sys.exit(f"缺少系统字体：{', '.join(missing)}（本脚本面向 Windows）")
    print(f"完成，输出目录：{OUT_DIR}")


if __name__ == "__main__":
    main()
