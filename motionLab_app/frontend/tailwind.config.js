/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        screens: {
            'xs': '525px',
            'sm': '625px',
            'md': '768px',
            'lg': '976px',
            'xl': '1440px',
        },
        extend: {
            colors: {
                // primary: '#FFF',
                // secondary: '#51bfff',
                // bgColor: '#222222'
            },
            animation: {
                'gradient-x': 'gradient-x 10s ease-in-out infinite alternate',
                'gradient-y': 'gradient-y 10s ease-in-out infinite alternate',
                'gradient-xy': 'gradient-xy 10s ease-in-out infinite alternate',
                'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 20s ease-in-out infinite',
                'bounce-slow': 'bounce 3s infinite',
                'spin-slow': 'spin 8s linear infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'marquee': 'marquee 25s linear infinite',
            },
            keyframes: {
                'gradient-x': {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left center'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center'
                    }
                },
                'gradient-y': {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'top center'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'bottom center'
                    }
                },
                'gradient-xy': {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left top'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right bottom'
                    }
                },
                'float': {
                    '0%': { transform: 'translateY(0) translateX(0)' },
                    '25%': { transform: 'translateY(-15px) translateX(15px)' },
                    '50%': { transform: 'translateY(15px) translateX(-15px)' },
                    '75%': { transform: 'translateY(-7px) translateX(10px)' },
                    '100%': { transform: 'translateY(0) translateX(0)' },
                },
                'shimmer': {
                    '0%': { 'background-position': '-200% 0' },
                    '100%': { 'background-position': '200% 0' },
                },
                'marquee': {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                }
            },
            boxShadow: {
                'glow-sm': '0 0 5px rgba(167, 139, 250, 0.5)',
                'glow': '0 0 15px rgba(167, 139, 250, 0.5)',
                'glow-lg': '0 0 25px rgba(167, 139, 250, 0.5)',
                'glow-xl': '0 0 50px rgba(167, 139, 250, 0.5)',
                'inner-glow': 'inset 0 0 15px rgba(167, 139, 250, 0.5)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'mesh-pattern': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 20 20\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M0 0h20v20H0V0zm2 2v16h16V2H2z\'/%3E%3C/g%3E%3C/svg%3E")',
            },
        },
    },
    plugins: [],
}