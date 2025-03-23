export interface Person {
  id?: number;
  alt_id?: string;
  name: string;
  email: string;
  created_by?: string;
  created_at?: Date;
  last_update?: Date;
  last_changed_by?: string;
}
