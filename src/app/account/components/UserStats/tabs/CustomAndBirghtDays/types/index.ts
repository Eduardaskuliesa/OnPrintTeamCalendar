export interface Birthday {
  birthdayId: string;
  name: string;
  fullDate: string;
  monthDay: string;
}

export interface CustomDay {
  customDayId: string;
  name: string;
  fullDate: string;
  monthDay: string;
}

export type OpenModal =
  | "addBirthday"
  | "updateBirthday"
  | "deleteBirthday"
  | "addCustomDay"
  | "updateCustomDay"
  | "deleteCustomDay"
  | null;
