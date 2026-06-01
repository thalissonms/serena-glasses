import { OrderStatusType } from "./ordersStatus.type";

export interface OrderInterface {
  id: string;
  order_number: string;
  full_name: string;
  total: number | null;
  status: OrderStatusType;
  created_at: string;
  payment_method: string;
  email: string;
}
