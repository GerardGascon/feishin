import { UseSuspenseQueryOptions } from '@tanstack/react-query';

import { api } from '/@/renderer/api';
import { useItemListInfiniteLoader } from '/@/renderer/components/item-list/helpers/item-list-infinite-loader';
import { useItemListColumnReorder } from '/@/renderer/components/item-list/helpers/use-item-list-column-reorder';
import { useItemListColumnResize } from '/@/renderer/components/item-list/helpers/use-item-list-column-resize';
import { useItemListScrollPersist } from '/@/renderer/components/item-list/helpers/use-item-list-scroll-persist';
import { ItemTableList } from '/@/renderer/components/item-list/item-table-list/item-table-list';
import { ItemTableListColumn } from '/@/renderer/components/item-list/item-table-list/item-table-list-column';
import { ItemListTableComponentProps } from '/@/renderer/components/item-list/types';
import { radioQueries } from '/@/renderer/features/radio/api/radio-api';
import {
    InternetRadioListQuery,
    LibraryItem,
    RadioListSort,
    SortOrder,
} from '/@/shared/types/domain-types';
import { ItemListKey } from '/@/shared/types/types';

interface InternetRadioListInfiniteTableProps extends ItemListTableComponentProps<InternetRadioListQuery> {}

export const InternetRadioListInfiniteTable = ({
    autoFitColumns = false,
    columns,
    enableAlternateRowColors = false,
    enableHeader = true,
    enableHorizontalBorders = false,
    enableRowHoverHighlight = true,
    enableVerticalBorders = false,
    itemsPerPage = 100,
    query = {
        sortBy: RadioListSort.NAME,
        sortOrder: SortOrder.ASC,
    },
    saveScrollOffset = true,
    serverId,
    size = 'default',
}: InternetRadioListInfiniteTableProps) => {
    const listCountQuery = radioQueries.listCount({
        query: { ...query },
        serverId: serverId,
    }) as UseSuspenseQueryOptions<number, Error, number, readonly unknown[]>;

    const listQueryFn = api.controller.getInternetRadioStations;

    const { getItem, getItemIndex, getLoadedItems, itemCount, loadedItems, onRangeChanged } =
        useItemListInfiniteLoader({
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

    const { handleColumnReordered } = useItemListColumnReorder({
        itemListKey: ItemListKey.RADIO,
    });

    const { handleColumnResized } = useItemListColumnResize({
        itemListKey: ItemListKey.RADIO,
    });

    return (
        <ItemTableList
            autoFitColumns={autoFitColumns}
            CellComponent={ItemTableListColumn}
            columns={columns}
            data={loadedItems}
            enableAlternateRowColors={enableAlternateRowColors}
            enableExpansion={false}
            enableHeader={enableHeader}
            enableHorizontalBorders={enableHorizontalBorders}
            enableRowHoverHighlight={enableRowHoverHighlight}
            enableSelection={false}
            enableVerticalBorders={enableVerticalBorders}
            getItem={getItem}
            getItemIndex={getItemIndex}
            getLoadedItems={getLoadedItems}
            initialTop={{
                to: scrollOffset ?? 0,
                type: 'offset',
            }}
            itemCount={itemCount}
            itemType={LibraryItem.RADIO_STATION}
            onColumnReordered={handleColumnReordered}
            onColumnResized={handleColumnResized}
            onRangeChanged={onRangeChanged}
            onScrollEnd={handleOnScrollEnd}
            size={size}
        />
    );
};
