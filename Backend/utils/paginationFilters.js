exports.buildPagination = ({
    dateFilter,
    fromDate,
    toDate,
    searchFilter,
    page = 1,
    limit
}) => {

    const isFirstHit =
        !dateFilter &&
        !fromDate &&
        !toDate &&
        !searchFilter &&
        (!page || page == 1);

    if (isFirstHit) {
        limit = 100;
    } else {
        limit = limit ? parseInt(limit) : 10;
    }

    const skip = (page - 1) * limit;

    return {
        limit,
        skip,
        currentPage: parseInt(page)
    };
};
