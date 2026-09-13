import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useRadioControls } from '/@/renderer/features/radio/hooks/use-radio-player';
import { useCurrentServerId } from '/@/renderer/store';
import { ContextMenu } from '/@/shared/components/context-menu/context-menu';
import { InternetRadioStation } from '/@/shared/types/domain-types';

interface PlayRadioActionProps {
    stations: InternetRadioStation[];
}

export const PlayRadioAction = ({ stations }: PlayRadioActionProps) => {
    const { t } = useTranslation();
    const { play } = useRadioControls();
    const serverId = useCurrentServerId();

    const handlePlay = useCallback(() => {
        if (stations.length === 0 || !serverId) return;

        const station = stations[0];

        play(station?.streamUrl, station?.name, {
            id: station?.id,
            imageId: station?.imageId,
            imageUrl: station?.imageUrl,
            serverId: serverId,
            thumbHash: station?.thumbHash ?? null,
        });
    }, [play, serverId, stations]);

    const handlePlayNow = useCallback(() => {
        handlePlay();
    }, [handlePlay]);

    if (stations.length === 0) return null;

    return (
        <ContextMenu.Item leftIcon="mediaPlay" onSelect={handlePlayNow}>
            {t('player.play')}
        </ContextMenu.Item>
    );
};
