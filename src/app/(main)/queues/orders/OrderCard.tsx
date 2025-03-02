import React from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Package,
  User,
  Phone,
  MapPin,
  CreditCard,
  DollarSign,
  MoreVertical,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Order } from "@/app/types/orderApi";

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "SENT":
      return "bg-green-100 text-green-800 border-t-2 border-green-800";
    case "FAILED":
      return "bg-red-100 text-red-800 border-red-800 border-t-2";
    case "QUEUED":
      return "bg-yellow-100 text-yellow-800 border-yellow-700 border-t-2";
    case "PAUSED": 
     return "bg-blue-100 text-blue-800 border-blue-800 border-t-2"
    default:
      return "bg-gray-100 text-gray-800 border-gray-800 border-t-2";
  }
};
interface OrderCardProps {
  order: Order;
  selectedOrders: number[];
  toggleOrderSelection: (orderId: number) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  selectedOrders,
  toggleOrderSelection,
}) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center">
        <Checkbox
          checked={selectedOrders.includes(order.id)}
          onCheckedChange={() => toggleOrderSelection(order.id)}
          className="mr-3"
        />
        <div>
          <div className="flex items-center">
            <Package className="h-4 w-4 text-gray-400 mr-2" />
            <span className="font-medium text-gray-900">#{order.id}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {format(new Date(order.createdAt), "MMM d, yyyy HH:mm")}
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="py-2 px-4 cursor-pointer">
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem className="py-2 px-4 cursor-pointer">
            Edit Order
          </DropdownMenuItem>
          <DropdownMenuItem className="py-2 px-4 cursor-pointer text-red-600">
            Delete Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div className="space-y-3">
      <div className="flex items-start">
        <User className="h-5 w-5 text-gray-400 mr-2 mt-1" />
        <div>
          <div className="font-medium">
            {order.userName} {order.userSurname}
          </div>
          <div className="text-sm text-gray-500">{order.companyName}</div>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <Phone className="h-4 w-4 mr-1" />
            {order.phoneNumber}
          </div>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {order.city}, {order.country}
          </div>
        </div>
      </div>

      <div className="flex items-start">
        <DollarSign className="h-5 w-5 text-gray-400 mr-2 mt-1" />
        <div>
          <div className="font-medium">{order.productNames}</div>
          <div className="text-sm text-gray-500">
            ${order.totalAmount}
          </div>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <CreditCard className="h-4 w-4 mr-1" />
            {order.paymentMethodName}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {order.jobs.map((job) => (
          <Badge
            key={job.id}
            className={`${getStatusColor(
              job.status
            )} px-2 py-1 flex items-center gap-1 text-sm`}
          >
            {job.tagName}
            {job.processedAt && <Check className="h-3 w-3" />}
          </Badge>
        ))}
      </div>

      <div className="text-xs text-gray-500 mt-2">
        <div>Sales Agent ID: {order.salesAgentId}</div>
        <div>Customer ID: {order.customerId}</div>
        <div>Product ID: {order.productIds}</div>
        <div>
          Attempts: {order.jobs.reduce((sum, job) => sum + job.attempts, 0)}
        </div>
      </div>
    </div>
  </div>
);
