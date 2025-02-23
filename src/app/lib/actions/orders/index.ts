import { addTagsToOrders } from "./addTagToOrders";
import { deleteOrders } from "./deleteOrders";
import { getOrders } from "./getAllOrders";
import { getFilteredOrders } from "./getFilteredOrders";
import { inactiveOrders } from "./makeInactiveOrders";
import { pauseOrders } from "./pauseOrders";
import { removeTagsFromoOrders } from "./removeTagFromOrders";
import { resumeOrders } from "./resumeOrders";

export const ordersActions = {
  getOrders,
  getFilteredOrders,
  deleteOrders,
  pauseOrders,
  inactiveOrders,
  resumeOrders,
  addTagsToOrders,
  removeTagsFromoOrders,
};
