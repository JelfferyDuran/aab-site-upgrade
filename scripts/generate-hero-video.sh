#!/usr/bin/env bash
set -euo pipefail

INPUT="${1:-images/IMG_1415.jpg}"
OUT_DIR="${2:-media}"
mkdir -p "$OUT_DIR"

# 10-second, seamless, cinematic Ken Burns / parallax-style push.
# The cosine curve returns to its starting scale at the loop boundary,
# avoiding the visible "jump" common in hero background videos.
FILTER="scale=1800:-2:flags=lanczos,zoompan=z='1+0.038*(1-cos(2*PI*on/239))/2':x='iw/2-(iw/zoom/2)+5*sin(2*PI*on/239)':y='ih/2-(ih/zoom/2)+3*cos(2*PI*on/239)':d=240:s=960x540:fps=24,eq=saturation=1.035:contrast=1.015,format=yuv420p"

ffmpeg -y -loop 1 -i "$INPUT" -vf "$FILTER" -frames:v 240   -an -c:v libx264 -preset slow -crf 24 -movflags +faststart   "$OUT_DIR/aab-hero-parallax.mp4"

ffmpeg -y -loop 1 -i "$INPUT" -vf "$FILTER" -frames:v 240   -an -c:v libvpx-vp9 -deadline good -cpu-used 2 -crf 34 -b:v 0   "$OUT_DIR/aab-hero-parallax.webm"

echo "Generated hero assets:"
ls -lh "$OUT_DIR/aab-hero-parallax.mp4" "$OUT_DIR/aab-hero-parallax.webm"
