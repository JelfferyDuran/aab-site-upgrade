# Hero media

The home page serves a small, silent cinematic hero loop from this directory.

## Production assets
- `aab-hero-parallax.webm` — preferred modern-browser source.
- `aab-hero-parallax.mp4` — universal fallback.
- Both are 960×540, 24 fps, ~10 seconds, silent, and seamless at the loop boundary.
- `images/IMG_1415.jpg` remains the poster and hard fallback.

## Playback contract
- HTML flags: `autoplay muted loop playsinline preload="metadata"`.
- Respect `prefers-reduced-motion`: do not autoplay animation for those visitors.
- `styles.css` owns cover-cropping and mobile reframing.
- `script.js` owns graceful video failure fallback and the subtle scroll-depth drift.

## Regeneration
Run:

```bash
bash scripts/generate-hero-video.sh images/IMG_1415.jpg media
```

GitHub Actions also regenerates and publishes both files when the source image, renderer,
or hero-video workflow changes.

ImageKit can be added later as a CDN/transcoding layer, but it is not required for launch;
these optimized web renditions are intentionally small enough to ship with the static site.
