export interface Invoice {
  id?: string;
  alt_id?: string;
  total: number;
  paid?: boolean;
  user_id: string;
  created_by?: string;
  created_at?: Date;
  last_update?: Date;
  last_changed_by?: string;
}
