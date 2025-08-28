import { useState, useEffect } from 'react';

interface UseLoadingState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

export const useLoading = <T,>(asyncFunc: () => Promise<T>): UseLoadingState<T> => {
  const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
        const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Definimos uma função assíncrona para que possamos usar await
    const loadData = async () => {
      try {
            setLoading(true);
        const result = await asyncFunc();
        setData(result);
      } catch (err) {
            setError(err instanceof Error ? err : new Error('Ocorreu um erro desconhecido'));
      } finally {
            setLoading(false);
      }
    };

        loadData();
  }, [asyncFunc]); // O hook será re-executado se a função da API mudar

        return {data, loading, error};
};