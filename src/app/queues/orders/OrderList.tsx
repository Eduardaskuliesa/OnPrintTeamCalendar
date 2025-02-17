"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

type Job = {
  id: string
  tagName: string
  status: string
  scheduledFor: number
  attempts: number
  processedAt: string | null
}

type Order = {
  id: number
  userName: string
  userSurname: string
  companyName: string
  phoneNumber: string
  productName: string
  subTotal: number
  country: string
  city: string
  createdAt: string
  jobs: Job[]
}

type OrdersResponse = {
  success: boolean
  data: {
    orders: {
      orderCount: number
      items: Order[]
    }
  }
  pagination: {
    currentPage: number
    totalPages: number
    itemsPerPage: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  message: string
}

export default function OrderList({ ordersResponse }: { ordersResponse: OrdersResponse }) {
  const [expandedOrders, setExpandedOrders] = useState<number[]>([])

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const orders = ordersResponse.data.orders.items

  return (
    <ScrollArea className="h-[600px] w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <button onClick={() => toggleOrderExpansion(order.id)}>
                  {expandedOrders.includes(order.id) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </TableCell>
              <TableCell>{order.id}</TableCell>
              <TableCell>
                {order.userName} {order.userSurname}
                <br />
                <span className="text-sm text-muted-foreground">{order.companyName}</span>
              </TableCell>
              <TableCell>{order.productName}</TableCell>
              <TableCell>${order.subTotal.toFixed(2)}</TableCell>
              <TableCell>{format(new Date(order.createdAt), "MMM d, yyyy")}</TableCell>
              <TableCell>
                <Badge variant="outline">{order.jobs[order.jobs.length - 1].status}</Badge>
              </TableCell>
              {expandedOrders.includes(order.id) && (
                <TableCell colSpan={7}>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="jobs">
                      <AccordionTrigger>Jobs</AccordionTrigger>
                      <AccordionContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Job ID</TableHead>
                              <TableHead>Tag</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Scheduled For</TableHead>
                              <TableHead>Attempts</TableHead>
                              <TableHead>Processed At</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.jobs.map((job) => (
                              <TableRow key={job.id}>
                                <TableCell>{job.id}</TableCell>
                                <TableCell>{job.tagName}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{job.status}</Badge>
                                </TableCell>
                                <TableCell>{format(job.scheduledFor, "MMM d, yyyy HH:mm:ss")}</TableCell>
                                <TableCell>{job.attempts}</TableCell>
                                <TableCell>
                                  {job.processedAt ? format(new Date(job.processedAt), "MMM d, yyyy HH:mm:ss") : "N/A"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}

