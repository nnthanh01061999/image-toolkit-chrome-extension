import ExifrInfo from '@/components/app/ExifrInfo';
import SocialSharePopover from '@/components/app/SocialSharePopover';
import Show from '@/components/condition/Show';
import { Button } from '@/components/ui/button';
import { markImage } from '@/functions';
import { cn } from '@/lib/utils';
import { ChromeActionEnum, Image } from '@/types';
import { downLoadImage, sendChromeMessage } from '@/util';
import {
    Bookmark,
    Check,
    Download,
    ExternalLink,
    Share2,
    Target,
    Trash,
} from 'lucide-react';

interface Props {
    data: Image;
    selected: boolean;
    mark?: boolean;
    onSelect: () => void;
    onDownloadError: (src: string) => void;
    unMarkImage?: (src: string) => void;
}

function ImageItem(props: Props) {
    const {
        data,
        selected,
        mark = false,
        onSelect,
        onDownloadError,
        unMarkImage,
    } = props;

    const handleOpenImage = () => {
        chrome.windows.create({ url: data.src, incognito: true });
    };

    const handleScrollInto = () => {
        sendChromeMessage({
            type: ChromeActionEnum.SCROLL_INTO_IMAGE,
            data: data.src,
        });
    };

    const onMarkImage = () => markImage(data);

    const onUnMarkImage = () => unMarkImage?.(data.src);

    return (
        <div
            className={cn([
                'flex cursor-pointer space-y-1',
                selected ? 'bg-accent' : 'bg-white',
            ])}
            onClick={onSelect}
        >
            <div
                className={cn([
                    'grid w-full items-start p-2',
                    'grid-cols-[476px,108px]',
                ])}
            >
                <div className='grid gap-1'>
                    <p
                        id={data.src}
                        className='cursor-pointer whitespace-break-spaces break-all'
                    >
                        {data.src}
                    </p>
                    <div className='max-w-[476px]'>
                        <ExifrInfo url={data.src} enabled />
                    </div>
                </div>
                <div
                    className='grid grid-cols-3'
                    onClick={(e) => e.stopPropagation()}
                >
                    <Button
                        title={chrome.i18n.getMessage('download.message')}
                        size='sm'
                        variant='ghost'
                        onClick={downLoadImage(data, onDownloadError)}
                    >
                        <Download size={16} />
                    </Button>
                    <SocialSharePopover url={data.src}>
                        <Button title='Share' size='sm' variant='ghost'>
                            <Share2 size={16} />
                        </Button>
                    </SocialSharePopover>
                    {mark && (
                        <Button
                            title={chrome.i18n.getMessage(
                                'view_image_in_new_tab.message',
                            )}
                            size='sm'
                            variant='ghost'
                            onClick={handleOpenImage}
                        >
                            <ExternalLink size={16} />
                        </Button>
                    )}
                    {mark && (
                        <Button
                            title={chrome.i18n.getMessage('scroll_into_image')}
                            size='sm'
                            variant='ghost'
                            onClick={handleScrollInto}
                        >
                            <Target size={16} />
                        </Button>
                    )}
                    {mark ? (
                        <Button
                            title={chrome.i18n.getMessage('mark.message')}
                            size='sm'
                            variant='ghost'
                            onClick={onMarkImage}
                        >
                            <Bookmark size={16} />
                        </Button>
                    ) : (
                        <Button
                            title={chrome.i18n.getMessage('unmark.message')}
                            size='sm'
                            variant='ghost'
                            onClick={onUnMarkImage}
                        >
                            <Trash size={16} />
                        </Button>
                    )}
                    <Show when={selected}>
                        <Button size='sm' variant='ghost'>
                            <Check size={16} />
                        </Button>
                    </Show>
                </div>
            </div>

            <Show when={!!data.error || false}>
                <div className='flex'>
                    <span className='absolute inset-x-0 left-1/2 -translate-y-1/2 bg-background p-1'>
                        {data.error}
                    </span>
                </div>
            </Show>
        </div>
    );
}

export default ImageItem;
