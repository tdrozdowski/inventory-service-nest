export interface Invoice {
  id?: number;
  alt_id?: string;
  total: number;
  paid?: boolean;
  user_id: string;
  created_by?: string;
  created_at?: Date;
  last_update?: Date;
  last_changed_by?: string;
}
