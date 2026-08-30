import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useRadioControls } from '/@/renderer/features/radio/hooks/use-radio-player';
import { useCurrentServerId } from '/@/renderer/store';
import { ContextMenu } from '/@/shared/components/context-menu/context-menu';
import { InternetRadioStation, LibraryItem } from '/@/shared/types/domain-types';

interface PlayRadioActionProps {
    ids: string[];
    itemType: LibraryItem;
    radio: InternetRadioStation;
}

export const PlayRadioAction = ({ ids, itemType, radio }: PlayRadioActionProps) => {
    const { t } = useTranslation();
    const { play } = useRadioControls();
    const serverId = useCurrentServerId();

    const handlePlay = useCallback(() => {
        if (ids.length === 0 || !serverId) return;

        if (itemType == LibraryItem.RADIO_STATION) {
            play(radio.streamUrl, radio.name, {
                id: radio.id,
                imageId: radio.imageId,
                imageUrl: radio.imageUrl,
                serverId: serverId,
            });
        }
    }, [ids, itemType, play, serverId, radio]);

    const handlePlayNow = useCallback(() => {
        handlePlay();
    }, [handlePlay]);

    if (ids.length === 0) return null;

    return (
        <ContextMenu.Item leftIcon="mediaPlay" onSelect={handlePlayNow}>
            {t('player.play')}
        </ContextMenu.Item>
    );
};
