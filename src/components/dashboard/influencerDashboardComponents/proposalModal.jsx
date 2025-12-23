import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Loader from "../../../utills/loader";
import axiosInstance from "../../../utills/privateIntercept";
import { toast } from "react-toastify";

// Helper function to parse delivery time to days
function parseDeliveryTimeToDays(deliveryTime) {
  const match = deliveryTime.match(/^(\d+)\s*(day|days|week|weeks)$/i);
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();

  if (unit === 'day' || unit === 'days') {
    return value;
  } else if (unit === 'week' || unit === 'weeks') {
    return value * 7;
  }
  return null;
}

export default function ProposalModal({ isOpen, onClose, campaign }) {
  const [serverLockReason, setServerLockReason] = React.useState("");

  if (!isOpen || !campaign) return null;

  const statusValue = campaign?.status ? String(campaign.status).toLowerCase() : "";
  const isClosed = ["completed", "cancelled", "disputed"].includes(statusValue);
  const isFull = !!campaign?.isFull;
  const initialLockReason = isFull
    ? "This campaign is full and is no longer accepting proposals."
    : isClosed
      ? "This campaign is closed and is not accepting proposals."
      : statusValue && statusValue !== "active"
        ? "This campaign is not active and is not accepting proposals."
        : "";

  const lockReason = serverLockReason || initialLockReason;
  const isLocked = !!lockReason;

  const initialValues = {
    amount: "",
    deliveryTime: "",
    message: "",
  };

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .typeError("Amount must be a number")
      .positive("Amount must be greater than 0")
      .min(campaign?.budgetMin || 0, `Amount must be at least $${campaign?.budgetMin || 0}`)
      .max(campaign?.budgetMax || 20000, `Amount cannot exceed $${campaign?.budgetMax || 20000}`)
      .required("Amount is required"),
    deliveryTime: Yup.string()
      .matches(/^[0-9]+ ?(day|days|week|weeks)$/i, "Delivery time must be like '7 days' or '2 weeks'")
      .test('min-days', 'Delivery time must be at least 1 day', function (value) {
        if (!value) return false;
        const days = parseDeliveryTimeToDays(value);
        return days !== null && days >= 1;
      })
      .test('max-days', 'Delivery time cannot exceed 90 days (max 12 weeks)', function (value) {
        if (!value) return false;
        const days = parseDeliveryTimeToDays(value);
        return days !== null && days <= 90;
      })
      .required("Delivery time is required"),
    message: Yup.string()
      .min(10, "Message must be at least 10 characters")
      .max(500, "Message cannot exceed 500 characters")
      .required("Message is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!campaign?._id) {
      toast.error("Campaign not found");
      setSubmitting(false);
      return;
    }
    if (isLocked) {
      toast.error(lockReason);
      setSubmitting(false);
      return;
    }

    try {
      setServerLockReason("");
      await axiosInstance.post("/api/proposals", {
        campaignId: campaign._id,
        amount: values.amount,
        message: values.message,
        deliveryTime: values.deliveryTime,
      });

      toast.success("Proposal sent successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      const rawErrorMsg =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Failed to send proposal";

      const normalized =
        typeof rawErrorMsg === "string" ? rawErrorMsg.toLowerCase() : "";

      let errorMsg = rawErrorMsg;
      if (normalized.includes("no longer accepting proposals")) {
        errorMsg = "This campaign is full and is no longer accepting proposals.";
        setServerLockReason(errorMsg);
      } else if (normalized.includes("cannot send proposals")) {
        errorMsg = "This campaign is closed and is not accepting proposals.";
        setServerLockReason(errorMsg);
      }

      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-bold text-slate-900">
          Send Proposal for {campaign.title}
        </h2>

        {/* Budget Range Info */}
        <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
          <p className="text-sm text-indigo-900">
            <span className="font-semibold">Campaign Budget:</span> ${campaign.budgetMin?.toLocaleString()} - ${campaign.budgetMax?.toLocaleString()}
          </p>
          <p className="text-xs text-indigo-600 mt-1">
            Your proposed amount must be within this range
          </p>
        </div>

        {isLocked && (
          <div className="mt-3 p-3 rounded-lg border border-rose-100 bg-rose-50 text-sm text-rose-700">
            {lockReason}
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proposed Amount ($)
                </label>
                <Field
                  type="number"
                  name="amount"
                  placeholder={`Between $${campaign.budgetMin} - $${campaign.budgetMax}`}
                  disabled={isLocked || isSubmitting}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />

                <ErrorMessage
                  name="amount"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Time
                </label>
                <Field
                  type="text"
                  name="deliveryTime"
                  placeholder="e.g., 7 days or 2 weeks"
                  disabled={isLocked || isSubmitting}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />

                <ErrorMessage
                  name="deliveryTime"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Between 1-90 days (max 12 weeks). Examples: "7 days", "2 weeks"
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proposal Message
                </label>
                <Field
                  as="textarea"
                  name="message"
                  placeholder="Explain why you're the best fit for this campaign..."
                  disabled={isLocked || isSubmitting}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg h-24 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />

                <ErrorMessage
                  name="message"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || isLocked}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting
                    ? "Sending..."
                    : isLocked
                      ? (typeof lockReason === 'string' && lockReason.toLowerCase().includes('full')
                        ? "Campaign Full"
                        : "Campaign Closed")
                      : "Send Proposal"}
                </button>
              </div>

              {isSubmitting && <Loader />}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}