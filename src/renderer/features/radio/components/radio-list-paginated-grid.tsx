import { UseSuspenseQueryOptions } from '@tanstack/react-query';

import { api } from '/@/renderer/api';
import { useItemListPaginatedLoader } from '/@/renderer/components/item-list/helpers/item-list-paginated-loader';
import { useGridRows } from '/@/renderer/components/item-list/helpers/use-grid-rows';
import { useItemListScrollPersist } from '/@/renderer/components/item-list/helpers/use-item-list-scroll-persist';
import { ItemGridList } from '/@/renderer/components/item-list/item-grid-list/item-grid-list';
import { ItemListWithPagination } from '/@/renderer/components/item-list/item-list-pagination/item-list-pagination';
import { useItemListPagination } from '/@/renderer/components/item-list/item-list-pagination/use-item-list-pagination';
import { ItemControls, ItemListGridComponentProps } from '/@/renderer/components/item-list/types';
import { radioQueries } from '/@/renderer/features/radio/api/radio-api';
import { useGeneralSettings } from '/@/renderer/store';
import {
    LibraryItem,
    RadioListQuery,
    RadioListSort,
    SortOrder,
} from '/@/shared/types/domain-types';
import { ItemListKey } from '/@/shared/types/types';

interface InternetRadioListPaginatedGridProps extends ItemListGridComponentProps<RadioListQuery> {
    overrideControls?: Partial<ItemControls>;
}

export const RadioListPaginatedGrid = ({
    gap = 'md',
    itemsPerPage = 100,
    itemsPerRow,
    overrideControls,
    query = {
        sortBy: RadioListSort.NAME,
        sortOrder: SortOrder.ASC,
    },
    saveScrollOffset = true,
    serverId,
    size,
}: InternetRadioListPaginatedGridProps) => {
    const { currentPage, onChange } = useItemListPagination();

    const listCountQuery = radioQueries.listCount({
        query: { ...query, limit: itemsPerPage },
        serverId: serverId,
    }) as UseSuspenseQueryOptions<number, Error, number, readonly unknown[]>;

    const listQueryFn = api.controller.getInternetRadioStationList;

    const { data, pageCount, totalItemCount } = useItemListPaginatedLoader({
        currentPage,
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
    const { enableGridMultiSelect } = useGeneralSettings();

    return (
        <ItemListWithPagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onChange={onChange}
            pageCount={pageCount}
            totalItemCount={totalItemCount}
        >
            <ItemGridList
                currentPage={currentPage}
                data={data || []}
                enableDrag={false}
                enableMultiSelect={enableGridMultiSelect}
                gap={gap}
                initialTop={{
                    to: scrollOffset ?? 0,
                    type: 'offset',
                }}
                itemsPerRow={itemsPerRow}
                itemType={LibraryItem.RADIO_STATION}
                onScrollEnd={handleOnScrollEnd}
                overrideControls={overrideControls}
                rows={rows}
                size={size}
            />
        </ItemListWithPagination>
    );
};
