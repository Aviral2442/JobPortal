import formatDate from "@/components/DateFormat"
const basePath = import.meta.env.VITE_BASE_URL;

export const categoryColumns = [
  { data: "_id", title: "ID" },
  {
    data: "category_image",
    title: "Image",
    render: (data) => {
      if (!data) return "No Image";
      // console.log("Image data:", data);
      // console.log("Base path:", basePath);
      return `<img src="${basePath}${data}" alt="Category Image" style="width: 24px; height: 24px;" />`;
    },
  },
  { data: "category_name", title: "Name" },
  { data: "category_job_sector.job_sector_name", title: "Sector" },
  {
    data: "category_status",
    title: "Status",
    render: (data) => {
      if (data == 0 || data === "active") {
        return `<span class="badge badge-label badge-soft-success">Active</span>`;
      } else if (data == 1 || data === "inactive") {
        return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
      }
    },
  },
];

export const subCategoryColumns = [
  { data: "_id", title: "ID" },
  {
    data: "subcategory_image",
    title: "Image",
    render: (data) => {
      if (!data) return "No Image";
      return `<img src="${basePath}${data}" alt="Category Image" style="width: 24px; height: 24px;" />`;
    },
  },
  { data: "subcategory_name", title: "Sub Category Name" },
  { data: "subcategory_category_id.category_name", title: "Category Name", defaultContent: "N/A" },
  {
    data: "subcategory_status",
    title: "Status",
    render: (data) => {
      if (data == 0 || data === "active") {
        return `<span class="badge badge-label badge-soft-success">Active</span>`;
      } else if (data == 1 || data === "inactive") {
        return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
      } else {
        return `<span class="badge badge-label badge-soft-secondary">Deleted</span>`;
      }
    },
  },
];

export const careerPreference = [
  { data: "_id", title: "ID" },
  { data: "careerPreferenceName", title: "Name" },
  { data: "careerPreferenceSectorId.job_sector_name", title: "Sector", defaultContent: "N/A" },
    {
    data: "careerPreferenceStatus",
    title: "Status",
    render: (data) => {
      if (data == 0 || data === "active") {
        return `<span class="badge badge-label badge-soft-success">Active</span>`;
      } else if (data == 1 || data === "inactive") {
        return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
      } else {
        return `<span class="badge badge-label badge-soft-secondary">Deleted</span>`;
      }
    },
  },
  { title: "Date", data: "careerPreferenceCreatedAt", 
    render: (data) => { return formatDate(data) } },
];