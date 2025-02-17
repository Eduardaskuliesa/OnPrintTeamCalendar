"use client"

import { useGetOrders } from "@/app/lib/actions/orders/hooks/useGetOrders"
import { useState } from "react"
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Package,
  User,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  CreditCard,
  Eye,
  Edit,
  Trash2,
  Check,
} from "lucide-react"
import { format } from "date-fns"

const OrderPageWrapper = () => {
  const [page, setPage] = useState(1)
  const { data: orders, isLoading } = useGetOrders(page)
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])

  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const toggleAllOrders = () => {
    if (selectedOrders.length === orders?.data?.orders?.items.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders?.data?.orders?.items.map((order) => order.id) || [])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SENT":
        return "bg-green-100 text-green-800"
      case "FAILED":
        return "bg-red-100 text-red-800"
      case "QUEUED":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Orders ({orders?.data?.data?.orders?.orderCount})</h1>
          <button 
            onClick={toggleAllOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {selectedOrders.length === orders?.data?.orders?.items.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === orders?.data?.orders?.items.length}
                    onChange={toggleAllOrders}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Info</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product & Payment</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders?.data?.data?.orders?.items.map((order) => (
                <>
                  <tr key={`${order.orderId}-1`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap" rowSpan={2}>
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">#{order.id}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {format(new Date(order.createdAt), "MMM d, yyyy HH:mm")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.userName} {order.userSurname}</div>
                          <div className="text-sm text-gray-500">{order.companyName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.productName}</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {order.subTotal.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-1">
                        {order.jobs.map((job) => (
                          <span
                            key={job.id}
                            className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(job.status)}`}
                          >
                            {job.tagName}
                            {job.processedAt && <Check className="h-3 w-3 ml-1" />}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" rowSpan={2}>
                      <div className="flex flex-col items-end space-y-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr key={`${order.id}-2`} className="bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        Sales Agent ID: {order.salesAgentId}
                      </div>
                      <div className="text-sm text-gray-500">
                        Customer ID: {order.customerId}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {order.phoneNumber}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {order.city}, {order.country}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 flex items-center">
                        <CreditCard className="h-4 w-4 mr-1" />
                        {order.paymentDetails}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        Product ID: {order.productId}
                      </div>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>

        {orders?.data?.pagination && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setPage(page - 1)}
              disabled={!orders.data?.pagination.hasPreviousPage}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {orders.data?.pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!orders.data?.pagination.hasNextPage}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderPageWrapper