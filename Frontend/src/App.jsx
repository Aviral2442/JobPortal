import { useRoutes } from 'react-router';
import { routes } from '@/routes';
import { routes as mainRoutes } from "@/routes";
const App = () => {
  return useRoutes(mainRoutes);
};
export default App;


/*

job_important_links : [
  { type: "other", label: "Official Website", url: "https://example.com" },
  { type: "application", label: "Apply Here", url: "https://example.com/apply" },
   { type: "syllabus", label: "Syllabus", url: "https://example.com/syllabus" }
]


*/