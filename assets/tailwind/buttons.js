const plugin = require('tailwindcss/plugin');

const luminance = (r, g, b) => {
  var a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928
          ? v / 12.92
          : Math.pow( (v + 0.055) / 1.055, 2.4 );
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

const contrast = (rgb1, rgb2 = [255,255,255]) => {
    var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
    var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
    var brightest = Math.max(lum1, lum2);
    var darkest = Math.min(lum1, lum2);
    return (brightest + 0.05)
         / (darkest + 0.05);
}

const toRgb = (hexa) => {
  var aRgbHex = hexa.replace('#','').match(/.{1,2}/g);
  var aRgb = [
      parseInt(aRgbHex[0], 16),
      parseInt(aRgbHex[1], 16),
      parseInt(aRgbHex[2], 16)
  ];
  return aRgb;
}

const generateColors = (e, colors, prefix) =>
  Object.keys(colors).reduce((acc, key) => {
    if (typeof colors[key] === 'string') {
      const c = contrast(toRgb(colors[key]))
      const o = { ...acc }
      o[`${prefix}-${e(key)}`] = {
        'background-color': colors[key],
        'color' : c > 1.25 ? 'white' : 'black'
      }
      o[`${prefix}-${e(key)}.btn-outline`] = {
        'color' : colors[key],
        'border-color' : colors[key]
      }
      o[`${prefix}-${e(key)}.btn-ghost`] = {
        'color' : colors[key],
        'background-color': 'transparent'
      }

      o[`${prefix}-${e(key)}.btn-invert`] = {}

      const hoverkey = key+"-hover"
      const activekey = key+"-active"
      if(colors.hasOwnProperty(hoverkey)){
        o[`${prefix}-${e(key)}`][`@apply hover:btn-${hoverkey}`] = {}
        o[`${prefix}-${e(key)}.btn-ghost`][`@apply hover:text-${hoverkey}`] = {}
        o[`${prefix}-${e(key)}.btn-invert`][`@apply hover:text-${hoverkey}`] = {}
      }
      if(colors.hasOwnProperty(activekey)){
        o[`${prefix}-${e(key)}`][`@apply active:btn-${activekey} selected:btn-${activekey}`] = {}
        o[`${prefix}-${e(key)}.btn-ghost`][`@apply active:bg-${activekey} selected:bg-${activekey} active:text-white selected:text-white`] = {}
        o[`${prefix}-${e(key)}.btn-invert`][`@apply selected:text-${activekey}`] = {}
        o[`${prefix}-${e(key)}.btn-outline`][`@apply active:bg-${activekey} selected:bg-${activekey} active:text-white selected:text-white`] = {}
      }

      return o
    }

    const innerColors = generateColors(e, colors[key], `${prefix}-${e(key)}`);

    return {
      ...acc,
      ...innerColors,
    };
  }, {});

module.exports = plugin.withOptions(({ className = 'btn' } = {}) => {
  return ({ e, addUtilities, theme, variants }) => {
    const colors = theme('colors');
    const buttonColors = generateColors(e, colors, `.${className}`);
    ['primary','secondary'].forEach((type) => {
      buttonColors[`.btn-${type}`] = {};
      buttonColors[`.btn-${type}`][`@apply bg-${type} text-white hover:bg-${type}-hover active:bg-${type}-active selected:bg-${type}-active`] = {};

      buttonColors[`.btn-${type}.btn-outline`] = {};
      buttonColors[`.btn-${type}.btn-outline`][`@apply text-${type} border-${type} hover:border-${type}-hover hover:text-${type}-hover selected:bg-${type} active:bg-${type}-active selected:text-white active:text-white`] = {};

      buttonColors[`.btn-${type}.btn-ghost`] = {};
      buttonColors[`.btn-${type}.btn-ghost`][`@apply text-${type} hover:bg-transparent hover:text-${type}-hover selected:bg-${type}-active active:bg-${type}-active selected:text-white active:text-white`] = {};

      buttonColors[`.btn-${type}.btn-invert`] = {};
      buttonColors[`.btn-${type}.btn-invert`][`@apply hover:text-${type}-hover selected:text-${type}-active active:text-${type}-active`] = {};
    })
    addUtilities(buttonColors, variants('buttonColor'));
  };
});