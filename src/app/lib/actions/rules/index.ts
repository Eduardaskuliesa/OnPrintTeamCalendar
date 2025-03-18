import { createRule } from "./createRule";
import { deleteRule } from "./deleteRule";
import { getRules } from "./getAllRules";
import { updateRule } from "./updateRule";

export const rulesAction = {
    getRules,
    createRule,
    updateRule,
    deleteRule
}