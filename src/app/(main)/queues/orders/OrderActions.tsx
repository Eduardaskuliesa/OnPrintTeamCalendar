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
import { AddTagModal } from "./AddTagModal";
import { RemoveTagModal } from "./RemoveTagModal";
import { toast } from "react-toastify";

interface OrderActionsProps {
  order: Order;
}

const OrderActions: React.FC<OrderActionsProps> = ({ order }) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);


  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalState, setModalState] = useState<{
    type: 'addTag' | 'removeTag' | null;
    isOpen: boolean;
  }>({
    type: null,
    isOpen: false,
  });

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
      toast.success('Orderis sėkmingai ištryntas')
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
      toast.success('Orderis sėkmingai sustabdytas')
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (error) {
      toast.error('Įvyko klaida')
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
      toast.success('Orderis sėkmingai pratęstas')
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (error) {
      toast.error('Įvyko klaida')
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
      toast.success('Orderis sėkmingai tapo neaktyviu')
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (error) {
      toast.error('Įvyko klaida')
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleOpenModal = (type: 'addTag' | 'removeTag') => (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen(false);
    setModalState({ type, isOpen: true });
  };

  const handleCloseModal = () => {
    setModalState({ type: null, isOpen: false });
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
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
            onClick={handleOpenModal('addTag')}
            className="py-2 px-4 cursor-pointer flex items-center"
            onSelect={(e) => e.preventDefault()}
          >
            <ArrowDownToLine className="h-4 w-4 mr-2" />
            Pridėti tagą
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleOpenModal('removeTag')}
            className="py-2 px-4 cursor-pointer flex items-center"
            onSelect={(e) => e.preventDefault()}
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

      {modalState.type === 'addTag' && (
        <AddTagModal
          order={order}
          isOpen={modalState.isOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) handleCloseModal();
          }}
        />
      )}

      {modalState.type === 'removeTag' && (
        <RemoveTagModal
          order={order}
          isOpen={modalState.isOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) handleCloseModal();
          }}
        />
      )}
    </>
  );
};

export default OrderActions;
