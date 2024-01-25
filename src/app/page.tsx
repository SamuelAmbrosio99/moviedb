'use client';
import { forwardRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import dayjs from 'dayjs';

import { useSearch } from '@/context/search';
import { Button, Input, Progress } from '@/components/ui';
import { Search } from 'lucide-react';
import { getMovies } from '@/lib/getMovies';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Movie } from '@/types';

import { useInView } from "react-intersection-observer";

interface FormData {
  search: string;
}

const schema = z.object({
  search: z.string().min(1, { message: 'Search must be at least 1 character long' }).max(10, { message: 'Search must be at most 10 characters long' }),
});

export default function Home() {
  const { ref, inView } = useInView();
  const { search: searchValue, setSearch: setSearchValue } = useSearch();
  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      search: '',
    }
  });

  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['projects', searchValue],
    queryFn: async ({ pageParam }) => {
      const moviesResult = await getMovies(searchValue, pageParam)
      return moviesResult;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage]);

  const onSubmit = async (data: FormData) => {
    setSearchValue(data.search);
  };

  useEffect(() => {
    if (searchValue) {
      setValue('search', searchValue);
    }
  }, [searchValue, setValue]);

  return (
    <main className="flex flex-col items-center sm:px-16 md:px-24 lg:px-48 sm:py-8 md:py-12 lg:py-24">
      <form onSubmit={handleSubmit(onSubmit)} className={`flex w-full ${errors.search ? 'mb-2' : 'mb-20'}`}>
        <Controller
          name="search"
          control={control}
          render={({ field }) => (
            <div className="flex flex-auto items-center">
              <Input
                {...field}
                className={`mr-3 ${errors.search ? 'border-red-500' : ''}`}
                placeholder="Movie title..."
                aria-label="Search"
                autoComplete="off"
              />
            </div>
          )}
        />
        <Button type="submit" size='icon' className="flex w-24" variant='default'>
          <Search className="w-4 h-4 mr-2" /> Search
        </Button>
      </form>
      {errors.search && (
        <div className="flex w-full mb-10">
          <p className="text-red-500">{errors.search.message}</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4" ref={ref}>
        {
          data?.pages.map((page) => 
            page?.results?.map((movie: Movie, index: number) => (
              <MovieCard {...movie} key={movie.id} ref={ref} />
            )
          ))
        }
        <p className="text-gray-500 text-center">
          {(isFetchingNextPage || isFetching) && hasNextPage ? 'Loading' : 'Nothing more to load'}
        </p>
      </div>
    </main>
  );
}

const MovieCard = forwardRef((movie: Movie, ref: any) => {
  return (
    <div key={movie.id} className="w-full p-4 border rounded shadow grid grid-cols-3 gap-4" ref={ref}>
      <div className="flex-auto flex flex-col justify-center">
        <Image
          className="rounded"
          src={`https://media.themoviedb.org/t/p/w1066_and_h600_bestv2/${movie.backdrop_path ?? movie.poster_path}`}
          alt="Poster"
          width={400}
          height={600}
          priority
        />
      </div>
      <div className="flex-auto col-span-2">
        <h2 className="text-2xl font-bold">{movie.title}</h2>
        <p className="text-gray-500">User Score</p>
        <div className="flex items-center">
          <Progress value={movie.popularity} className="w-24 mr-3" />
          <span className="text-gray-700">{movie.popularity.toFixed(0)}%</span>
        </div>
        <p className="text-gray-500">Release date</p>
        <p className="text-gray-700">{dayjs(movie.release_date).format('DD/MM/YYYY')}</p>
        <p className="text-gray-500">Overview</p>
        <p className="text-gray-700">
          {movie.overview}
        </p>
      </div>
    </div>
  );
});

MovieCard.displayName = 'MovieCard';