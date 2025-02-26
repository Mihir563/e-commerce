// Example usage of the theme system in components

import React from 'react';
import { useTheme } from './theme';

// Theme Switcher Component
export const ThemeSwitcher = () => {
    const theme = useTheme();

    return (
        <div className="flex flex-col gap-4 p-4 border rounded-lg">
            <div>
                <label className="block mb-2 font-medium">Color Theme:</label>
                <select
                    value={theme.colorTheme}
                    onChange={(e) => theme.setColorTheme(e.target.value)}
                    className={`w-full ${theme.size.height} px-3 border rounded-md`}
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
                    className={`w-full ${theme.size.height} px-3 border rounded-md`}
                >
                    {theme.layoutOptions.map(option => (
                        <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block mb-2 font-medium">Size:</label>
                <select
                    value={theme.sizeTheme}
                    onChange={(e) => theme.setSizeTheme(e.target.value)}
                    className={`w-full ${theme.size.height} px-3 border rounded-md`}
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
export const ThemedBackground = () => {
    const { color } = useTheme();

    return (
        <div className="absolute inset-0 z-[-1] overflow-hidden">
            {/* Glowing Background Layer */}
            <div className={`absolute inset-0 ${color.background.gradient} opacity-80`}></div>

            {/* Moving Light Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,150,255,0.3)_0%,transparent_50%)] animate-glow-move"></div>

            {/* Floating Blurred Glows */}
            <div className={`absolute top-1/4 left-1/3 w-60 h-60 ${color.glow.primary} blur-3xl rounded-full animate-glow-float animate-glow-pulse`}></div>
            <div className={`absolute bottom-1/3 right-1/4 w-80 h-80 ${color.glow.accent} blur-3xl rounded-full animate-glow-float-reverse`}></div>
            <div className={`absolute top-1/2 right-1/3 w-40 h-40 ${color.glow.secondary} blur-3xl rounded-full animate-glow-float`}></div>
        </div>
    );
};

// Example of a themed layout component with dynamic layout switching
export const ThemedLayout = ({ children }) => {
    const { layout, size } = useTheme();

    // For sidebar layout
    if (layout === layoutThemes.sidebar) {
        return (
            <div className={layout.container}>
                <div className={`${layout.sidebar} ${size.padding}`}>
                    <ThemeSwitcher />
                    {/* Other sidebar content */}
                </div>
                <main className={`${layout.content} ${size.padding}`}>
                    {children}
                </main>
            </div>
        );
    }

    // For split view layout
    if (layout === layoutThemes.splitView) {
        return (
            <div className={layout.container}>
                <div className={`${layout.left} ${size.padding}`}>
                    <ThemeSwitcher />
                    {/* Left panel content */}
                </div>
                <div className={`${layout.right} ${size.padding}`}>
                    {children}
                </div>
            </div>
        );
    }

    // For grid layout
    if (layout === layoutThemes.grid) {
        return (
            <div className={layout.container}>
                <div className={layout.content}>
                    <ThemeSwitcher />
                </div>
                {/* Convert children to grid items */}
                {React.Children.map(children, child => (
                    <div className={`${layout.content} ${size.padding} border rounded-lg`}>
                        {child}
                    </div>
                ))}
            </div>
        );
    }

    // Default centered layout
    return (
        <div className={layout.container}>
            <div className={`${layout.content} ${size.padding}`}>
                <ThemeSwitcher />
                {children}
            </div>
        </div>
    );
};

// Example of themed form inputs
export const ThemedInput = ({ label, ...props }) => {
    const { color, size } = useTheme();

    return (
        <div className={`mb-4`}>
            {label && <label className={`block mb-2 font-medium ${size.text}`}>{label}</label>}
            <input
                className={`w-full ${size.input} px-3 border ${color.border} rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${color.text}`}
                {...props}
            />
        </div>
    );
};

// Example of themed button
export const ThemedButton = ({ children, variant = "primary", ...props }) => {
    const { color, size } = useTheme();

    const buttonClasses = {
        primary: `${color.primary.default} hover:${color.primary.dark} text-white`,
        secondary: `${color.secondary.default} hover:${color.secondary.dark} text-white`,
        outline: `bg-transparent ${color.border} hover:${color.primary.light} ${color.text}`,
    };

    return (
        <button
            className={`${buttonClasses[variant]} ${size.padding} rounded-md font-medium ${size.text} transition-colors duration-200`}
            {...props}
        >
            {children}
        </button>
    );
};