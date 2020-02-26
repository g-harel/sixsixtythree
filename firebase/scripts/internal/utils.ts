export const removeDuplicates = <T>(
    from: T[],
    filter: T[],
    getId: (item: T) => string,
): T[] => {
    const foundIds: Record<string, string> = {};
    filter.forEach((item) => (foundIds[getId(item)] = "found"));
    return from.slice().filter((item) => !foundIds[getId(item)]);
};

// Produces a function that generates color codes between start and end,
// interpolating input is expected to be in the form "#ffeecc".
export const colorInterpolator = (start: string, end: string) => {
    const sR = parseInt(start.substr(1, 2), 16);
    const sG = parseInt(start.substr(3, 2), 16);
    const sB = parseInt(start.substr(5, 2), 16);
    const eR = parseInt(end.substr(1, 2), 16);
    const eG = parseInt(end.substr(3, 2), 16);
    const eB = parseInt(end.substr(5, 2), 16);

    return (percent: number) => {
        return (
            "#" +
            [
                Math.round(sR + (eR - sR) * percent)
                    .toString(16)
                    .padStart(2, "0"),
                Math.round(sG + (eG - sG) * percent)
                    .toString(16)
                    .padStart(2, "0"),
                Math.round(sB + (eB - sB) * percent)
                    .toString(16)
                    .padStart(2, "0"),
            ].join("")
        );
    };
};
