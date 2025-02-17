import { Order } from "@/app/types/orderApi";

interface OrderDetailsProps {
  order: Order;
}

export const OrderDetails = ({ order }: OrderDetailsProps) => {
  return (
    <div className="text-xs text-gray-500 mt-2">
      <div>Sales Agent ID: {order.salesAgentId}</div>
      <div>Customer ID: {order.customerId}</div>
      <div>Product ID: {order.productId}</div>
      <div>
        Attempts: {order.jobs.reduce((sum, job) => sum + job.attempts, 0)}
      </div>
    </div>
  );
};
