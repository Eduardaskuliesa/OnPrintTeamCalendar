import { bookAsAdminVacation } from "./bookVacationAsAdmin";
import { cancelVacation } from "./cancelVacation";
import { deleteVacation } from "./deleteVaction";
import { getAdminVacations, getFreshAdminVacations } from "./getAdminVacations";
import { getFutureVacations } from "./getFutureVacations";
import { getVacations } from "./getVacations";
import { updateVacationStatus } from "./updateVacationStatus";

export const vacationsAction = {
  getVacations,
  getAdminVacations,
  getFutureVacations,
  updateVacationStatus,
  deleteVacation,
  bookAsAdminVacation,
  getFreshAdminVacations,
  cancelVacation
};
