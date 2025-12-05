import React, { useEffect, useState, useRef } from "react";
import ComponentCard from "@/components/ComponentCard";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "react-bootstrap";

import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";

import ReactDOMServer from "react-dom/server";
import {
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
  TbDotsVertical,
  TbEdit,
} from "react-icons/tb";

import jszip from "jszip";
import pdfmake from "pdfmake";
import {
  categoryColumns,
  subCategoryColumns,
} from "./components/category.js";

import { createRoot } from "react-dom/client";
import axios from "@/api/axios";
import toast from "react-hot-toast";
import JobTypeList from "@/views/pages/Manage-Jobs/Category/components/JobTypeList";
import SectorList from "@/views/pages/Manage-Jobs/Category/components/SectorList";

const tableConfig = {
  1: {
    endpoint: "/job-categories/get_job_category_list",
    columns: categoryColumns,
  },
  2: {
    endpoint: "/job-categories/get_job_subcategory_list",
    columns: subCategoryColumns,
  },
};

DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

const ExportDataWithButtons = ({
  tabKey,
  onAddNew,
  onEditRow,
  refreshFlag,
  onDataChanged,
}) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const tableRef = useRef(null);

  const config = tableConfig[tabKey] || {};
  const endpoint = config.endpoint;
  const columns = config.columns || [];

  const fetchData = async () => {
    // If no endpoint configured for this tab, skip fetch (JobType/Sector use their own components)
    if (!endpoint) {
      setRows([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(endpoint);
      console.log("Fetched data:", res.data);
      toast.success("Data fetched successfully");
      // keep existing handling for tabs that use tableConfig
      setRows(res.data?.jsonData?.data || res.data?.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tabKey, refreshFlag]);

  // Handle search
  useEffect(() => {
    if (tableRef.current) {
      const table = tableRef.current.dt();
      table.search(searchTerm).draw();
    }
  }, [searchTerm]);

  // const handleDelete = async (rowData) => {
  //   let id;
  //   let name;
  //   let deleteEndpoint;

  //   switch (tabKey) {
  //     case 1:
  //       id = rowData._id;
  //       name = rowData.categoryName;
  //       deleteEndpoint = `/job-categories/delete_job_category/${id}`;
  //       break;
  //     case 2:
  //       id = rowData._id;
  //       name = rowData.subCategoryName;
  //       deleteEndpoint = `/job-categories/delete_job_subcategory/${id}`;
  //       break;
  //     default:
  //       return;
  //   }

  //   const confirmed = window.confirm(
  //     `Are you sure you want to delete "${name}"?`
  //   );
  //   if (!confirmed) return;

  //   try {
  //     await axios.delete(deleteEndpoint);
  //     alert("Deleted successfully!");
  //     onDataChanged();
  //   } catch (err) {
  //     console.error("Delete error:", err);
  //     alert("Failed to delete");
  //   }
  // };

  const columnsWithActions = [
    {
      title: "S.No.",
      data: null,
      orderable: false,
      searchable: false,
      render: (data, type, row, meta) => {
        return meta.row + 1;
      },
    },
    ...columns,
    {
      title: "Actions",
      data: null,
      orderable: false,
      searchable: false,
      render: () => "",
      createdCell: (td, cellData, rowData) => {
        const root = createRoot(td);
        root.render(
          <Dropdown align="end">
            <DropdownToggle
              variant="link"
              className="drop-arrow-none fs-xxl link-reset p-0"
            >
              <TbDotsVertical />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => onEditRow(rowData)}>
                <TbEdit className="me-2" />
                Edit
              </DropdownItem>
              {/* <DropdownItem onClick={() => handleDelete(rowData)}>
                <TbTrash className="me-2" />
                Delete
              </DropdownItem> */}
            </DropdownMenu>
          </Dropdown>
        );
      },
    },
  ];

  const renderTable = () => {
    switch (tabKey) {
      case 1:
        return <CategoryList onEditRow={onEditRow} refreshFlag={refreshFlag} onDataChanged={onDataChanged} />;
      case 2:
        return <SubCategoryList onEditRow={onEditRow} refreshFlag={refreshFlag} onDataChanged={onDataChanged} />;
      case 3:
        return <JobTypeList onEditRow={onEditRow} refreshFlag={refreshFlag} onDataChanged={onDataChanged} />;
      case 4:
        return <SectorList onEditRow={onEditRow} refreshFlag={refreshFlag} onDataChanged={onDataChanged} />;
      default:
        return <CategoryList onEditRow={onEditRow} refreshFlag={refreshFlag} onDataChanged={onDataChanged} />;
    }
  };

  // For tabs that have specialized components (JobType / Sector), render them directly.
  if (tabKey === 3 || tabKey === 4) {
    return (
      <ComponentCard
        title={tabKey === 3 ? "Job Type" : "Sector"}
        className="mb-4 pb-3"
        onAddNew={onAddNew}
      >
        {renderTable()}
      </ComponentCard>
    );
  }

  return (
    <>
      <ComponentCard
        title={tabKey === 1 ? "Category" : "Sub Category"}
        className="mb-4 pb-3"
        onAddNew={onAddNew}
      >
        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : (
          <DataTable
            ref={tableRef}
            data={rows}
            columns={columnsWithActions}
            options={{
              responsive: true,
              searching: true,
              layout: {
                topStart: "buttons",
              },
              buttons: [
                { extend: "copy", className: "btn btn-sm btn-secondary" },
                { extend: "csv", className: "btn btn-sm btn-secondary" },
                { extend: "excel", className: "btn btn-sm btn-secondary" },
                { extend: "pdf", className: "btn btn-sm btn-secondary" },
              ],
              paging: true,
              ordering: true,
              pageLength: 10,
              language: {
                paginate: {
                  first: ReactDOMServer.renderToStaticMarkup(
                    <TbChevronsLeft />
                  ),
                  previous: ReactDOMServer.renderToStaticMarkup(
                    <TbChevronLeft />
                  ),
                  next: ReactDOMServer.renderToStaticMarkup(<TbChevronRight />),
                  last: ReactDOMServer.renderToStaticMarkup(
                    <TbChevronsRight />
                  ),
                },
              },
            }}
            className="table table-striped dt-responsive w-100"
          />
        )}
      </ComponentCard>
    </>
  );
};

export default ExportDataWithButtons;