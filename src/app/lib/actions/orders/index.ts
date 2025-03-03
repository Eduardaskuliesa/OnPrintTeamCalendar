import { bulk } from "./bulk";
import { getOrders } from "./getAllOrders";
import { getFilteredOrders } from "./getFilteredOrders";
import { jobScope } from "./jobScope";
import { orderScope } from "./orderScope";
import { tagScope } from "./tagScope";

export const ordersActions = {
  orderScope,
  tagScope,
  jobScope,
  getOrders,
  getFilteredOrders,
  bulk
};
