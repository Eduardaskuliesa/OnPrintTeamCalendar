import { getUser } from "./getUser";
import { getUsers } from "./getUsers";
import { updateUser } from "./updateUser";
import { createUser } from "./createUser";
import { deleteUser } from "./deleteUser";
import { updatePassword } from "./updatePassword";
import { updateUserVacationDays } from "./updateVacationsDays";

export const usersActions = {
  getUser,
  getUsers,
  updateUser,
  createUser,
  deleteUser,
  updatePassword,
  updateUserVacationDays,
};
