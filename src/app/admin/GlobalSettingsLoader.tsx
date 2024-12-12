export default function GlobalSettingsLoader() {
  return (
    <div className="bg-slate-50 rounded-lg shadow-md border border-blue-50 animate-pulse">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 w-40 bg-slate-200 rounded"></div>
        </div>
        <div className="space-y-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="border-b border-slate-200 last:border-0 pb-4 last:pb-0"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                <div className="h-5 w-32 bg-slate-200 rounded"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-white rounded-md p-3 border border-slate-200"
                  >
                    <div className="h-4 w-24 bg-slate-100 rounded mb-2"></div>
                    <div className="h-5 w-32 bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
