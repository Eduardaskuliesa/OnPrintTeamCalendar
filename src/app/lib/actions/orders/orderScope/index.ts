import { deleteOrders } from "./deleteOrders";
import { inactiveOrders } from "./makeInactiveOrders";
import { pauseOrders } from "./pauseOrders";
import { resumeOrders } from "./resumeOrders";

export const orderScope = {
  deleteOrders,
  inactiveOrders,
  pauseOrders,
  resumeOrders,
};
