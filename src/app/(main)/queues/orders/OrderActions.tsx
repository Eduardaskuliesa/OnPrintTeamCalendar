import { ordersActions } from "@/app/lib/actions/orders";
import { Order } from "@/app/types/orderApi";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import {
  MoreVertical,
  Pause,
  Play,
  ArrowDownToLine,
  ArrowUpToLine,
  Trash2,
  Archive,
  Loader,
} from "lucide-react";
import React, { useState } from "react";
import { AddTagModal } from "../tags/AddTagModal";
import { RemoveTagModal } from "./RemoveTagModal";

interface OrderActionsProps {
  order: Order;
}

const OrderActions: React.FC<OrderActionsProps> = ({ order }) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [addTagModalOpen, setAddTagModalOpen] = useState(false);
  const [removeTagModalOpen, setRemoveTagModalOpen] = useState(false);

  const handleOpenTagModal = () => {
    setTimeout(() => {
      setAddTagModalOpen(true);
    }, 100);
  };

  const handleOpenRemoveTagModal = () => {
    setTimeout(() => {
      setRemoveTagModalOpen(true);
    }, 100);
  };
  
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const orderData = {
        orderIds: [order.id],
      };
      const result = await ordersActions.orderScope.deleteOrders(orderData);
      if (result.success) {
        setIsLoading(false);
      }
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handlePause = async () => {
    setIsLoading(true);
    try {
      const orderData = {
        orderIds: [order.id],
      };

      const result = await ordersActions.orderScope.pauseOrders(orderData);
      if (result.success) {
        setIsLoading(false);
      }
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleResume = async () => {
    setIsLoading(true);
    try {
      const orderData = {
        orderIds: [order.id],
      };

      const result = await ordersActions.orderScope.resumeOrders(orderData);
      if (result.success) {
        setIsLoading(false);
      }
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleInactive = async () => {
    setIsLoading(true);
    try {
      const orderData = {
        orderIds: [order.id],
      };
      const result = await ordersActions.orderScope.inactiveOrders(orderData);
      if (result.success) {
        setIsLoading(false);
      }
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Veiksmai
            {isLoading ? (
              <Loader className="animate-spin"></Loader>
            ) : (
              <MoreVertical className="h-4 w-4 ml-2" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={handlePause}
            className="py-2 px-4 cursor-pointer flex items-center"
          >
            <Pause className="h-4 w-4 mr-2" />
            Pristabdyti
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleResume}
            className="py-2 px-4 cursor-pointer flex items-center"
          >
            <Play className="h-4 w-4 mr-2" />
            Tęsti
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleOpenTagModal}
            className="py-2 px-4 cursor-pointer flex items-center"
          >
            <ArrowDownToLine className="h-4 w-4 mr-2" />
            Pridėti tagą
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleOpenRemoveTagModal}
            className="py-2 px-4 cursor-pointer flex items-center"
          >
            <ArrowUpToLine className="h-4 w-4 mr-2" />
            Šalinti tagą
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleInactive}
            className="py-2 px-4 cursor-pointer flex items-center"
          >
            <Archive className="h-4 w-4 mr-2" />
            Padaryti neaktyviu
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="py-2 px-4 cursor-pointer  hover:text-red-800 focus:bg-red-50 text-red-600 focus:text-red-600 flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Ištrinti
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddTagModal
        order={order}
        isOpen={addTagModalOpen}
        onOpenChange={setAddTagModalOpen}
      />
      <RemoveTagModal
        order={order}
        isOpen={removeTagModalOpen}
        onOpenChange={setRemoveTagModalOpen}
      />
    </>
  );
};

export default OrderActions;
