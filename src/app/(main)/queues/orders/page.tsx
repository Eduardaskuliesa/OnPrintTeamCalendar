import { Suspense } from "react";
import OrderPageWrapper from "./OrderPageWrapper";

const OrdersPage = () => {
  return (
    <Suspense fallback={<div>...Kraunama</div>}>
      <OrderPageWrapper></OrderPageWrapper>
    </Suspense>
  );
};

export default OrdersPage;
