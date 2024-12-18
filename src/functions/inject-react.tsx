import { baseCss } from '@/constants';
import { getId } from '@/functions';
import { createRoot } from 'react-dom/client';

export const injectReact = (id: string, component: JSX.Element, css = true) => {
    // Create a div element to mount the React app
    const appId = getId(id);
    const appContainer =
        document.getElementById(appId) || document.createElement('div');
    appContainer.id = appId;

    document.documentElement.appendChild(appContainer);

    const shadowRoot = appContainer.attachShadow({ mode: 'open' });

    const html = document.createElement('html');

    if (css) {
        const cssId = getId(`${id}-css`);
        if (document.getElementById(cssId)) return;
        const link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = chrome.runtime.getURL('css/main.css');
        link.media = 'all';

        const head = document.createElement('head');
        head.appendChild(link);
        html.appendChild(head);
    }

    const renderIn = document.createElement('body');
    html.appendChild(renderIn);

    //insert this style for global css
    const style = document.createElement('style');
    style.textContent = baseCss;
    shadowRoot.appendChild(style);

    // Create and inject the first preconnect link for fonts.googleapis.com
    const preconnectGoogleFonts = document.createElement('link');
    preconnectGoogleFonts.rel = 'preconnect';
    preconnectGoogleFonts.href = 'https://fonts.googleapis.com';
    shadowRoot.appendChild(preconnectGoogleFonts);

    // Create and inject the second preconnect link for fonts.gstatic.com with crossorigin attribute
    const preconnectGStatic = document.createElement('link');
    preconnectGStatic.rel = 'preconnect';
    preconnectGStatic.href = 'https://fonts.gstatic.com';
    preconnectGStatic.crossOrigin = 'anonymous';
    shadowRoot.appendChild(preconnectGStatic);

    // Create and inject the stylesheet link for Silkscreen font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href =
        'https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap';
    shadowRoot.appendChild(fontLink);

    shadowRoot.appendChild(html);
    const root = createRoot(renderIn);
    root.render(component);
};

export const closeReact = (id: string) => {
    const appId = getId(id);
    const app = document.getElementById(appId);
    if (!app) return;
    app.remove();
};
