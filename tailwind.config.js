let plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')

function generateColor(cssVariable) {
    return () => {
        return `var(${cssVariable})`
    }
}

function generateFontsizes(start = 1, end = 8, step = 0.5){
    let cursor = start;
    let sizes = {};
    while(cursor <= (end)){
        sizes[cursor] = (0.25 * cursor) + 'rem';
        cursor += step;
    }
    return sizes
}

module.exports = {
    mode: "jit",
    content: [
        './templates/**/*.html.twig',
        './templates/*.html.twig',
    ],
    theme: {
        extend: {
            inset: {
                "6.5" : "1.625rem"
            },
            minWidth: {
                "1.5" : "0.375rem",
                "3.5" : "0.875rem",
                "5" : "1.25rem",
            },
            minHeight: {
                "1.5" : "0.375rem",
                "3.5" : "0.875rem",
                "5" : "1.25rem",
            },
            colors : {
                'primary': '#001D4A',
                'primary-active': '#001D4A',
                'primary-hover': '#006992',

                'secondary': '#ECA400',
                'secondary-active': '#EAF8BF',
                'secondary-hover': '#EAF8BF',

                theme:{
                    light: '#EDEFF5',
                    lighter: '#F7F8FC',
                    gray: {
                        logo: '#58595B',
                        asleep: '#778192',
                        soft: '#DFE1E6',
                        white: '#FFFFFF',
                        light: '#EDEFF5',
                        lighter: '#F7F8FC'
                    },
                    dark: '#25262D',
                    darkActive: '#434552',
                    darkHover: '#32343D',
                },
            },
            borderWidth: {
                '3': '3px',
            },
            fontFamily: {
                logo: ["Gill Sans MT"],
                poppin: ["Poppins"]
            },
            fontSize : generateFontsizes(),
            spacing: {
                '3/5' : '60%'
            },
        }
    },
    variants: {
        extend: {
            fontSize: ['hover'],
            fontWeight: ['hover'],
            ringWidth: ['hover'],
        }
    },
    plugins: [
        plugin(function ({ addVariant }) {
            // Add a `third` variant, ie. `third:pb-0`
            addVariant('selected', '&.active')
        }),
        require('./assets/tailwind/buttons'),
    ]
}