import { UseSuspenseQueryOptions } from '@tanstack/react-query';

import { api } from '/@/renderer/api';
import { useItemListInfiniteLoader } from '/@/renderer/components/item-list/helpers/item-list-infinite-loader';
import { useGridRows } from '/@/renderer/components/item-list/helpers/use-grid-rows';
import { useItemListScrollPersist } from '/@/renderer/components/item-list/helpers/use-item-list-scroll-persist';
import { ItemGridList } from '/@/renderer/components/item-list/item-grid-list/item-grid-list';
import { ItemControls, ItemListGridComponentProps } from '/@/renderer/components/item-list/types';
import { radioQueries } from '/@/renderer/features/radio/api/radio-api';
import {
    InternetRadioListQuery,
    LibraryItem,
    RadioListSort,
    SortOrder,
} from '/@/shared/types/domain-types';
import { ItemListKey } from '/@/shared/types/types';

export type RadioItemControls = Omit<ItemControls, 'onFavorite' | 'onMore' | 'onPlay' | 'onRating'>;

interface InternetRadioListInfiniteGridProps extends ItemListGridComponentProps<InternetRadioListQuery> {}

export const InternetRadioListInfiniteGrid = ({
    gap = 'md',
    itemsPerPage = 100,
    itemsPerRow,
    query = {
        sortBy: RadioListSort.NAME,
        sortOrder: SortOrder.ASC,
    },
    saveScrollOffset = true,
    serverId,
    size,
}: InternetRadioListInfiniteGridProps) => {
    const listCountQuery = radioQueries.listCount({
        query: { ...query },
        serverId: serverId,
    }) as UseSuspenseQueryOptions<number, Error, number, readonly unknown[]>;

    const listQueryFn = api.controller.getInternetRadioStations;

    const {
        dataVersion,
        getItem,
        getItemIndex,
        getLoadedItems,
        itemCount,
        loadedItems,
        onRangeChanged,
    } = useItemListInfiniteLoader({
        eventKey: ItemListKey.RADIO,
        itemsPerPage,
        itemType: LibraryItem.RADIO_STATION,
        listCountQuery,
        listQueryFn,
        query,
        serverId,
    });

    const { handleOnScrollEnd, scrollOffset } = useItemListScrollPersist({
        enabled: saveScrollOffset,
    });

    const rows = useGridRows(LibraryItem.RADIO_STATION, ItemListKey.RADIO, size);

    return (
        <ItemGridList
            data={loadedItems}
            dataVersion={dataVersion}
            enableSelection={false}
            gap={gap}
            getItem={getItem}
            getItemIndex={getItemIndex}
            getLoadedItems={getLoadedItems}
            initialTop={{
                to: scrollOffset ?? 0,
                type: 'offset',
            }}
            itemCount={itemCount}
            itemsPerRow={itemsPerRow}
            itemType={LibraryItem.RADIO_STATION}
            onRangeChanged={onRangeChanged}
            onScrollEnd={handleOnScrollEnd}
            // overrideControls={RadioItemControls}
            rows={rows}
            size={size}
        />
    );
};
