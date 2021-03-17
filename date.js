
exports.getDate = function () {
    let today = new Date();
    let dayOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };
    return today.toLocaleDateString("en-US", dayOptions);
}

exports.getDay = function () {
    let today = new Date();
    let dayOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };
    return today.toLocaleDateString("en-US", dayOptions);
}