import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'soft': '0 4px 24px rgba(93, 107, 78, 0.08)',
        'soft-lg': '0 8px 32px rgba(93, 107, 78, 0.12)',
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        dividerWeight: "1px", 
        disabledOpacity: 0.45, 
        fontSize: {
          tiny: "0.75rem",
          small: "0.875rem",
          medium: "0.9375rem",
          large: "1.125rem",
        },
        lineHeight: {
          tiny: "1rem", 
          small: "1.25rem", 
          medium: "1.5rem", 
          large: "1.75rem", 
        },
        radius: {
          small: "8px", 
          medium: "12px", 
          large: "16px", 
        },
        borderWidth: {
          small: "1px", 
          medium: "1px", 
          large: "2px", 
        },
      },
      themes: {
        light: {
          colors: {
            background: {
              DEFAULT: "#FAF9F7"
            },
            content1: {
              DEFAULT: "#FFFFFF",
              foreground: "#1A1A1A"
            },
            content2: {
              DEFAULT: "#F5F3F0",
              foreground: "#1A1A1A"
            },
            content3: {
              DEFAULT: "#EDEAE5",
              foreground: "#1A1A1A"
            },
            content4: {
              DEFAULT: "#E5E1DB",
              foreground: "#1A1A1A"
            },
            divider: {
              DEFAULT: "rgba(26, 26, 26, 0.08)"
            },
            focus: {
              DEFAULT: "#5D6B4E"
            },
            foreground: {
              50: "#1A1A1A",
              100: "#2D2D2D",
              200: "#404040",
              300: "#525252",
              400: "#6B6B6B",
              500: "#858585",
              600: "#A3A3A3",
              700: "#C2C2C2",
              800: "#E0E0E0",
              900: "#F5F5F5",
              DEFAULT: "#1A1A1A"
            },
            overlay: {
              DEFAULT: "rgba(26, 26, 26, 0.4)"
            },
            default: {
              50: "#FAFAFA",
              100: "#F5F3F0",
              200: "#EDEAE5",
              300: "#E5E1DB",
              400: "#D5D0C8",
              500: "#C5BFB5",
              600: "#A8A196",
              700: "#8B8377",
              800: "#6E6558",
              900: "#514739",
              DEFAULT: "#F5F3F0",
              foreground: "#1A1A1A"
            },
            primary: {
              50: "#F0F2ED",
              100: "#E1E5DB",
              200: "#C3CBB7",
              300: "#A5B193",
              400: "#87976F",
              500: "#5D6B4E",
              600: "#4D5940",
              700: "#3D4732",
              800: "#2D3524",
              900: "#1D2316",
              DEFAULT: "#5D6B4E",
              foreground: "#FFFFFF"
            },
            secondary: {
              50: "#F8F5F2",
              100: "#F1EBE5",
              200: "#E3D7CB",
              300: "#D5C3B1",
              400: "#C7AF97",
              500: "#B99B7D",
              600: "#9A7D5F",
              700: "#7B5F41",
              800: "#5C4123",
              900: "#3D2305",
              DEFAULT: "#B99B7D",
              foreground: "#1A1A1A"
            },
            success: {
              50: "#e8faf0",
              100: "#d1f4e0",
              200: "#a2e9c1",
              300: "#74dfa2",
              400: "#45d483",
              500: "#17c964",
              600: "#12a150",
              700: "#0e793c",
              800: "#095028",
              900: "#052814",
              DEFAULT: "#17c964",
              foreground: "#FFFFFF"
            },
            warning: {
              50: "#fefce8",
              100: "#fdedd3",
              200: "#fbdba7",
              300: "#f9c97c",
              400: "#f7b750",
              500: "#f5a524",
              600: "#c4841d",
              700: "#936316",
              800: "#62420e",
              900: "#312107",
              DEFAULT: "#f5a524",
              foreground: "#2D3436"
            },
            danger: {
              50: "#fee7ef",
              100: "#fdd0df",
              200: "#faa0bf",
              300: "#f871a0",
              400: "#f54180",
              500: "#f31260",
              600: "#c20e4d",
              700: "#920b3a",
              800: "#610726",
              900: "#310413",
              DEFAULT: "#f31260",
              foreground: "#ffffff"
            }
          }
        }
      }
    })
  ]
}