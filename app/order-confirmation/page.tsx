"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Package, Mail, Home } from "lucide-react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const order = searchParams.get("order");
    if (order) {
      setOrderNumber(order);
    } else {
      router.push("/");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto px-4"
      >
        <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-8"
          >
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
          </motion.div>

          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-xl text-neutral-600 mb-2">
            Thank you for your order. We've received your request and will process it shortly.
          </p>
          <p className="text-lg text-neutral-500 mb-8">
            A confirmation email will be sent to your email address with order details and tracking information.
          </p>

          <div className="bg-neutral-50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <Package className="text-primary mr-3" size={24} />
              <span className="text-sm font-medium text-neutral-700">Order Number</span>
            </div>
            <p className="text-2xl font-bold text-primary">{orderNumber}</p>
          </div>

          <div className="space-y-4 text-left mb-8">
            <div className="flex items-start">
              <Mail className="text-primary mr-3 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-neutral-900">Confirmation Email</p>
                <p className="text-sm text-neutral-600">
                  We've sent a confirmation email with your order details.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Package className="text-primary mr-3 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-neutral-900">What's Next?</p>
                <p className="text-sm text-neutral-600">
                  Our team will review your order and contact you within 24 hours to confirm details and arrange payment.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="px-8 py-4 bg-primary text-white rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center mx-auto"
          >
            <Home className="mr-2" size={20} />
            Return to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
