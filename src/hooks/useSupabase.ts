import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

// Generic hook for fetching data
export function useSupabaseQuery<T>(
  table: string,
  options?: {
    select?: string;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    filter?: { column: string; value: any };
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchData();
  }, [table]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let query = supabase.from(table).select(options?.select || '*');

      if (options?.filter) {
        query = query.eq(options.filter.column, options.filter.value);
      }

      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true,
        });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data: result, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setData((result as T[]) || []);
      setError(null);
    } catch (err) {
      setError(err as Error);
      toast.error('Gagal memuat data');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}

// Hook for vessels
export function useVessels() {
  return useSupabaseQuery<any>('vessels', {
    orderBy: { column: 'name', ascending: true },
  });
}

// Hook for crew
export function useCrew(vesselId?: string) {
  return useSupabaseQuery<any>('crew', {
    orderBy: { column: 'name', ascending: true },
    filter: vesselId ? { column: 'vessel_id', value: vesselId } : undefined,
  });
}

// Hook for documents
export function useDocuments(vesselId?: string) {
  return useSupabaseQuery<any>('documents', {
    orderBy: { column: 'expiry_date', ascending: true },
    filter: vesselId ? { column: 'vessel_id', value: vesselId } : undefined,
  });
}

// Hook for rotations
export function useRotations() {
  return useSupabaseQuery<any>('rotations', {
    orderBy: { column: 'sign_on_date', ascending: false },
  });
}

// Hook for MLC logs
export function useMLCLogs(crewId?: string) {
  return useSupabaseQuery<any>('mlc_logs', {
    orderBy: { column: 'log_date', ascending: false },
    filter: crewId ? { column: 'crew_id', value: crewId } : undefined,
    limit: 30,
  });
}

// Hook for incidents
export function useIncidents(vesselId?: string) {
  return useSupabaseQuery<any>('incidents', {
    orderBy: { column: 'incident_date', ascending: false },
    filter: vesselId ? { column: 'vessel_id', value: vesselId } : undefined,
  });
}

// Hook for voyages
export function useVoyages(vesselId?: string) {
  return useSupabaseQuery<any>('voyages', {
    orderBy: { column: 'etd', ascending: false },
    filter: vesselId ? { column: 'vessel_id', value: vesselId } : undefined,
  });
}

// Hook for real-time subscriptions
export function useRealtimeSubscription(
  table: string,
  callback: () => void
) {
  useEffect(() => {
    const channel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        () => {
          callback();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, callback]);
}

// Hook for file upload
export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = async (file: File, path: string) => {
    setUploading(true);
    setProgress(0);

    try {
      const { data, error } = await supabase.storage
        .from('las-documents')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      setProgress(100);
      toast.success('File berhasil diupload');

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('las-documents')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Gagal mengupload file');
      throw error;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return { upload, uploading, progress };
}
