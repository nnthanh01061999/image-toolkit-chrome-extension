import { Video, Image } from '@/types';

export const getAllImageInPage = () => {
    return {
        images: Array.from(document.getElementsByTagName<'img'>('img')).map(
            (link) => {
                const width = link.naturalWidth;
                const height = link.naturalHeight;
                return {
                    src: link.getAttribute('src') ?? '',
                    alt: link.getAttribute('alt') ?? '',
                    width: width ? +width : 0,
                    height: height ? +height : 0,
                    top: link.getBoundingClientRect().top,
                };
            },
        ),
        videos: Array.from(document.getElementsByTagName<'video'>('video'))
            .filter((link) => !link.getAttribute('id')?.includes('preview'))
            .map((link) => {
                if (link.getAttribute('src')) {
                    return {
                        src: link.getAttribute('src') ?? '',
                        type: link.getAttribute('type') ?? '',
                    };
                } else {
                    return Array.from(
                        link.getElementsByTagName<'source'>('source'),
                    ).map((source: any) => ({
                        src: source.getAttribute('src') ?? '',
                        type: source.getAttribute('type') ?? '',
                    }));
                }
            })
            .reduce(
                (prev: Video[], cur) => [
                    ...prev,
                    ...(Array.isArray(cur) ? cur : [cur]),
                ],
                [],
            ),
    };
};

export const getAllUniqueImageInPage = () => {
    const data = getAllImageInPage();
    const originalImages = data.images;
    const images: Image[] = [
        ...((new Map(
            originalImages?.map((item) => [item['src'], item]),
        ).values() as any) || []),
    ];
    return images;
};
