const moment = require("moment");

exports.buildDateFilter = ({
    dateFilter,
    fromDate,
    toDate,
    dateField = "created_at" // you can override per model
}) => {

    if (!dateFilter) return {};

    const today = moment().startOf("day");
    const now = moment().endOf("day");

    let startDate, endDate;

    switch (dateFilter) {
        case "today":
            startDate = today.unix();
            endDate = now.unix();
            break;

        case "yesterday":
            startDate = today.clone().subtract(1, "days").unix();
            endDate = now.clone().subtract(1, "days").unix();
            break;

        case "this_week":
            startDate = moment().startOf("week").unix();
            endDate = moment().endOf("week").unix();
            break;

        case "this_month":
            startDate = moment().startOf("month").unix();
            endDate = moment().endOf("month").unix();
            break;

        case "custom":
            if (fromDate && toDate) {
                startDate = moment(fromDate, "YYYY-MM-DD").startOf("day").unix();
                endDate = moment(toDate, "YYYY-MM-DD").endOf("day").unix();
            }
            break;
    }

    if (!startDate || !endDate) return {};

    return {
        [dateField]: { $gte: startDate, $lte: endDate }
    };
};
