import { bookAsAdminVacation } from "./bookVacationAsAdmin";
import { deleteVacation } from "./deleteVaction";
import { getAdminVacations } from "./getAdminVacations";
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
};
