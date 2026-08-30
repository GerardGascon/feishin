import { queryOptions } from '@tanstack/react-query';

import { api } from '/@/renderer/api';
import { queryKeys } from '/@/renderer/api/query-keys';
import { QueryHookArgs } from '/@/renderer/lib/react-query';
import { InternetRadioListQuery, ListCountQuery } from '/@/shared/types/domain-types';

export const radioQueries = {
    list: (args: QueryHookArgs<InternetRadioListQuery>) => {
        return queryOptions({
            gcTime: 1000 * 60 * 60,
            queryFn: ({ signal }) => {
                return api.controller.getInternetRadioStations({
                    apiClientProps: { serverId: args.serverId, signal },
                    query: args.query,
                });
            },
            queryKey: queryKeys.radio.list(args.serverId || ''),
            ...args.options,
        });
    },
    listCount: (args: QueryHookArgs<ListCountQuery<InternetRadioListQuery>>) => {
        return queryOptions({
            gcTime: 1000 * 60 * 60,
            queryFn: ({ signal }) => {
                return api.controller.getInternetRadioStationsCount({
                    apiClientProps: { serverId: args.serverId, signal },
                    query: args.query,
                });
            },
            queryKey: queryKeys.playlists.count(
                args.serverId || '',
                Object.keys(args.query).length === 0 ? undefined : args.query,
            ),
            staleTime: 1000 * 60 * 60,
            ...args.options,
        });
    },
};
