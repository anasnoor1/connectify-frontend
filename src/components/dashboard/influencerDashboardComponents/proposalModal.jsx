import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Loader from "../../../utills/loader";
import axiosInstance from "../../../utills/privateIntercept";
import { toast } from "react-toastify";

export default function ProposalModal({ isOpen, onClose, campaign }) {
  if (!isOpen) return null;

  const initialValues = {
    amount: "",
    deliveryTime: "",
    message: "",
  };

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .typeError("Amount must be a number")
      .positive("Amount must be greater than 0")
      .required("Amount is required"),
    deliveryTime: Yup.string()
      .matches(/^[0-9]+ ?(day|days|week|weeks)$/i, "Delivery time must be like '7 days' or '2 weeks'")
      .required("Delivery time is required"),
    message: Yup.string()
      .min(10, "Message must be at least 10 characters")
      .max(500, "Message cannot exceed 500 characters")
      .required("Message is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axiosInstance.post("/api/proposals", {
        campaignId: campaign._id,
        amount: values.amount,
        message: values.message,
        deliveryTime: values.deliveryTime,
      });
      toast.success("Proposal sent successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send proposal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-bold text-slate-900">
          Send Proposal to {campaign.name}
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-4 space-y-3">
              <div>
                <Field
                  type="number"
                  name="amount"
                  placeholder="Your proposed amount"
                  className="w-full border px-3 py-2 rounded-lg"
                />
                <ErrorMessage
                  name="amount"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div>
                <Field
                  type="text"
                  name="deliveryTime"
                  placeholder="Delivery time (e.g. 7 days)"
                  className="w-full border px-3 py-2 rounded-lg"
                />
                <ErrorMessage
                  name="deliveryTime"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div>
                <Field
                  as="textarea"
                  name="message"
                  placeholder="Write your proposal message..."
                  className="w-full border px-3 py-2 rounded-lg h-24"
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
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
                >
                  {isSubmitting ? "Sending..." : "Send Proposal"}
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