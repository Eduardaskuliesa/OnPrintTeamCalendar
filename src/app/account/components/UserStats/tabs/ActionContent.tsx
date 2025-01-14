import { FileText, Download, Upload, File } from 'lucide-react';
import StatCard from '../StatCard';


const DocumentsContent = () => {
  const stats = {
    documents: {
      title: "Total Documents",
      value: "156",
      icon: FileText,
      subtitle: "All documents",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-800",
      textColor: "text-indigo-800"
    },
    downloads: {
      title: "Downloads",
      value: "24",
      icon: Download,
      subtitle: "This month",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-800",
      textColor: "text-emerald-800"
    },
    uploads: {
      title: "Recent Uploads",
      value: "12",
      icon: Upload,
      subtitle: "Last 7 days",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-800",
      textColor: "text-rose-800"
    }
  };

  return (
    
      <><div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <StatCard {...stats.documents} />
          <StatCard {...stats.downloads} />
          <StatCard {...stats.uploads} />
      </div><div className="bg-[#fefaf6] p-6 rounded-2xl shadow-md">
              <div className="grid gap-4 grid-cols-1">
                  {[...Array(5)].map((_, i) => (
                      <div
                          key={i}
                          className="bg-white p-4 rounded-lg border-2 border-blue-50 flex items-center justify-between"
                      >
                          <div className="flex items-center space-x-4">
                              <div className="bg-gray-100 p-2 rounded-lg">
                                  <File className="text-gray-600" size={24} />
                              </div>
                              <div>
                                  <h4 className="font-semibold">
                                      {[
                                          'Annual_Report_2024.pdf',
                                          'Vacation_Policy.docx',
                                          'Team_Schedule.xlsx',
                                          'Project_Timeline.pdf',
                                          'Meeting_Notes.doc'
                                      ][i]}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                      {['2.4 MB', '856 KB', '1.2 MB', '3.1 MB', '645 KB'][i]}
                                      {' • '}
                                      {new Date(2024, 0, 20 - i).toLocaleDateString('lt-LT')}
                                  </p>
                              </div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 transition-colors">
                              <Download size={20} />
                          </button>
                      </div>
                  ))}
              </div>
          </div></>
  
  );
};

export default DocumentsContent;