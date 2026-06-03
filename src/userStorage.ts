export function getUserStorageKeys(userId: string): { workout: string; history: string; routines: string } {
  return {
    workout: `fitness-tracker-workout:${userId}`,
    history: `fitness-tracker-history:${userId}`,
    routines: `fitness-tracker-routines:${userId}`,
  };
}
