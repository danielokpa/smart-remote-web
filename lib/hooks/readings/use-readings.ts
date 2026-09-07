"use client";

import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { readingsApi } from "@/lib/api/readings/readings";

import type {
  HealthReading,
  ReadingDetail,
  GetReadingsParams,
  ReadingListItem,
} from "@/lib/types/readings/readings";


/* -------------------------------------------------------------------------- */
/* Query keys                                                                 */
/* -------------------------------------------------------------------------- */

export const readingKeys = {
  all: ["readings"] as const,

  lists: () =>
    [...readingKeys.all, "list"] as const,

  list: (params?: GetReadingsParams) =>
    [
      ...readingKeys.lists(),
      params ?? {},
    ] as const,

  details: () =>
    [...readingKeys.all, "detail"] as const,

  detail: (id: string) =>
    [
      ...readingKeys.details(),
      id,
    ] as const,
};

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const DEFAULT_LIMIT = 20;

const READING_DETAIL_STALE_TIME =
  30 * 1000;

/* -------------------------------------------------------------------------- */
/* List hook                                                                  */
/* -------------------------------------------------------------------------- */

interface UseReadingsOptions
  extends Omit<GetReadingsParams, "cursor"> {
  enabled?: boolean;
}

export function useReadings(
  options: UseReadingsOptions = {}
) {
  const {
    patientId,
    limit = DEFAULT_LIMIT,
    search,
    enabled = true,
  } = options;

  const query = useInfiniteQuery({
    queryKey: readingKeys.list({
      patientId,
      limit,
      search,
    }),

    initialPageParam:
      undefined as string | undefined,

    queryFn: ({ pageParam }) =>
      readingsApi.list({
        patientId,
        limit,
        search,
        cursor: pageParam,
      }),

    getNextPageParam: (
      lastPage
    ) => {
      if (
        !lastPage.pagination.hasNextPage
      ) {
        return undefined;
      }

      return (
        lastPage.pagination.nextCursor ??
        undefined
      );
    },

    enabled,

    staleTime: 15 * 1000,

    refetchOnWindowFocus: true,
  });

  const readings: ReadingListItem[] =
    query.data?.pages.flatMap(
      (page) => page.items
    ) ?? [];

  const latestPage =
    query.data?.pages[
      query.data.pages.length - 1
    ];

  return {
    readings,

    pages: query.data?.pages ?? [],

    isLoading: query.isLoading,

    isFetching: query.isFetching,

    isFetchingNextPage:
      query.isFetchingNextPage,

    hasNextPage:
      query.hasNextPage,

    fetchNextPage:
      query.fetchNextPage,

    refetch:
      query.refetch,

    isError:
      query.isError,

    error:
      query.error,

    isSuccess:
      query.isSuccess,

    pagination:
      latestPage?.pagination ?? null,
  };
}

/* -------------------------------------------------------------------------- */
/* Detail hook                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Retrieve a single health reading by ID.
 *
 * GET /readings/:id
 */
export function useReading(
  id: string | undefined
) {
  const query = useQuery<
    ReadingDetail,
    Error
  >({
    queryKey: id
      ? readingKeys.detail(id)
      : readingKeys.details(),

    queryFn: () => {
      if (!id) {
        throw new Error(
          "Reading ID is required."
        );
      }

      return readingsApi.getById(id);
    },

    enabled: Boolean(id),

    staleTime:
      READING_DETAIL_STALE_TIME,

    refetchOnWindowFocus: true,
  });

  return {
    reading: query.data ?? null,

    isLoading:
      query.isLoading,

    isFetching:
      query.isFetching,

    isError:
      query.isError,

    error:
      query.error,

    isSuccess:
      query.isSuccess,

    refetch:
      query.refetch,
  };
}

/* -------------------------------------------------------------------------- */
/* Optional create mutation                                                   */
/* -------------------------------------------------------------------------- */

// export function useCreateHealthReading() {
//   const queryClient =
//     useQueryClient();

//   const mutation =
//     useMutationPlaceholder();
  
//   return mutation;
// }