'use client';

import React, { createContext, useContext, useState } from 'react';
import Head from 'next/head';
// Create Theme Context
const ThemeContext = createContext();

// Color Themes
const colorThemes = {
    blue: {
        primary: {
            light: 'bg-blue-300',
            default: 'bg-blue-500',
            dark: 'bg-blue-700',
            text: 'text-blue-500',
            border: 'border-blue-500',
        },
        secondary: {
            light: 'bg-sky-300',
            default: 'bg-sky-500',
            dark: 'bg-sky-700',
            text: 'text-sky-500',
            border: 'border-sky-500',
        },
        background: {
            light: 'bg-slate-100',
            default: 'bg-slate-200',
            dark: 'bg-slate-800',
            gradient: 'bg-gradient-to-br from-blue-900 via-gray-900 to-black',
        },
        glow: {
            primary: 'bg-blue-500/30',
            secondary: 'bg-sky-400/20',
            accent: 'bg-indigo-600/25',
        }
    },

    purple: {
        primary: {
            light: 'bg-purple-300',
            default: 'bg-purple-500',
            dark: 'bg-purple-700',
            text: 'text-purple-500',
            border: 'border-purple-500',
        },
        secondary: {
            light: 'bg-violet-300',
            default: 'bg-violet-500',
            dark: 'bg-violet-700',
            text: 'text-violet-500',
            border: 'border-violet-500',
        },
        background: {
            light: 'bg-slate-100',
            default: 'bg-slate-200',
            dark: 'bg-slate-800',
            gradient: 'bg-gradient-to-br from-purple-900 via-gray-900 to-black',
        },
        glow: {
            primary: 'bg-purple-500/30',
            secondary: 'bg-violet-400/20',
            accent: 'bg-fuchsia-600/25',
        }
    },

    green: {
        primary: {
            light: 'bg-emerald-300',
            default: 'bg-emerald-500',
            dark: 'bg-emerald-700',
            text: 'text-emerald-500',
            border: 'border-emerald-500',
        },
        secondary: {
            light: 'bg-green-300',
            default: 'bg-green-500',
            dark: 'bg-green-700',
            text: 'text-green-500',
            border: 'border-green-500',
        },
        background: {
            light: 'bg-slate-100',
            default: 'bg-slate-200',
            dark: 'bg-slate-800',
            gradient: 'bg-gradient-to-br from-emerald-900 via-gray-900 to-black',
        },
        glow: {
            primary: 'bg-emerald-500/30',
            secondary: 'bg-green-400/20',
            accent: 'bg-teal-600/25',
        }
    },

    dark: {
        primary: {
            light: 'bg-gray-600',
            default: 'bg-gray-700',
            dark: 'bg-gray-800',
            text: 'text-gray-300',
            border: 'border-gray-500',
        },
        secondary: {
            light: 'bg-gray-500',
            default: 'bg-gray-600',
            dark: 'bg-gray-700',
            text: 'text-gray-400',
            border: 'border-gray-600',
        },
        background: {
            light: 'bg-gray-800',
            default: 'bg-gray-900',
            dark: 'bg-black',
            gradient: 'bg-gradient-to-br from-gray-800 via-gray-900 to-black',
        },
        glow: {
            primary: 'bg-gray-500/30',
            secondary: 'bg-blue-400/10',
            accent: 'bg-purple-600/15',
        }
    },
};

// Layout Themes
const layoutThemes = {
    centered: {
        container: 'flex flex-col items-center justify-center min-h-screen',
        content: 'w-full max-w-4xl p-6',
    },

    grid: {
        container: 'grid grid-cols-1 md:grid-cols-3 gap-6 p-6',
        content: 'w-full',
    },

    sidebar: {
        container: 'flex flex-col md:flex-row min-h-screen',
        sidebar: 'w-full md:w-64 p-6 shrink-0',
        content: 'flex-grow p-6',
    },

    splitView: {
        container: 'flex flex-col md:flex-row min-h-screen',
        left: 'w-full md:w-1/2 p-6 overflow-auto',
        right: 'w-full md:w-1/2 p-6 overflow-auto',
    },
    // Add these new layouts to your layoutThemes object
    fullscreen: {
        container: 'flex flex-col min-h-screen',
        header: 'w-full p-4 bg-white bg-opacity-20 backdrop-blur-sm',
        content: 'flex-grow p-6 flex items-center justify-center',
        footer: 'w-full p-4 bg-white bg-opacity-20 backdrop-blur-sm',
    },

    cards: {
        container: 'p-6 flex flex-wrap gap-6 justify-center',
        card: 'w-full sm:w-64 p-6 rounded-lg shadow-lg bg-white bg-opacity-90',
    },
};

// Size Themes
const sizeThemes = {
    compact: {
        padding: 'p-2',
        margin: 'm-2',
        gap: 'gap-2',
        text: 'text-sm',
        height: 'h-8',
        input: 'h-8 text-sm',
    },

    default: {
        padding: 'p-4',
        margin: 'm-4',
        gap: 'gap-4',
        text: 'text-base',
        height: 'h-10',
        input: 'h-10 text-base',
    },

    spacious: {
        padding: 'p-6',
        margin: 'm-6',
        gap: 'gap-6',
        text: 'text-lg',
        height: 'h-12',
        input: 'h-12 text-lg',
    },
};

// Add this new component below the PreviewComponent
const ExtendedPreviewComponent = () => {
    const { color, size } = useTheme();

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-medium mb-3">Alert Components</h3>
                <div className={`${color.primary.light} border-l-4 ${color.border} p-4 mb-3`}>
                    <p className="font-medium">Info Alert</p>
                    <p className="text-sm opacity-75">This is an information message</p>
                </div>
                <div className={`bg-red-100 border-l-4 border-red-500 p-4`}>
                    <p className="font-medium text-red-700">Error Alert</p>
                    <p className="text-sm text-red-600 opacity-75">Something went wrong</p>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-medium mb-3">Navigation</h3>
                <nav className={`${color.background.dark} p-3 rounded-md flex ${size.gap}`}>
                    <a href="#" className={`${color.text} hover:text-white ${size.padding} rounded-md`}>Home</a>
                    <a href="#" className={`${color.text} hover:text-white ${size.padding} rounded-md`}>About</a>
                    <a href="#" className={`${color.text} hover:text-white ${size.padding} rounded-md`}>Contact</a>
                </nav>
            </div>

            <div>
                <h3 className="text-xl font-medium mb-3">Badge</h3>
                <div className="flex gap-2">
                    <span className={`${color.primary.default} text-white text-xs px-2 py-1 rounded-full`}>New</span>
                    <span className={`${color.secondary.default} text-white text-xs px-2 py-1 rounded-full`}>Featured</span>
                </div>
            </div>
        </div>
    );
};
// Create this new component
const ResetButton = () => {
    const theme = useTheme();

    const handleReset = () => {
        theme.setColorTheme('blue');
        theme.setLayoutTheme('centered');
        theme.setSizeTheme('default');
    };

    return (
        <button
            onClick={handleReset}
            className={`mt-4 w-full ${theme.color.primary.default} hover:${theme.color.primary.dark} text-white ${theme.size.padding} rounded-md font-medium transition-colors duration-200`}
        >
            Reset to Defaults
        </button>
    );
};

// Then add this line at the end of your ThemeSwitcher component's JSX
<ResetButton />
// Theme Switcher Component
const ThemeSwitcher = () => {
    const theme = useTheme();

    return (
        <div className="flex flex-col gap-4 p-4 border rounded-lg">
            <div>
                <label className="block mb-2 font-medium">Color Theme:</label>
                <select
                    value={theme.colorTheme}
                    onChange={(e) => theme.setColorTheme(e.target.value)}
                    className={`w-full px-3 border rounded-md`}
                >
                    {theme.colorOptions.map(option => (
                        <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block mb-2 font-medium">Layout:</label>
                <select
                    value={theme.layoutTheme}
                    onChange={(e) => theme.setLayoutTheme(e.target.value)}
                    className={`w-full px-3 border rounded-md`}
                >
                    {theme.layoutOptions.map(option => (
                        <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                    ))}
                </select>
            </div>
            <DarkModeToggle />

            <div>
                <label className="block mb-2 font-medium">Size:</label>
                <select
                    value={theme.sizeTheme}
                    onChange={(e) => theme.setSizeTheme(e.target.value)}
                    className={`w-full px-3 border rounded-md`}
                >
                    {theme.sizeOptions.map(option => (
                        <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                    ))}
                </select>
            </div>
            
        </div>
    );
};

// Example of a themed background component
const ThemedBackground = () => {
    const { color } = useTheme();

    return (
        <div className="absolute inset-0 z-[-1] overflow-hidden">
            {/* Glowing Background Layer */}
            <div className={`absolute inset-0 ${color.background.gradient} opacity-80`}></div>

            {/* Moving Light Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,150,255,0.3)_0%,transparent_50%)] animate-glow-move"></div>

            {/* Floating Blurred Glows */}
            <div className={`absolute top-1/4 left-1/3 w-60 h-60 ${color.glow.primary} blur-3xl rounded-full animate-glow-float`}></div>
            <div className={`absolute bottom-1/3 right-1/4 w-80 h-80 ${color.glow.accent} blur-3xl rounded-full animate-glow-float-reverse`}></div>
            <div className={`absolute top-1/2 right-1/3 w-40 h-40 ${color.glow.secondary} blur-3xl rounded-full animate-glow-float`}></div>
        </div>
    );
};

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
    const [colorTheme, setColorTheme] = useState('blue');
    const [layoutTheme, setLayoutTheme] = useState('centered');
    const [sizeTheme, setSizeTheme] = useState('default');
    const [darkMode, setDarkMode] = useState(false); // Add dark mode state

    // Get current theme values
    // If dark mode is on, use the dark theme; otherwise use the selected colorTheme
    const currentColorTheme = darkMode ? colorThemes.dark : colorThemes[colorTheme];
    const currentLayoutTheme = layoutThemes[layoutTheme];
    const currentSizeTheme = sizeThemes[sizeTheme];
    

    // Combined theme context value
    const theme = {
        color: currentColorTheme,
        layout: currentLayoutTheme,
        size: currentSizeTheme,
        colorTheme,
        layoutTheme,
        darkMode,
        sizeTheme,
        setColorTheme,
        setLayoutTheme,
        setSizeTheme,
        colorOptions: Object.keys(colorThemes),
        layoutOptions: Object.keys(layoutThemes),
        sizeOptions: Object.keys(sizeThemes),
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};
// 2. Make sure DarkModeToggle is implemented correctly
const DarkModeToggle = () => {
    const theme = useTheme();

    return (
        <div className="flex items-center justify-between mt-4 p-2 border rounded-md">
            <span className="font-medium">Dark Mode</span>
            <button
                onClick={() => theme.setDarkMode(!theme.darkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${theme.darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${theme.darkMode ? 'translate-x-6' : 'translate-x-1'}`}
                />
            </button>
        </div>
    );
};
// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);

// Preview component to show themed elements
const PreviewComponent = () => {
    const { color, size } = useTheme();

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-medium mb-3">Buttons</h3>
                <div className="flex flex-wrap gap-3">
                    <button className={`${color.primary.default} hover:${color.primary.dark} text-white ${size.padding} rounded-md font-medium transition-colors duration-200`}>
                        Primary Button
                    </button>
                    <button className={`${color.secondary.default} hover:${color.secondary.dark} text-white ${size.padding} rounded-md font-medium transition-colors duration-200`}>
                        Secondary Button
                    </button>
                    <button className={`bg-transparent ${color.border} hover:${color.primary.light} ${color.text} ${size.padding} rounded-md font-medium transition-colors duration-200`}>
                        Outline Button
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-medium mb-3">Form Elements</h3>
                <div className="space-y-3">
                    <div>
                        <label className={`block mb-2 font-medium ${size.text}`}>Text Input</label>
                        <input
                            type="text"
                            placeholder="Enter some text"
                            className={`w-full ${size.input} px-3 border ${color.border} rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${color.text}`}
                        />
                    </div>

                    <div>
                        <label className={`block mb-2 font-medium ${size.text}`}>Select</label>
                        <select className={`w-full ${size.input} px-3 border ${color.border} rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${color.text}`}>
                            <option>Option 1</option>
                            <option>Option 2</option>
                            <option>Option 3</option>
                        </select>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-medium mb-3">Card Example</h3>
                <div className={`${color.background.light} p-4 rounded-lg border ${color.border}`}>
                    <h4 className={`${color.text} font-semibold mb-2`}>Card Title</h4>
                    <p className="text-gray-600">This card adjusts its style based on the selected theme.</p>
                </div>
            </div>
        </div>
    );
};

// Adaptive Layout Component
const AdaptiveLayout = ({ children }) => {
    const { layoutTheme, layout } = useTheme();

    // These are the content sections that will be arranged differently based on layout
    const themeSwitcherCard = (
        <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Theme Controls</h2>
            <ThemeSwitcher />
        </div>
    );

    const previewCard = (
        <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Preview</h2>
            <PreviewComponent />
        </div>
    );

    // Render different layouts based on the selected theme
    switch (layoutTheme) {
        case 'grid':
            return (
                <div className={layout.container}>
                    <div className="col-span-1">
                        <h1 className="text-3xl font-bold mb-6 text-white">Theme Demo</h1>
                    </div>
                    <div className="col-span-1">
                        {themeSwitcherCard}
                    </div>
                    <div className="col-span-1">
                        {previewCard}
                    </div>
                </div>
            );

        case 'sidebar':
            return (
                <div className={layout.container}>
                    <div className={`${layout.sidebar} bg-white bg-opacity-90 rounded-lg shadow-lg`}>
                        <h1 className="text-3xl font-bold mb-6">Theme Demo</h1>
                        {themeSwitcherCard}
                    </div>
                    <div className={layout.content}>
                        {previewCard}
                    </div>
                </div>
            );

        case 'splitView':
            return (
                <div className={layout.container}>
                    <div className={layout.left}>
                        <h1 className="text-3xl font-bold mb-6 text-white">Theme Demo</h1>
                        {themeSwitcherCard}
                    </div>
                    <div className={layout.right}>
                        {previewCard}
                    </div>
                </div>
            );

        case 'centered':
        default:
            return (
                <div className={layout.container}>
                    <div className={layout.content}>
                        <h1 className="text-3xl font-bold mb-6 text-white text-center">Theme Demo</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {themeSwitcherCard}
                            {previewCard}
                        </div>
                    </div>
                </div>
            );
        // Add these cases to your switch statement in AdaptiveLayout
        case 'fullscreen':
            return (
                <div className={`${layout.container} layout-transition animate-fade-in`}>
                    <header className={layout.header}>
                        <h1 className="text-3xl font-bold text-white">Theme Demo</h1>
                    </header>
                    <main className={layout.content}>
                        <div className="max-w-4xl w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {themeSwitcherCard}
                                {previewCard}
                            </div>
                        </div>
                    </main>
                    <footer className={layout.footer}>
                        <p className="text-center text-white">Theme System Demo</p>
                    </footer>
                </div>
            );

        case 'cards':
            return (
                <div className={`${layout.container} layout-transition animate-fade-in`}>
                    <div className={layout.card}>
                        <h1 className="text-3xl font-bold mb-6">Theme Demo</h1>
                    </div>
                    <div className={layout.card}>
                        <h2 className="text-2xl font-semibold mb-4">Theme Controls</h2>
                        <ThemeSwitcher />
                    </div>
                    <div className={layout.card}>
                        <h2 className="text-2xl font-semibold mb-4">Preview</h2>
                        <PreviewComponent />
                    </div>
                </div>
            );
    }
};

// Main Page Component
export default function ThemePage() {
    return (
        <ThemeProvider>
            <Head>
                <style jsx global>{`
                    /* Transition styles */
                    .layout-transition {
                        transition: all 0.5s ease-in-out;
                    }
                    
                    /* Animation keyframes */
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    .animate-fade-in {
                        animation: fadeIn 0.4s ease-in-out;
                    }
                `}</style>
            </Head>
            <div className="min-h-screen">
                <ThemedBackground />
                <AdaptiveLayout />
            </div>
        </ThemeProvider>
    );
}