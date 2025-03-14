import Link from 'next/link'
import { listEmailTemplates } from '@/actions/emailTemplates'

const EmailTemplatePage = async () => {
  // Fetch all email templates
  const templates = await listEmailTemplates()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Email Templates</h1>
        <Link
          href="/emails/new"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Create New Template
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No templates found</p>
          <Link
            href="/emails/new"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Create Your First Template
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <div key={template} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium">{template}</h2>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/emails/${template}`}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                    onClick={() => {/* Add delete functionality */ }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EmailTemplatePage