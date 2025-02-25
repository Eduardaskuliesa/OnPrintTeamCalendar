import { addTagsToFilteredOrders } from "./addTagsBulk";
import { deleteOrdersBulk } from "./deleteOrdersBulk";
import { inactiveOrdersBulk } from "./inactiveOrderBulk";
import { inactiveTagsToFilteredOrders } from "./inactiveTagsBulk";
import { pauseOrdersBulk } from "./pauseOrdersBulk";
import { pauseTagsToFilteredOrders } from "./pauseTagsBulk";
import { removeTagsToFilteredOrders } from "./removeTagsBulk";
import { resumeOrdersBulk } from "./resumeOrdersBulk";
import { resumeTagsToFilteredOrders } from "./resumeTagsBulk";

export const bulk = {
    addTagsToFilteredOrders,
    removeTagsToFilteredOrders,
    inactiveTagsToFilteredOrders,
    resumeTagsToFilteredOrders,
    pauseTagsToFilteredOrders,
    deleteOrdersBulk,
    inactiveOrdersBulk,
    pauseOrdersBulk,
    resumeOrdersBulk
}