import { useMemo } from 'react';

import { useSearchTermFilter } from '/@/renderer/features/shared/hooks/use-search-term-filter';
import { useSortByFilter } from '/@/renderer/features/shared/hooks/use-sort-by-filter';
import { useSortOrderFilter } from '/@/renderer/features/shared/hooks/use-sort-order-filter';
import { RadioListSort } from '/@/shared/types/domain-types';
import { ItemListKey } from '/@/shared/types/types';

export const useRadioListFilters = () => {
    const { sortBy } = useSortByFilter<RadioListSort>(RadioListSort.NAME, ItemListKey.RADIO);

    const { sortOrder } = useSortOrderFilter(null, ItemListKey.RADIO);

    const { searchTerm, setSearchTerm } = useSearchTermFilter('');

    const query = useMemo(
        () => ({
            searchTerm: searchTerm ?? undefined,
            sortBy: sortBy ?? undefined,
            sortOrder: sortOrder ?? undefined,
        }),
        [searchTerm, sortBy, sortOrder],
    );

    return {
        query,
        setSearchTerm,
    };
};
