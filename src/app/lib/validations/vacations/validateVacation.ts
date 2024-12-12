import { dynamoDb } from "../../dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

import { getDaysInAdvance, getTotalDays, isWeekend } from "./utils";
import { VacationValidationParams, ValidationResult } from "..";

export async function validateVacationRequest({
  startDate: startDateStr,
  endDate: endDateStr,
  userEmail,
  globalSettings,
}: VacationValidationParams): Promise<ValidationResult> {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const totalDays = getTotalDays(startDate, endDate);
  const daysInAdvance = getDaysInAdvance(startDate);

  // 1. Basic validation rules (no DB required)
  if (totalDays > globalSettings.bookingRules.maxDaysPerBooking) {
    return {
      isValid: false,
      error: {
        type: "MAX_DAYS_EXCEEDED",
        message: `Vacation cannot exceed ${globalSettings.bookingRules.maxDaysPerBooking} days`,
      },
    };
  }

  if (daysInAdvance > globalSettings.bookingRules.maxAdvanceBookingDays) {
    return {
      isValid: false,
      error: {
        type: "ADVANCE_BOOKING_EXCEEDED",
        message: `Cannot book more than ${globalSettings.bookingRules.maxAdvanceBookingDays} days in advance`,
      },
    };
  }

  if (
    globalSettings.bookingRules.minDaysNotice.enabled &&
    daysInAdvance < globalSettings.bookingRules.minDaysNotice.days
  ) {
    return {
      isValid: false,
      error: {
        type: "MINIMUM_NOTICE_NOT_MET",
        message: `Must book at least ${globalSettings.bookingRules.minDaysNotice.days} days in advance`,
      },
    };
  }

  // 2. Check restricted days
  const restrictedDates = new Set(
    [
      ...globalSettings.restrictedDays.holidays,
      ...globalSettings.restrictedDays.customRestricted,
    ].map((date) => new Date(date).toISOString().split("T")[0])
  );

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const currentDateStr = currentDate.toISOString().split("T")[0];

    if (globalSettings.restrictedDays.weekends && isWeekend(currentDate)) {
      return {
        isValid: false,
        error: {
          type: "RESTRICTED_DAYS",
          message: "Weekends are not allowed for vacation booking",
          dates: [
            {
              start: currentDateStr,
              end: currentDateStr,
            },
          ],
        },
      };
    }

    if (restrictedDates.has(currentDateStr)) {
      return {
        isValid: false,
        error: {
          type: "RESTRICTED_DAYS",
          message: "Selected dates include a restricted or holiday day",
          dates: [
            {
              start: currentDateStr,
              end: currentDateStr,
            },
          ],
        },
      };
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // 3. Check blackout periods
  for (const period of globalSettings.seasonalRules.blackoutPeriods) {
    const blackoutStart = new Date(period.start);
    const blackoutEnd = new Date(period.end);

    if (startDate <= blackoutEnd && endDate >= blackoutStart) {
      return {
        isValid: false,
        error: {
          type: "BLACKOUT_PERIOD",
          message: `Selected dates fall within blackout period: ${period.reason}`,
          dates: [{ start: period.start, end: period.end }],
        },
      };
    }
  }

  // 4. Database-dependent rules
  let activeVacations: any[] = [];

  if (globalSettings.overlapRules.enabled || globalSettings.gapRules.enabled) {
    // Use status-index GSI to get both PENDING and APPROVED vacations
    const [pendingVacations, approvedVacations] = await Promise.all([
      dynamoDb.send(
        new QueryCommand({
          TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
          IndexName: "status-index",
          KeyConditionExpression: "#status = :status",
          FilterExpression: "endDate >= :now",
          ExpressionAttributeNames: {
            "#status": "status",
          },
          ExpressionAttributeValues: {
            ":status": "PENDING",
            ":now": new Date().toISOString(),
          },
        })
      ),
      dynamoDb.send(
        new QueryCommand({
          TableName: process.env.VACATION_DYNAMODB_TABLE_NAME!,
          IndexName: "status-index",
          KeyConditionExpression: "#status = :status",
          FilterExpression: "endDate >= :now",
          ExpressionAttributeNames: {
            "#status": "status",
          },
          ExpressionAttributeValues: {
            ":status": "APPROVED",
            ":now": new Date().toISOString(),
          },
        })
      ),
    ]);

    activeVacations = [
      ...(pendingVacations.Items || []),
      ...(approvedVacations.Items || []),
    ];
  }

  if (globalSettings.overlapRules.enabled) {
    const overlappingVacations = activeVacations.filter(
      (vacation) =>
        new Date(vacation.startDate) <= endDate &&
        new Date(vacation.endDate) >= startDate
    );

    if (
      overlappingVacations.length >=
      globalSettings.overlapRules.maxSimultaneousBookings
    ) {
      return {
        isValid: false,
        error: {
          type: "MAX_SIMULTANEOUS_BOOKINGS",
          message: `Maximum ${globalSettings.overlapRules.maxSimultaneousBookings} simultaneous bookings allowed`,
          dates: overlappingVacations.map((v) => ({
            start: v.startDate,
            end: v.endDate,
          })),
        },
      };
    }
  }

  if (globalSettings.gapRules.enabled) {
    for (const vacation of activeVacations) {
      const gapRequired = globalSettings.gapRules.days;
      const vacationEnd = new Date(vacation.endDate);
      const vacationStart = new Date(vacation.startDate);

      const gapAfter = new Date(vacationEnd);
      gapAfter.setDate(gapAfter.getDate() + gapRequired);

      const gapBefore = new Date(vacationStart);
      gapBefore.setDate(gapBefore.getDate() - gapRequired);

      if (
        (startDate <= gapAfter && startDate >= vacationEnd) ||
        (endDate >= gapBefore && endDate <= vacationStart)
      ) {
        return {
          isValid: false,
          error: {
            type: "GAP_CONFLICT",
            message: `Must maintain ${gapRequired} days gap between vacations`,
            dates: [
              {
                start: vacationEnd.toISOString(),
                end: gapAfter.toISOString(),
              },
            ],
          },
        };
      }
    }
  }

  return { isValid: true };
}
