import { queryOptions } from '@tanstack/react-query';

import { api } from '/@/renderer/api';
import { controller } from '/@/renderer/api/controller';
import { queryKeys } from '/@/renderer/api/query-keys';
import { getOptimizedListCount } from '/@/renderer/api/utils-list-count';
import { QueryHookArgs } from '/@/renderer/lib/react-query';
import { ListCountQuery, RadioListQuery } from '/@/shared/types/domain-types';

export const radioQueries = {
    list: (args: QueryHookArgs<RadioListQuery>) => {
        return queryOptions({
            queryFn: ({ signal }) => {
                return api.controller.getInternetRadioStationList({
                    apiClientProps: { serverId: args.serverId, signal },
                    query: args.query,
                });
            },
            queryKey: queryKeys.radio.list(args.serverId, args.query),
            ...args.options,
        });
    },
    listCount: (args: QueryHookArgs<ListCountQuery<RadioListQuery>>) => {
        return queryOptions({
            gcTime: 1000 * 60 * 60,
            queryFn: async ({ client, signal }) => {
                const optimizedCount = await getOptimizedListCount<
                    ListCountQuery<RadioListQuery>,
                    RadioListQuery,
                    { totalRecordCount: null | number }
                >({
                    client,
                    listQueryFn: controller.getInternetRadioStationList,
                    listQueryKeyFn: queryKeys.radio.list,
                    query: args.query,
                    serverId: args.serverId,
                    signal,
                });

                if (optimizedCount !== null) {
                    return optimizedCount;
                }

                return api.controller.getInternetRadioStationListCount({
                    apiClientProps: { serverId: args.serverId, signal },
                    query: args.query,
                });
            },
            queryKey: queryKeys.radio.count(
                args.serverId,
                Object.keys(args.query).length === 0 ? undefined : args.query,
            ),
            staleTime: 1000 * 60 * 60,
            ...args.options,
        });
    },
};
