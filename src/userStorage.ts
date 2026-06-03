export function getUserStorageKeys(userId: string): { workout: string; history: string } {
  return {
    workout: `fitness-tracker-workout:${userId}`,
    history: `fitness-tracker-history:${userId}`,
  };
}
