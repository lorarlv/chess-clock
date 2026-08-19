export function formatTime(seconds: number): string {
    if (seconds < 11) {
        return Math.max(seconds, 0).toFixed(2);
    }

    const wholeSeconds = Math.ceil(seconds);
    const minutes = Math.floor(wholeSeconds / 60);
    const remainingSeconds = wholeSeconds % 60;

    return `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
}