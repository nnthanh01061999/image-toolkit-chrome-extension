import { Button } from '@/components/ui/button';
import { SNAPSHOT_IMAGE } from '@/constants';
import { cropImage } from '@/functions';
import { closeReact } from '@/functions/inject-react';
import { saveBase64ToImage } from '@/util';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';

type TSnapShotImageProps = {
    src: string;
};

function SnapShotImage(props: TSnapShotImageProps) {
    const { src } = props;
    const [crop, setCrop] = useState<Crop>();
    const ref = useRef<HTMLImageElement>(null);

    const saveImage = () => {
        if (!ref.current || !crop) return;
        const image = cropImage(ref.current, crop);
        if (!image) return;
        const base64Data = image.split(',')[1];
        saveBase64ToImage(base64Data);
        closeReact(SNAPSHOT_IMAGE);
        document.body.style.overflow = 'auto';
    };

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            closeReact(SNAPSHOT_IMAGE);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className='fixed inset-0 z-[99999999] flex items-center justify-center bg-black/50'>
            <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onDragEnd={saveImage}
            >
                <img
                    ref={ref}
                    className='h-full w-full object-cover'
                    src={src}
                    alt={src}
                />
            </ReactCrop>

            <Button
                className='absolute right-4 top-4'
                onClick={() => closeReact(SNAPSHOT_IMAGE)}
            >
                Close
            </Button>
            <link
                href='https://unpkg.com/react-image-crop/dist/ReactCrop.css'
                rel='stylesheet'
            />
        </div>
    );
}

export default SnapShotImage;
