import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { RADIO_TABLE_COLUMNS } from '/@/renderer/components/item-list/item-table-list/default-columns';
import { openCreateRadioStationModal } from '/@/renderer/features/radio/components/create-radio-station-form';
import { ListConfigMenu } from '/@/renderer/features/shared/components/list-config-menu';
import { ListDisplayTypeToggleButton } from '/@/renderer/features/shared/components/list-display-type-toggle-button';
import { ListRefreshButton } from '/@/renderer/features/shared/components/list-refresh-button';
import { ListSortByDropdown } from '/@/renderer/features/shared/components/list-sort-by-dropdown';
import { ListSortOrderToggleButton } from '/@/renderer/features/shared/components/list-sort-order-toggle-button';
import { useCurrentServer, usePermissions } from '/@/renderer/store';
import { Button } from '/@/shared/components/button/button';
import { Divider } from '/@/shared/components/divider/divider';
import { Flex } from '/@/shared/components/flex/flex';
import { Group } from '/@/shared/components/group/group';
import { LibraryItem, RadioListSort, SortOrder } from '/@/shared/types/domain-types';
import { ItemListKey } from '/@/shared/types/types';

export const RadioListHeaderFilters = () => {
    const { t } = useTranslation();
    const server = useCurrentServer();
    const permissions = usePermissions();

    const handleCreateRadioStationModal = (e: MouseEvent<HTMLButtonElement>) => {
        openCreateRadioStationModal(server, e);
    };

    return (
        <Flex justify="space-between">
            <Group gap="sm" w="100%">
                <ListSortByDropdown
                    defaultSortByValue={RadioListSort.NAME}
                    itemType={LibraryItem.RADIO_STATION}
                    listKey={ItemListKey.RADIO}
                />
                <Divider orientation="vertical" />
                <ListSortOrderToggleButton
                    defaultSortOrder={SortOrder.ASC}
                    listKey={ItemListKey.RADIO}
                />
                <ListRefreshButton listKey={ItemListKey.RADIO} />
            </Group>
            <Group gap="sm" wrap="nowrap">
                {permissions.radio.create && (
                    <Button onClick={handleCreateRadioStationModal} variant="subtle">
                        {t('action.createRadioStation')}
                    </Button>
                )}
                <ListDisplayTypeToggleButton listKey={ItemListKey.RADIO} />
                <ListConfigMenu
                    listKey={ItemListKey.RADIO}
                    tableColumnsData={RADIO_TABLE_COLUMNS}
                />
            </Group>
        </Flex>
    );
};
