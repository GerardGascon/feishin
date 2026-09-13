import { UseSuspenseQueryOptions } from '@tanstack/react-query';

import { api } from '/@/renderer/api';
import { useItemListPaginatedLoader } from '/@/renderer/components/item-list/helpers/item-list-paginated-loader';
import { useItemListColumnReorder } from '/@/renderer/components/item-list/helpers/use-item-list-column-reorder';
import { useItemListColumnResize } from '/@/renderer/components/item-list/helpers/use-item-list-column-resize';
import { useItemListScrollPersist } from '/@/renderer/components/item-list/helpers/use-item-list-scroll-persist';
import { ItemListWithPagination } from '/@/renderer/components/item-list/item-list-pagination/item-list-pagination';
import { useItemListPagination } from '/@/renderer/components/item-list/item-list-pagination/use-item-list-pagination';
import { ItemTableList } from '/@/renderer/components/item-list/item-table-list/item-table-list';
import { ItemTableListColumn } from '/@/renderer/components/item-list/item-table-list/item-table-list-column';
import { ItemControls, ItemListTableComponentProps } from '/@/renderer/components/item-list/types';
import { radioQueries } from '/@/renderer/features/radio/api/radio-api';
import {
    LibraryItem,
    RadioListQuery,
    RadioListSort,
    SortOrder,
} from '/@/shared/types/domain-types';
import { ItemListKey } from '/@/shared/types/types';

interface InternetRadioListPaginatedTableProps extends ItemListTableComponentProps<RadioListQuery> {
    overrideControls?: Partial<ItemControls>;
}

export const RadioListPaginatedTable = ({
    autoFitColumns = false,
    columns,
    enableAlternateRowColors = false,
    enableHeader = true,
    enableHorizontalBorders = false,
    enableRowHoverHighlight = true,
    enableSelection = true,
    enableVerticalBorders = false,
    itemsPerPage = 100,
    overrideControls,
    query = {
        sortBy: RadioListSort.NAME,
        sortOrder: SortOrder.ASC,
    },
    saveScrollOffset = true,
    serverId,
    size = 'default',
}: InternetRadioListPaginatedTableProps) => {
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

    const { handleColumnReordered } = useItemListColumnReorder({
        itemListKey: ItemListKey.RADIO,
    });

    const { handleColumnResized } = useItemListColumnResize({
        itemListKey: ItemListKey.RADIO,
    });

    const startRowIndex = currentPage * itemsPerPage;

    return (
        <ItemListWithPagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onChange={onChange}
            pageCount={pageCount}
            totalItemCount={totalItemCount}
        >
            <ItemTableList
                autoFitColumns={autoFitColumns}
                CellComponent={ItemTableListColumn}
                columns={columns}
                data={data || []}
                enableAlternateRowColors={enableAlternateRowColors}
                enableDrag={false}
                enableExpansion={false}
                enableHeader={enableHeader}
                enableHorizontalBorders={enableHorizontalBorders}
                enableRowHoverHighlight={enableRowHoverHighlight}
                enableSelection={enableSelection}
                enableVerticalBorders={enableVerticalBorders}
                initialTop={{
                    to: scrollOffset ?? 0,
                    type: 'offset',
                }}
                itemType={LibraryItem.RADIO_STATION}
                onColumnReordered={handleColumnReordered}
                onColumnResized={handleColumnResized}
                onScrollEnd={handleOnScrollEnd}
                overrideControls={overrideControls}
                size={size}
                startRowIndex={startRowIndex}
            />
        </ItemListWithPagination>
    );
};
