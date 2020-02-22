export const removeDuplicates = <T>(
    from: T[],
    filter: T[],
    getId: (item: T) => string,
): T[] => {
    const foundIds: Record<string, string> = {};
    filter.forEach((item) => (foundIds[getId(item)] = "found"));
    return from.slice().filter((item) => !foundIds[getId(item)]);
};
