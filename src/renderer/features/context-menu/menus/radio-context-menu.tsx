import { useMemo } from 'react';

import { DeleteRadioAction } from '/@/renderer/features/context-menu/actions/delete-radio-action';
import { EditRadioAction } from '/@/renderer/features/context-menu/actions/edit-radio-action';
import { GetInfoAction } from '/@/renderer/features/context-menu/actions/get-info-action';
import { PlayRadioAction } from '/@/renderer/features/context-menu/actions/play-radio-action';
import { ContextMenuPreview } from '/@/renderer/features/context-menu/components/context-menu-preview';
import { usePermissions } from '/@/renderer/store';
import { ContextMenu } from '/@/shared/components/context-menu/context-menu';
import { InternetRadioStation, LibraryItem } from '/@/shared/types/domain-types';

interface InternetRadioContextMenuProps {
    items: InternetRadioStation[];
    type: LibraryItem.RADIO_STATION;
}

export const InternetRadioContextMenu = ({ items, type }: InternetRadioContextMenuProps) => {
    const { ids } = useMemo(() => {
        const ids = items.map((item) => item.id);
        return { ids };
    }, [items]);

    const { ...permissions } = usePermissions();

    const canEditRadio = permissions.radio.edit;
    const canDeletePlaylist = permissions.radio.delete;

    return (
        <ContextMenu.Content
            bottomStickyContent={<ContextMenuPreview items={items} itemType={type} />}
        >
            <PlayRadioAction ids={ids} itemType={LibraryItem.RADIO_STATION} radio={items[0]} />
            <ContextMenu.Divider />
            <EditRadioAction disabled={!canEditRadio} items={items} />
            <DeleteRadioAction disabled={!canDeletePlaylist} items={items} />
            <ContextMenu.Divider />
            <GetInfoAction disabled={items.length === 0} items={items} />
        </ContextMenu.Content>
    );
};
