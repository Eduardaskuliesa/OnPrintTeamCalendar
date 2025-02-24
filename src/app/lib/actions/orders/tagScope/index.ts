import { addTagsToOrders } from "./addTagToOrders";
import { inactiveTagsOrders } from "./inactiveTagsOrders";
import { pauseTagsOrders } from "./pauseTagsOrders";
import { removeTagsFromoOrders } from "./removeTagFromOrders";
import { resumeTagsOrders } from "./resumeTagsOrders";

export const tagScope = {
  addTagsToOrders,
  pauseTagsOrders,
  removeTagsFromoOrders,
  resumeTagsOrders,
  inactiveTagsOrders,
};
