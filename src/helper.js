const postFixFileName = () => {
    const currentTimestamp = Date.now();
    const formattedDate = new Date(currentTimestamp).toISOString().split('T')[0];
    return `${formattedDate}_${currentTimestamp}`;
}
export {
    postFixFileName
}
