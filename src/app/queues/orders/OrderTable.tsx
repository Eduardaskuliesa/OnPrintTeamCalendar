import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  User,
  Calendar,
  Phone,
  MapPin,
  CreditCard,
  DollarSign,
  Settings2,
  Check,
  Tag,
} from "lucide-react";
import { format } from "date-fns";
import { Order } from "@/app/types/orderApi";
import { getStatusColor } from "./OrderCard";
import { Button } from "@/components/ui/button";
import OrderActions from "./OrderActions";

interface OrdersTableProps {
  orders: Order[];
  selectedOrders: number[];
  toggleOrderSelection: (orderId: number) => void;
  toggleAllOrders: () => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  selectedOrders,
  toggleOrderSelection,
  toggleAllOrders,
}) => (
  <Table className="w-full ">
    <TableHeader className="bg-lcoffe sticky top-0 z-10">
      <TableRow>
        <TableHead className="w-12 py-3 px-4 rounded-tl-lg">
          <Checkbox
            checked={selectedOrders.length === orders?.length}
            onCheckedChange={toggleAllOrders}
          />
        </TableHead>
        <TableHead className="py-3 px-4 border-x">
          <div className="flex items-center gap-2 text-db">
            <Package className="h-4 w-4" />
            Order ID
          </div>
        </TableHead>
        <TableHead className="py-3 px-4 border-x">
          <div className="flex items-center gap-2 text-db">
            <Calendar className="h-4 w-4" />
            Order Date
          </div>
        </TableHead>
        <TableHead className="py-3 border-x px-4">
          <div className="flex items-center gap-2 text-db">
            <User className="h-4 w-4" />
            Customer Info
          </div>
        </TableHead>
        <TableHead className="py-3 border-x px-4">
          <div className="flex items-center gap-2 text-db">
            <DollarSign className="h-4 w-4" />
            Product & Payment
          </div>
        </TableHead>
        <TableHead className="py-3 border-x px-4">
          <div className="flex items-center gap-2 text-db">
            <Tag className="h-4 w-4" />
            Status Tags
          </div>
        </TableHead>
        <TableHead className="w-32 py-3 px-4 rounded-tr-lg">
          <div className="flex items-center gap-2 text-db">
            <Settings2 className="h-4 w-4" />
            Actions
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {orders?.map((order, index) => (
        <React.Fragment key={order.id}>
          <TableRow className="border-t border-b border-gray-200">
            <TableCell className="py-4" rowSpan={2}>
              <Checkbox
                checked={selectedOrders.includes(order.id)}
                onCheckedChange={() => toggleOrderSelection(order.id)}
              />
            </TableCell>
            <TableCell className="py-4 border-x">
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <Package className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="font-bold text-gray-900">#{order.id}</span>
                </div>
                <div className="text-gray-900">
                  Customer ID: {order.customerId}
                </div>
              </div>
            </TableCell>
            <TableCell className="py-4 border-x">
              <div className="text-sm text-gray-500">
                Created:{" "}
                {format(new Date(order.createdAt), "MMM d, yyyy HH:mm")}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Updated:{" "}
                {format(new Date(order.updatedAt), "MMM d, yyyy HH:mm")}
              </div>
            </TableCell>
            <TableCell className="py-4 border-x">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {order.userName} {order.userSurname}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.companyName}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell className="py-4 border-x">
              <div className="text-sm font-medium text-gray-900">
                {order.productName}
              </div>
              <div className="text-sm text-gray-500 flex items-center mt-1">
                <DollarSign className="h-4 w-4 mr-1" />
                {order.subTotal.toFixed(2)}
              </div>
            </TableCell>
            <TableCell className="border-x">
              <div className="flex flex-wrap gap-1">
                {order.jobs.map((job) => (
                  <Badge
                    key={job.id}
                    className={`${getStatusColor(
                      job.status
                    )} px-2 py-1 flex items-center gap-1`}
                  >
                    {job.tagName}
                    {job.processedAt && <Check className="h-3 w-3" />}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell className="py-2 flex flex-col gap-2" rowSpan={2}>
              <OrderActions order={order}></OrderActions>
              <Button variant="outline">Full info</Button>
            </TableCell>
          </TableRow>
          <TableRow className="bg-gray-50 border-b">
            <TableCell className="py-2 text-xs border-x">
              <div className="text-gray-500">
                Sales Agent ID: {order.salesAgentId}
              </div>
            </TableCell>
            <TableCell className="py-2 text-xs border-x">
              <div className="text-gray-500 flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {order.city}, {order.country}
              </div>
            </TableCell>
            <TableCell className="py-2 text-xs border-x">
              <div className="text-gray-500 flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                {order.phoneNumber}
              </div>
            </TableCell>
            <TableCell className="py-2 text-xs border-x">
              <div className="text-gray-500 flex items-center">
                <CreditCard className="h-4 w-4 mr-1" />
                {order.paymentDetails}
              </div>
            </TableCell>
            <TableCell className="py-2 text-xs border-x">
              <div className="text-gray-500">Product ID: {order.productId}</div>
            </TableCell>
          </TableRow>
          {index < orders.length - 1 && (
            <TableRow>
              <TableCell colSpan={7} className="h-4 bg-[#fefaf6]" />
            </TableRow>
          )}
        </React.Fragment>
      ))}
    </TableBody>
  </Table>
);
