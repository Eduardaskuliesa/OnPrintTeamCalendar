const WorkRecordSkeleton = () => {
  return (
    <div className="bg-slate-50 rounded-lg shadow-md border border-blue-50">
      <table className="min-w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
              Darbuotojas
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
              Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
              Tipas
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
              Valandos
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
              Priežastis
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[...Array(10)].map((_, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-slate-200 animate-pulse mr-2"></div>
                  <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-6 w-28 bg-slate-200 rounded-full animate-pulse"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 max-w-xs">
                <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkRecordSkeleton;
