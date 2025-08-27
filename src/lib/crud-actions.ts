import { supabase } from "@/lib/supabase/client";

export const crudActions = {
  getAll: async <T>(table: string): Promise<T[] | null> => {
    try {
      const { data, error } = await supabase.from(table).select("*");
      if (error) throw new Error(error.message);
      return data as T[];
    } catch (error) {
      console.error(`getAll error on ${table}:`, error);
      return null;
    }
  },

  getById: async <T>(table: string, id: string): Promise<T | null> => {
    try {
      const { data, error } = await supabase.from(table).select("*").eq("id", id).limit(1);
      if (error) throw new Error(error.message);
      return data as T;
    } catch (error) {
      console.error(`getById error on ${table}:`, error);
      return null;
    }
  },

  add: async <T>(table: string, payload: T): Promise<T[] | null> => {
    try {
      const { data, error } = await supabase.from(table).insert([payload]);
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error(`add error on ${table}:`, error);
      return null;
    }
  },

  update: async <T>(table: string, id: string, payload: Partial<T>): Promise<T[] | null> => {
    try {
      const { data, error } = await supabase.from(table).update(payload).eq("id", id);
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error(`update error on ${table}:`, error);
      return null;
    }
  },

  remove: async (table: string, id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw new Error(error.message);
      return true;
    } catch (error) {
      console.error(`delete error on ${table}:`, error);
      return false;
    }
  },
};
