import { IMAGE_MINIMAP } from '@/constants';
import { getAllImageInPage } from '@/functions/get-image';
import { Image } from '@/types';
import { scrollIntoImage } from '@/functions/scroll-to-image';
import { viewImage } from '@/functions/view-image';

export const showImageMinimap = () => {
    const id = IMAGE_MINIMAP;
    const modalElement = document.querySelector(`#${id}`);
    if (modalElement) {
        modalElement.remove();
        return;
    }

    window.scrollTo({ top: 0 });

    const data = getAllImageInPage();

    const originalImages = data.images;

    const images: Image[] = [
        ...((new Map(
            originalImages?.map((item) => [item['src'], item])
        ).values() as any) || []),
    ];

    if (images.length === 0) return;

    const bodyHeight = (document.querySelector('body')?.scrollHeight ||
        0) as number;

    const styleElement = document.createElement('style');

    // Set the CSS rules as text content
    styleElement.textContent = `
    .scrollbar-hide::-webkit-scrollbar-thumb {
        display: none;
    }

    /* Hide the scrollbar track (Firefox) */
    .scrollbar-hide {
        scrollbar-width: none;
    }

    /* Hide the scrollbar track (IE/Edge) */
    .scrollbar-hide::-webkit-scrollbar {
        width: 0;
        display: none;
        background: transparent; /* Optional: If you want to hide the scrollbar track */
    }
`;

    // Append the <style> element to the <head> or <body> of the document
    document.head.appendChild(styleElement);

    const modal = document.createElement('div');
    modal.id = id;
    modal.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        min-width: 136px;
        width: auto;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 99999999;
        display: flex;
        justify-content: center;
        align-items: center;
      `;

    const closeButton = document.createElement('button');
    closeButton.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        font-size: 8px;
        font-weight: 500; 
        transition: color 0.15s ease;
        outline: none;
        background-color: rgb(9, 9, 11);
        color: rgb(250, 250, 250);
        position: fixed;
        padding: 4px;
        width: 20px;
        height: 20px;
        top: 0px;
        right: 136px;
        cursor: pointer;
        border: none;
    `;

    closeButton.textContent = 'X';
    closeButton.onclick = () => {
        closeImageTree();
    };

    modal.appendChild(closeButton);

    const imagesWithPosition = images.reduce(
        (prev, cur) => {
            const percent = ((cur?.top || 0) / bodyHeight) * 100;
            const position = Math.floor(percent / 10);

            return [
                ...prev.slice(0, position),
                [...(prev[position] || []), cur],
                ...prev.slice(position + 1),
            ];
        },
        Array(10).map(() => [] as Image[])
    );

    const contentElement = document.createElement('div');
    contentElement.style.cssText = `
        display: block;
        position: relative;
        height: 100%;
        width: 100%;
    `;

    imagesWithPosition?.forEach((images, index) => {
        const groupElement = document.createElement('div');
        groupElement.style.cssText = `
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            position: absolute;
            right: 0;
            top: ${index * 10}%;
            gap: 2px;
            align-items: center;
            z-index: 2;
            height: 10%;
            overflow: auto;
            width: 100%;
            padding: 0px 2px;
        `;

        groupElement.classList.add('scrollbar-hide');

        images?.forEach((image) => {
            const imageElement = document.createElement('img');

            imageElement.style.cssText = `
            object-cover: contain;
            width: 30px;
            height: auto;
            max-height: 30px;
            cursor: pointer;
        `;

            imageElement.src = image.src;
            imageElement.onclick = () => {
                scrollIntoImage(image.src);
            };
            imageElement.ondblclick = () => {
                viewImage(imageElement.src);
            };
            groupElement.appendChild(imageElement);
        });
        contentElement.appendChild(groupElement);
    });

    modal.appendChild(contentElement);

    document.body.appendChild(modal);

    drawViewportDiv();

    document.addEventListener('keydown', handleKeyDown);

    window.addEventListener('scroll', drawViewportDiv);
};

const closeImageTree = () => {
    const modal = document.getElementById(IMAGE_MINIMAP);
    if (modal) {
        modal.remove();
        document.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('scroll', drawViewportDiv);
    }
};

const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        closeImageTree();
    }
};

const drawViewportDiv = () => {
    const viewportDiv = document.getElementById('viewport-div');
    const parent = document.querySelector(`#${IMAGE_MINIMAP}`);
    if (!parent) return;

    const viewportHeight = window.innerHeight;

    const bodyHeight = (document.querySelector('body')?.scrollHeight ||
        0) as number;

    const position = Math.floor((window.scrollY / bodyHeight) * 100);

    if (viewportDiv) {
        viewportDiv.style.width = '136px';
        viewportDiv.style.height = `${
            (viewportHeight / bodyHeight) * viewportHeight
        }px`;
        viewportDiv.style.right = '0px';
        viewportDiv.style.top = `${position}%`;
        return;
    }

    const newDiv = document.createElement('div');
    newDiv.id = 'viewport-div';
    newDiv.style.position = 'fixed';
    newDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    newDiv.style.width = '136px';
    newDiv.style.height = `${(viewportHeight / bodyHeight) * viewportHeight}px`;
    newDiv.style.right = '0px';
    newDiv.style.top = `${position}%`;
    newDiv.style.zIndex = '1';
    parent.appendChild(newDiv);
};
