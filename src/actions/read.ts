import type { IReadItem } from 'src/types/read';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, fetcher2, endpoints, axiosInstance2 } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type ReadsData = {
  reads: IReadItem[];
};

// ----------------------------------------------------------------------

export async function AddRead(read: any) {
  try {
    const response = await axiosInstance2.post(endpoints.read.list, read);
    console.log('Post Response:', response.data);
  } catch (error) {
    console.error('Failed to make POST request:', error);
  }
}

// ----------------------------------------------------------------------

export async function UpdateRead(readId: string, read: any) {
  try {
    const response = await axiosInstance2.patch(`${endpoints.read.list}/${readId}`, read);
    console.log('Update Response:', response.data);
  } catch (error) {
    console.error('Failed to make PATCH request:', error);
  }
}

// ----------------------------------------------------------------------

export async function DeleteRead(readId: string) {
  try {
    const response = await axiosInstance2.delete(`${endpoints.read.list}/${readId}`);
    console.log('Delete Response:', response.data);
  } catch (error) {
    console.error('Failed to make DELETE request:', error);
  }
}

export function useGetReads() {
  const url = endpoints.read.list;

  const { data, isLoading, error, isValidating } = useSWR<ReadsData>(url, fetcher2, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      reads: data?.reads || [],
      readsLoading: isLoading,
      readsError: error,
      readsValidating: isValidating,
      readsEmpty: !isLoading && !data?.reads.length,
    }),
    [data?.reads, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type ReadData = {
  read: IReadItem;
};

export function useGetRead(readId: string) {
  const url = readId ? [endpoints.product.details, { params: { readId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<ReadData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      read: data?.read,
      readLoading: isLoading,
      readError: error,
      readValidating: isValidating,
    }),
    [data?.read, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type SearchResultsData = {
  results: IReadItem[];
};

export function useSearchReads(query: string) {
  const url = query ? [endpoints.product.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<SearchResultsData>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}
