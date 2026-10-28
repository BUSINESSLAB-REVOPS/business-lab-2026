"""Convert replacement local TTF fonts to WOFF2 without changing their glyphs."""

import argparse
from pathlib import Path
from fontTools.ttLib import TTFont

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path, help='Directory containing original TTF files')
parser.add_argument('--output', type=Path, default=Path('public/assets'))
args = parser.parse_args()
args.output.mkdir(parents=True, exist_ok=True)
for source in sorted(args.source.glob('*.ttf')):
    font = TTFont(source)
    font.flavor = 'woff2'
    output = args.output / f'{source.stem}.woff2'
    font.save(output)
    print(f'{source.name}: {source.stat().st_size} -> {output.stat().st_size} bytes')
