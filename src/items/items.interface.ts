export interface Item {
  id?: number;
  alt_id?: string;
  name: string;
  description: string;
  unit_price: number;
  created_by?: string;
  created_at?: Date;
  last_update?: Date;
  last_changed_by?: string;
}
