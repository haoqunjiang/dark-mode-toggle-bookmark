javascript:(function(){
  const TOGGLE_CLASS = '__dark_mode_on__';
  const STYLE_ID = '__dark_mode_toggle_style__';
  const MEDIA_BRIGHTNESS = 0.86;
  const MEDIA_CONTRAST = 0.95;
  const MEDIA_SATURATION = 0.92;
  const doc = document;
  const head = doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement;
  let style = doc.getElementById(STYLE_ID);

  if (!style) {
    const mediaFilter = `invert(1) hue-rotate(180deg) brightness(${MEDIA_BRIGHTNESS}) contrast(${MEDIA_CONTRAST}) saturate(${MEDIA_SATURATION})`;
    style = doc.createElement('style');
    style.id = STYLE_ID;
    style.type = 'text/css';
    style.textContent = `
      html.${TOGGLE_CLASS} {
        -webkit-filter: invert(1) hue-rotate(180deg);
        filter: invert(1) hue-rotate(180deg);
      }

      html.${TOGGLE_CLASS} img,
      html.${TOGGLE_CLASS} picture,
      html.${TOGGLE_CLASS} video,
      html.${TOGGLE_CLASS} canvas,
      html.${TOGGLE_CLASS} svg,
      html.${TOGGLE_CLASS} iframe {
        -webkit-filter: ${mediaFilter};
        filter: ${mediaFilter};
      }
    `;
    head.appendChild(style);
  }

  doc.documentElement.classList.toggle(TOGGLE_CLASS);
})();
