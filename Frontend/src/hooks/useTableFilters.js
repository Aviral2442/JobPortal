import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export const useTableFilters = ({
  defaultDateFilter = "",
  onFilterChange,
} = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL - remove filter initialization from URL
  const [dateFilter, setDateFilter] = useState(defaultDateFilter);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchFilter, setSearchFilter] = useState(null);

  const [dateRange, setDateRange] = useState(() => {
    // Remove dateRange initialization from URL
    return [null, null];
  });

  const [startDate, endDate] = dateRange;

  // Initialize page from URL
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page) - 1 : 0;
  });

  // Update URL with only page value
  const updateURL = (updates) => {
    const newParams = new URLSearchParams();

    const pageValue = updates.page !== undefined ? updates.page : currentPage;
    if (pageValue > 0) {
      newParams.set("page", (pageValue + 1).toString());
    }


    setSearchParams(newParams);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateURL({ page: newPage });
  };

  // Handle date filter change
  const handleDateFilterChange = (value) => {
    setDateFilter(value);
    setCurrentPage(0);
    // Remove: updateURL({ page: 0, date: value, fromDate: null, toDate: null });
    updateURL({ page: 0 });
    onFilterChange?.();
  };

  // Handle status filter change
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(0);
    // Remove: updateURL({ page: 0, status: value });
    updateURL({ page: 0 });
    onFilterChange?.();
  };

  // Handle date range change
  const handleDateRangeChange = (update) => {
    setDateRange(update);
    setCurrentPage(0);

    const [start, end] = update;

    if (start && end) {
      // Remove: updateURL({ page: 0, date: "custom", fromDate, toDate });
      updateURL({ page: 0 });
      if (dateFilter !== "custom") {
        setDateFilter("custom");
      }
    } else if (!start && !end) {
      // Remove: updateURL({ page: 0, fromDate: null, toDate: null });
      updateURL({ page: 0 });
      if (dateFilter === "custom") {
        setDateFilter(defaultDateFilter);
      }
    }

    onFilterChange?.();
  };

  const handleSearchFilterChange = (value) => {
    setSearchFilter(value);
    // setCurrentPage(0);
    // // Remove: updateURL({ page: 0, search: value });
    // updateURL({ page: 0 });
    // onFilterChange?.();
  }

  // Get filter params for API call (memoized to prevent infinite re-renders)
  const getFilterParams = useCallback((pageSize, additionalParams = {}) => {
    const params = {
      ...additionalParams,
      page: currentPage + 1,
      limit: pageSize,
    };

    // Normal quick filters
    if (dateFilter && dateFilter !== "custom") {
      params.dateFilter = dateFilter;
    }

    // Custom date range filter
    if (startDate && endDate) {
      params.dateFilter = "custom";
      params.fromDate = startDate.toISOString().split("T")[0];
      params.toDate = endDate.toISOString().split("T")[0];
    }

    if (statusFilter) {
      params.status = statusFilter;
    }

    if (searchFilter) {
      params.searchFilter = searchFilter;
    }

    return params;
  }, [currentPage, dateFilter, startDate, endDate, statusFilter, searchFilter]);

  // Remove: Set default filter on mount if no filter in URL
  // useEffect(() => {
  //   if (!searchParams.get("date") && dateFilter === defaultDateFilter) {
  //     updateURL({ date: defaultDateFilter });
  //   }
  // }, []);

  return {
    dateFilter,
    statusFilter,
    dateRange,
    searchFilter,
    currentPage,
    searchParams,
    setSearchParams,
    handleDateFilterChange,
    handleStatusFilterChange,
    handleDateRangeChange,
    handlePageChange,
    handleSearchFilterChange,
    updateURL,
    getFilterParams,
  };
};