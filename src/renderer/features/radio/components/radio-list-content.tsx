import { lazy, Suspense, useMemo } from 'react';

import { DefaultItemControlProps, ItemControls } from '/@/renderer/components/item-list/types';
import { useRadioListFilters } from '/@/renderer/features/radio/hooks/use-radio-list-filters';
import { useRadioControls } from '/@/renderer/features/radio/hooks/use-radio-player';
import { ItemListSettings, useCurrentServer, useListSettings } from '/@/renderer/store';
import { Spinner } from '/@/shared/components/spinner/spinner';
import { InternetRadioStation, RadioListQuery } from '/@/shared/types/domain-types';
import { ItemListKey, ListDisplayType, ListPaginationType, Play } from '/@/shared/types/types';

const RadioListInfiniteGrid = lazy(() =>
    import('/@/renderer/features/radio/components/radio-list-infinite-grid').then((module) => ({
        default: module.RadioListInfiniteGrid,
    })),
);

const RadioListPaginatedGrid = lazy(() =>
    import('/@/renderer/features/radio/components/radio-list-paginated-grid').then((module) => ({
        default: module.RadioListPaginatedGrid,
    })),
);

const RadioListInfiniteTable = lazy(() =>
    import('/@/renderer/features/radio/components/radio-list-infinite-table').then((module) => ({
        default: module.RadioListInfiniteTable,
    })),
);

const RadioListPaginatedTable = lazy(() =>
    import('/@/renderer/features/radio/components/radio-list-paginated-table').then((module) => ({
        default: module.RadioListPaginatedTable,
    })),
);

export type OverrideRadioListQuery = Omit<RadioListQuery, 'limit' | 'startIndex'>;

export const RadioListContent = () => {
    const { display, grid, itemsPerPage, pagination, table } = useListSettings(ItemListKey.RADIO);

    return (
        <Suspense fallback={<Spinner container />}>
            <RadioListView
                display={display}
                grid={grid}
                itemsPerPage={itemsPerPage}
                pagination={pagination}
                table={table}
            />
        </Suspense>
    );
};

export const RadioListView = ({
    display,
    grid,
    itemsPerPage,
    overrideQuery,
    pagination,
    table,
}: ItemListSettings & { overrideQuery?: OverrideRadioListQuery }) => {
    const server = useCurrentServer();

    const { query } = useRadioListFilters();

    const { play } = useRadioControls();

    const radioControlOverrides = useMemo<Partial<ItemControls>>(() => {
        return {
            onClick: undefined,
            onDoubleClick: ({ item }) => {
                if (!item) return;

                const station = item as InternetRadioStation;
                play(station.streamUrl, station.name, {
                    id: station.id,
                    imageId: station.imageId,
                    imageUrl: station.imageUrl,
                    serverId: server.id,
                    thumbHash: station.thumbHash ?? null,
                });
            },
            onFavorite: undefined,
            onPlay: ({ item }: DefaultItemControlProps & { playType: Play }) => {
                if (!item) return;

                const station = item as InternetRadioStation;
                play(station.streamUrl, station.name, {
                    id: station.id,
                    imageId: station.imageId,
                    imageUrl: station.imageUrl,
                    serverId: server.id,
                    thumbHash: station.thumbHash ?? null,
                });
            },
            onRating: undefined,
        };
    }, [play, server]);

    const mergedQuery = useMemo(() => {
        if (!overrideQuery) {
            return query;
        }

        return {
            ...query,
            ...overrideQuery,
            sortBy: overrideQuery.sortBy || query.sortBy,
            sortOrder: overrideQuery.sortOrder || query.sortOrder,
        };
    }, [query, overrideQuery]);

    switch (display) {
        case ListDisplayType.GRID: {
            switch (pagination) {
                case ListPaginationType.INFINITE: {
                    return (
                        <RadioListInfiniteGrid
                            gap={grid.itemGap}
                            itemsPerPage={itemsPerPage}
                            itemsPerRow={grid.itemsPerRowEnabled ? grid.itemsPerRow : undefined}
                            overrideControls={radioControlOverrides}
                            query={mergedQuery}
                            serverId={server.id}
                            size={grid.size}
                        />
                    );
                }
                case ListPaginationType.PAGINATED: {
                    return (
                        <RadioListPaginatedGrid
                            gap={grid.itemGap}
                            itemsPerPage={itemsPerPage}
                            itemsPerRow={grid.itemsPerRowEnabled ? grid.itemsPerRow : undefined}
                            overrideControls={radioControlOverrides}
                            query={mergedQuery}
                            serverId={server.id}
                            size={grid.size}
                        />
                    );
                }
                default:
                    return null;
            }
        }
        case ListDisplayType.TABLE: {
            switch (pagination) {
                case ListPaginationType.INFINITE: {
                    return (
                        <RadioListInfiniteTable
                            autoFitColumns={table.autoFitColumns}
                            columns={table.columns}
                            enableAlternateRowColors={table.enableAlternateRowColors}
                            enableHeader={table.enableHeader}
                            enableHorizontalBorders={table.enableHorizontalBorders}
                            enableRowHoverHighlight={table.enableRowHoverHighlight}
                            enableVerticalBorders={table.enableVerticalBorders}
                            itemsPerPage={itemsPerPage}
                            overrideControls={radioControlOverrides}
                            query={mergedQuery}
                            serverId={server.id}
                            size={table.size}
                        />
                    );
                }
                case ListPaginationType.PAGINATED: {
                    return (
                        <RadioListPaginatedTable
                            autoFitColumns={table.autoFitColumns}
                            columns={table.columns}
                            enableAlternateRowColors={table.enableAlternateRowColors}
                            enableHeader={table.enableHeader}
                            enableHorizontalBorders={table.enableHorizontalBorders}
                            enableRowHoverHighlight={table.enableRowHoverHighlight}
                            enableVerticalBorders={table.enableVerticalBorders}
                            itemsPerPage={itemsPerPage}
                            overrideControls={radioControlOverrides}
                            query={mergedQuery}
                            serverId={server.id}
                            size={table.size}
                        />
                    );
                }
                default:
                    return null;
            }
        }
    }

    return null;
};
