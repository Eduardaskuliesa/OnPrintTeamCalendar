import { createCustomBirthDay } from "./createCustomBirthDay";
import { deleteBirthday } from "./deleteCustomBirthDay";
import { getAllCustomBirthDaysByUser } from "./getAllCustomBrithDays";
import { updateCustomBrithDay } from "./updateCustomBrithDay";

export const customBirthDayActions = {
  createCustomBirthDay,
  getAllCustomBirthDaysByUser,
  deleteBirthday,
  updateCustomBrithDay
};
