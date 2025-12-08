import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from "../utills/privateIntercept";
import { toast } from "react-toastify";
import {
  resetPayment,
  paymentIntentLoading,
  paymentIntentReady,
  paymentStarted,
  paymentSucceeded,
  paymentFailed,
} from "../features/payment/paymentSlice";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

function ProposalPaymentForm({ proposalId, clientSecret, onPaymentCompleted }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);
    dispatch(paymentStarted());
    try {
      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        const message = error.message || "Payment failed";
        toast.error(message);
        dispatch(paymentFailed(message));
        setProcessing(false);
        return;
      }

      if (!paymentIntent || paymentIntent.status !== "succeeded") {
        const message = "Payment did not succeed";
        toast.error(message);
        dispatch(paymentFailed(message));
        setProcessing(false);
        return;
      }

      const confirmRes = await axiosInstance.post(`/api/proposals/${proposalId}/payment/confirm`, {
        paymentIntentId: paymentIntent.id,
      });

      const confirmedProposal = confirmRes.data?.data?.proposal;
      dispatch(paymentSucceeded({ paymentIntentId: paymentIntent.id }));
      if (onPaymentCompleted) {
        onPaymentCompleted(confirmedProposal);
      }
    } catch (err) {
      const msg = err.response?.data?.msg || err.message || "Payment confirmation failed";
      toast.error(msg);
      dispatch(paymentFailed(msg));
      setProcessing(false);
      return;
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="border rounded-md p-3 bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
              },
            },
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {processing ? "Processing..." : "Pay now"}
      </button>
    </form>
  );
}

export default function ProposalPayment() {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const paymentState = useSelector((state) => state.payment);

  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [creatingIntent, setCreatingIntent] = useState(false);

  useEffect(() => {
    dispatch(resetPayment());
    const fetchProposal = async () => {
      try {
        const res = await axiosInstance.get("/api/proposals/brand");
        const list = res.data?.data?.proposals || [];
        const found = list.find((p) => p._id === proposalId);
        if (!found) {
          toast.error("Proposal not found");
          navigate("/brand/proposals");
          return;
        }
        setProposal(found);
      } catch (err) {
        const msg = err.response?.data?.msg || err.message || "Failed to load proposal";
        toast.error(msg);
        navigate("/brand/proposals");
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [proposalId, navigate]);

  const handleCreatePaymentIntent = async () => {
    if (!proposal) return;
    setCreatingIntent(true);
    dispatch(paymentIntentLoading());
    try {
      const res = await axiosInstance.patch(`/api/proposals/${proposalId}/status`, { status: "accepted" });
      const updatedProposal = res.data?.data?.proposal;
      const stripeInfo = res.data?.data?.stripe;

      if (updatedProposal) {
        setProposal(updatedProposal);
      }

      if (!stripeInfo || !stripeInfo.clientSecret) {
        toast.error("Could not initialize payment");
        setCreatingIntent(false);
        dispatch(paymentFailed("Could not initialize payment"));
        return;
      }

      setClientSecret(stripeInfo.clientSecret);
      dispatch(paymentIntentReady());
      setCreatingIntent(false);
    } catch (err) {
      const msg = err.response?.data?.msg || err.message || "Failed to start payment";
      toast.error(msg);
      dispatch(paymentFailed(msg));
      setCreatingIntent(false);
    }
  };

  const handlePaymentCompleted = async (confirmedProposal) => {
    const proposalToUse = confirmedProposal || proposal;
    const campaignId = proposalToUse?.campaignId?._id || proposalToUse?.campaignId;
    const influencerId = proposalToUse?.influencerId?._id || proposalToUse?.influencerId;

    try {
      if (campaignId && influencerId) {
        const res = await axiosInstance.post("/api/chat/open", {
          campaignId,
          influencerId,
        });
        if (res.data?.success && res.data.room?._id) {
          toast.success("Payment successful. Chat opened.");
          navigate(`/chats/${res.data.room._id}`);
          return;
        }
      }
      toast.success("Payment successful.");
      navigate("/brand/proposals");
    } catch (err) {
      toast.success("Payment successful.");
      navigate("/brand/proposals");
    }
  };

  if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
          <p className="text-sm text-red-600">
            Stripe publishable key is not configured on the frontend. Set VITE_STRIPE_PUBLISHABLE_KEY in your
            frontend .env file.
          </p>
        </div>
      </div>
    );
  }

  if (loading || !proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const amount = proposal.amount;
  const numericAmount = typeof amount === "number" ? amount : Number(amount) || 0;
  const appFee = Number((numericAmount * 0.1).toFixed(2));
  const influencerAmount = Number((numericAmount - appFee).toFixed(2));
  const { status: paymentStatus, error: paymentError } = paymentState;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto mb-4">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <div className={`flex-1 flex items-center ${paymentStatus === 'idle' || paymentStatus === 'intent_loading' || paymentStatus === 'ready' ? 'text-indigo-600' : ''}`}>
            <span className={`w-6 h-6 flex items-center justify-center rounded-full border mr-2 ${paymentStatus === 'idle' || paymentStatus === 'intent_loading' || paymentStatus === 'ready' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300'}`}>1</span>
            Review
          </div>
          <div className={`flex-1 flex items-center justify-center ${clientSecret ? 'text-indigo-600' : ''}`}>
            <span className={`w-6 h-6 flex items-center justify-center rounded-full border mr-2 ${clientSecret ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300'}`}>2</span>
            Payment
          </div>
          <div className={`flex-1 flex items-center justify-end ${paymentStatus === 'success' ? 'text-green-600' : paymentStatus === 'failed' ? 'text-red-600' : ''}`}>
            <span className={`w-6 h-6 flex items-center justify-center rounded-full border mr-2 ${paymentStatus === 'success' ? 'bg-green-600 border-green-600 text-white' : paymentStatus === 'failed' ? 'bg-red-600 border-red-600 text-white' : 'border-gray-300'}`}>3</span>
            Status
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Pay for Proposal</h1>
        <p className="text-sm text-gray-600 mb-4">
          Complete payment to start chat with the influencer.
        </p>

        {paymentStatus === 'processing' && (
          <div className="mb-4 rounded-md bg-indigo-50 border border-indigo-100 px-3 py-2 text-xs text-indigo-700 flex items-center justify-between">
            <span>Processing your payment securely, please do not close this tab.</span>
            <span className="w-4 h-4 border-b-2 border-indigo-600 rounded-full animate-spin" />
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="mb-4 rounded-md bg-green-50 border border-green-100 px-3 py-2 text-xs text-green-700">
            Payment successful. You can now chat with the influencer.
          </div>
        )}

        {paymentStatus === 'failed' && paymentError && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">
            {paymentError}
          </div>
        )}

        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <div className="flex justify-between">
            <span>Campaign</span>
            <span className="font-medium">
              {proposal.campaignId?.title || "Campaign"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Influencer</span>
            <span className="font-medium">
              {proposal.influencerId?.name || "Influencer"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Amount</span>
            <span className="font-semibold">
              ${amount?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-gray-500 text-xs pt-1">
            <span>Platform fee (10%)</span>
            <span>${appFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-xs">
            <span>Influencer earnings</span>
            <span>${influencerAmount.toLocaleString()}</span>
          </div>
        </div>

        {!clientSecret ? (
          <button
            type="button"
            onClick={handleCreatePaymentIntent}
            disabled={creatingIntent}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {creatingIntent ? "Preparing payment..." : "Continue to payment"}
          </button>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <ProposalPaymentForm
              proposalId={proposalId}
              clientSecret={clientSecret}
              onPaymentCompleted={handlePaymentCompleted}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}
