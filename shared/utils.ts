// Returns an array of items that are in B, but not A.
export const findNew = (a: string[], b: string[]) => {
    const seen: Record<string, boolean> = {};
    for (const item of b) {
        seen[item] = true;
    }
    for (const item of a) {
        delete seen[item];
    }
    return Object.keys(seen);
};
