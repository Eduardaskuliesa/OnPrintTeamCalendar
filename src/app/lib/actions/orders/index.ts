import { bulk } from "./bulk";
import { getOrders } from "./getAllOrders";
import { getFilteredOrders } from "./getFilteredOrders";
import { orderScope } from "./orderScope";
import { tagScope } from "./tagScope";

export const ordersActions = {
  orderScope,
  tagScope,
  getOrders,
  getFilteredOrders,
  bulk
};
