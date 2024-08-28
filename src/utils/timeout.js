import dayjs from "dayjs";

function getTimeout(start, threshold = 750) {
    const diff = dayjs().diff(start, "milliseconds");
    return Math.max(0, threshold - diff);
}

export default getTimeout;
