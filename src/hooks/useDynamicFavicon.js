import { useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';

const useDynamicFavicon = () => {
    const faviconUrl = useAdminStore((state) => state.siteMedia.favicon?.url);

    useEffect(() => {
        if (!faviconUrl) return;

        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = faviconUrl;
    }, [faviconUrl]);
};

export default useDynamicFavicon;
