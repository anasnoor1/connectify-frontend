import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from "../utills/privateIntercept";
import { ArrowLeft, ShieldCheck, CreditCard, Sparkles, Smartphone, Wallet, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import {
  resetPayment,
  paymentIntentLoading,
  paymentIntentReady,
  paymentStarted,
  paymentSucceeded,
  paymentFailed,
} from "../features/payment/paymentSlice";

function PaymentMethodMark({ method, selected }) {
  const [imgOk, setImgOk] = useState(true);

  const lower = (method || "").toLowerCase();
  const isEasyPaisa = lower === "easypaisa";
  const isJazzCash = lower === "jazzcash";

  const iconClass = "w-4 h-4";
  const wrapperClass = `${selected ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"} flex items-center justify-center h-10 w-10 rounded-full overflow-hidden`;
  const logoWrapperClass = `${selected ? "border-indigo-600 ring-2 ring-indigo-600/20" : "border-slate-200"} flex items-center justify-center h-10 w-14 rounded-xl border bg-white overflow-hidden`;

  if (isEasyPaisa || isJazzCash) {
    const src = isEasyPaisa ? "/easypaisa.png" : "/jazzcash.png";
    return (
      <span className={logoWrapperClass}>
        {imgOk ? (
          <img
            src={src}
            alt={isEasyPaisa ? "EasyPaisa" : "JazzCash"}
            className="h-8 w-full object-contain px-2"
            onError={() => setImgOk(false)}
          />
        ) : isEasyPaisa ? (
          <Smartphone className={iconClass} />
        ) : (
          <Wallet className={iconClass} />
        )}
      </span>
    );
  }

  return (
    <span className={wrapperClass}>
      <CreditCard className={iconClass} />
    </span>
  );
}

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
        onPaymentCompleted(confirmedProposal, paymentIntent.id);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
          Card details
        </label>
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#0f172a",
                  "::placeholder": {
                    color: "#9ca3af",
                  },
                },
              },
            }}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <ShieldCheck className="w-4 h-4" />
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
  const [selectedMethod, setSelectedMethod] = useState("stripe");
  const stripeConfigured = !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const [pakStage, setPakStage] = useState("idle");
  const [pakOtp, setPakOtp] = useState("");
  const [pakResult, setPakResult] = useState(null);
  const [pakLoading, setPakLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [pendingRedirect, setPendingRedirect] = useState(null);
  const redirectingRef = useRef(false);

  useEffect(() => {
    if (!pendingRedirect || !pendingRedirect.path) return;
    const t = setTimeout(() => {
      navigate(pendingRedirect.path);
    }, pendingRedirect.delayMs || 1500);
    return () => clearTimeout(t);
  }, [pendingRedirect, navigate]);

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
      const res = await axiosInstance.patch(`/api/proposals/${proposalId}/status`, { status: "accepted", paymentMethod: selectedMethod });
      const updatedProposal = res.data?.data?.proposal;
      const stripeInfo = res.data?.data?.stripe;

      if (updatedProposal) {
        setProposal(updatedProposal);
      }

      if (selectedMethod === "stripe") {
        if (!stripeInfo || !stripeInfo.clientSecret) {
          toast.error("Could not initialize payment");
          setCreatingIntent(false);
          dispatch(paymentFailed("Could not initialize payment"));
          return;
        }
        setClientSecret(stripeInfo.clientSecret);
        dispatch(paymentIntentReady());
      } else {
        setPakStage("redirect");
        setTimeout(() => setPakStage("otp"), 2000);
        dispatch(paymentIntentReady());
      }
      setCreatingIntent(false);
    } catch (err) {
      const msg = err.response?.data?.msg || err.message || "Failed to start payment";
      toast.error(msg);
      dispatch(paymentFailed(msg));
      setCreatingIntent(false);
    }
  };

  const handlePakConfirm = async () => {
    setPakLoading(true);
    dispatch(paymentStarted());
    try {
      const res = await axiosInstance.post("/api/payment/pak-payment", {
        proposalId,
        method: selectedMethod,
      });
      const data = res.data?.data;
      setPakResult(data);
      setPakStage("result");
      if (res.data?.success) {
        dispatch(paymentSucceeded({}));
        setReceiptData({
          amount: data?.amount ?? proposal?.amount,
          method: data?.method || selectedMethod,
          transactionId: data?.transactionId,
          createdAt: data?.createdAt || new Date().toISOString(),
          proposal: data?.proposal || proposal,
        });
        completeAndNavigate(data?.proposal || proposal);
      } else {
        const msg = res.data?.message || "Payment failed";
        toast.error(msg);
        dispatch(paymentFailed(msg));
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to process payment";
      toast.error(msg);
      dispatch(paymentFailed(msg));
      setPakStage("result");
    } finally {
      setPakLoading(false);
    }
  };

  const completeAndNavigate = async (proposalToUse) => {
    if (redirectingRef.current) return;
    redirectingRef.current = true;
    const campaignId = proposalToUse?.campaignId?._id || proposalToUse?.campaignId;
    const influencerId = proposalToUse?.influencerId?._id || proposalToUse?.influencerId;

    try {
      setShowReceipt(false);
      if (campaignId && influencerId) {
        const res = await axiosInstance.post("/api/chat/open", {
          campaignId,
          influencerId,
        });
        if (res.data?.success && res.data.room?._id) {
          setPendingRedirect({
            path: `/chats/${res.data.room._id}`,
            label: "Payment successful. Opening chat…",
            delayMs: 1500,
          });
          return;
        }
      }
      setPendingRedirect({
        path: "/brand/proposals",
        label: "Payment successful. Redirecting you to proposals…",
        delayMs: 1500,
      });
    } catch (err) {
      setPendingRedirect({
        path: "/brand/proposals",
        label: "Payment successful. Redirecting you to proposals…",
        delayMs: 1500,
      });
    }
  };

  const handlePaymentCompleted = async (confirmedProposal, stripePaymentIntentId) => {
    const proposalToUse = confirmedProposal || proposal;
    setReceiptData({
      amount: proposalToUse?.amount,
      method: selectedMethod || "stripe",
      transactionId: stripePaymentIntentId || (pakResult && pakResult.transactionId) || "-",
      createdAt: new Date().toISOString(),
      proposal: proposalToUse,
    });
    completeAndNavigate(proposalToUse);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          type="button"
          onClick={() => navigate("/brand/proposals")}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to proposals
        </button>

        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-slate-100 px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold tracking-[0.25em] text-indigo-500 uppercase">Secure payment</p>
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Pay for proposal</h1>
                <p className="text-sm text-slate-600 max-w-xl">
                  Complete a one-time payment to start working with the influencer and open a dedicated chat room.
                </p>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] ${
                    paymentStatus === "idle" ||
                    paymentStatus === "intent_loading" ||
                    paymentStatus === "ready"
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-300 text-slate-500"
                  }`}
                >
                  1
                </div>
                <span
                  className={
                    paymentStatus === "idle" || paymentStatus === "intent_loading" || paymentStatus === "ready"
                      ? "text-indigo-600"
                      : "text-slate-500"
                  }
                >
                  Review
                </span>
              </div>

              <div className="flex-1 h-px bg-slate-200" />

              <div className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] ${
                    (clientSecret || (selectedMethod !== "stripe" && pakStage !== "idle")) ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 text-slate-500"
                  }`}
                >
                  2
                </div>
                <span className={(clientSecret || (selectedMethod !== "stripe" && pakStage !== "idle")) ? "text-indigo-600" : "text-slate-500"}>Payment</span>
              </div>

              <div className="flex-1 h-px bg-slate-200" />

              <div className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] ${
                    paymentStatus === "success"
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : paymentStatus === "failed"
                      ? "border-rose-600 bg-rose-600 text-white"
                      : "border-slate-300 text-slate-500"
                  }`}
                >
                  3
                </div>
                <span
                  className={
                    paymentStatus === "success"
                      ? "text-emerald-600"
                      : paymentStatus === "failed"
                      ? "text-rose-600"
                      : "text-slate-500"
                  }
                >
                  Status
                </span>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="mt-4 space-y-3">
            {paymentStatus === "processing" && (
              <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/80 px-3 py-2 text-[11px] text-indigo-800">
                <span>Processing your payment securely, please do not close this tab.</span>
                <span className="inline-flex h-4 w-4 items-center justify-center">
                  <span className="h-4 w-4 rounded-full border-b-2 border-indigo-600 animate-spin" />
                </span>
              </div>
            )}

            {paymentStatus === "success" && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/80 px-3 py-2 text-[11px] text-emerald-800">
                {pendingRedirect?.label || "Payment successful. Redirecting…"}
              </div>
            )}

            {paymentStatus === "failed" && paymentError && (
              <div className="rounded-xl border border-rose-100 bg-rose-50/80 px-3 py-2 text-[11px] text-rose-800">
                {paymentError}
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {/* Summary */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Campaign</p>
                    <p className="text-sm font-semibold text-slate-900 truncate max-w-[220px] sm:max-w-xs">
                      {proposal.campaignId?.title || "Campaign"}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-medium text-indigo-700">
                    <Sparkles className="mr-1.5 h-3 w-3" />
                    New collaboration
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-semibold">
                      {(proposal.influencerId?.name || "?").slice(0,1).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Influencer</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {proposal.influencerId?.name || "Influencer"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1 text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>Amount</span>
                    <span className="font-semibold">${amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Platform fee (10%)</span>
                    <span>${appFee.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Influencer earnings</span>
                    <span>${influencerAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  Your payment is processed securely via Stripe. Funds are only released to the influencer as per
                  the campaign terms.
                </p>
              </div>
            </div>

            {/* Payment column */}
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 sm:p-5 flex flex-col justify-between">
              <div>
                <div className="mb-3 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("stripe")}
                    className={`group flex flex-col items-center justify-center gap-1 rounded-xl border px-3 py-3 text-xs font-semibold transition ${
                      selectedMethod === "stripe" ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600/20 shadow-sm" : "border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-sm"
                    }`}
                  >
                    <PaymentMethodMark method="stripe" selected={selectedMethod === "stripe"} />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("easypaisa")}
                    className={`group flex flex-col items-center justify-center gap-1 rounded-xl border px-3 py-3 text-xs font-semibold transition ${
                      selectedMethod === "easypaisa" ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600/20 shadow-sm" : "border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-sm"
                    }`}
                  >
                    <PaymentMethodMark method="easypaisa" selected={selectedMethod === "easypaisa"} />
                    <span>EasyPaisa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("jazzcash")}
                    className={`group flex flex-col items-center justify-center gap-1 rounded-xl border px-3 py-3 text-xs font-semibold transition ${
                      selectedMethod === "jazzcash" ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600/20 shadow-sm" : "border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-sm"
                    }`}
                  >
                    <PaymentMethodMark method="jazzcash" selected={selectedMethod === "jazzcash"} />
                    <span>JazzCash</span>
                  </button>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  {selectedMethod === "stripe" ? (clientSecret ? "Enter your card details" : "Review & continue") : (pakStage === "otp" ? "Confirm payment" : "Review & continue")}
                </h3>

                {selectedMethod === "stripe" ? (
                  !clientSecret ? (
                    <div className="space-y-2">
                      {!stripeConfigured && (
                        <p className="text-[11px] text-rose-600">Stripe key missing. Please configure Stripe.</p>
                      )}
                      <button
                        type="button"
                        onClick={handleCreatePaymentIntent}
                        disabled={creatingIntent || !stripeConfigured}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <CreditCard className="w-4 h-4" />
                        {creatingIntent ? "Preparing payment..." : "Continue to payment"}
                      </button>
                    </div>
                  ) : (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <ProposalPaymentForm
                        proposalId={proposalId}
                        clientSecret={clientSecret}
                        onPaymentCompleted={handlePaymentCompleted}
                      />
                    </Elements>
                  )
                ) : (
                  <div className="space-y-3">
                    {pakStage === "idle" && (
                      <button
                        type="button"
                        onClick={handleCreatePaymentIntent}
                        disabled={creatingIntent}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {creatingIntent ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Smartphone className="w-4 h-4" />
                        )}
                        {creatingIntent ? "Preparing..." : "Continue to payment"}
                      </button>
                    )}

                    {pakStage === "redirect" && (
                      <div className="flex items-center justify-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/80 px-3 py-3 text-sm text-indigo-800 shadow-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <PaymentMethodMark method={selectedMethod} selected={true} />
                        Redirecting to {selectedMethod === "easypaisa" ? "EasyPaisa" : "JazzCash"}...
                      </div>
                    )}

                    {pakStage === "otp" && (
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-600">Enter OTP</label>
                        <input
                          type="text"
                          value={pakOtp}
                          onChange={(e) => setPakOtp(e.target.value)}
                          placeholder="123456"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base font-mono tracking-[0.6em] text-center placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={handlePakConfirm}
                          disabled={pakLoading}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {pakLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                          {pakLoading ? "Processing..." : "Confirm payment"}
                        </button>
                      </div>
                    )}

                    {pakStage === "result" && (
                      <div className="space-y-3">
                        {paymentStatus === "success" ? (
                          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/80 px-3 py-2 text-[11px] text-emerald-800">
                            <CheckCircle2 className="w-4 h-4" />
                            Payment successful
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50/80 px-3 py-2 text-[11px] text-rose-800">
                            <XCircle className="w-4 h-4" />
                            Payment failed
                          </div>
                        )}
                        <div className="rounded-2xl border border-slate-100 bg-white p-4 text-xs text-slate-700 divide-y divide-slate-200">
                          <div className="flex items-center justify-between py-1"><span>Amount</span><span className="font-semibold">${amount?.toLocaleString()}</span></div>
                          <div className="flex items-center justify-between py-1"><span>Method</span><span className="capitalize">{pakResult?.method || selectedMethod}</span></div>
                          <div className="flex items-center justify-between py-1"><span>Transaction ID</span><span className="font-mono text-[11px]">{pakResult?.transactionId || '-'}</span></div>
                          <div className="flex items-center justify-between py-1"><span>Date & time</span><span>{pakResult?.createdAt ? new Date(pakResult.createdAt).toLocaleString() : new Date().toLocaleString()}</span></div>
                        </div>
                        {paymentStatus === "success" ? (
                          <button
                            type="button"
                            onClick={() => handlePaymentCompleted(pakResult?.proposal || proposal)}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                          >
                            Continue
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => { setPakStage("otp"); setPakResult(null); dispatch(resetPayment()); }}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-900"
                          >
                            Try again
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="mt-4 text-[11px] text-center text-slate-400">
                We never store your full card details. All payments are handled by Stripe using encrypted
                connections.
              </p>
            </div>
          </div>
        </div>
      {showReceipt && receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowReceipt(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-semibold text-slate-900">Payment receipt</h4>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4 text-xs text-slate-700 divide-y divide-slate-200">
              <div className="flex items-center justify-between py-1"><span>Amount</span><span className="font-semibold">${receiptData.amount?.toLocaleString()}</span></div>
              <div className="flex items-center justify-between py-1">
                <span>Method</span>
                <span className="inline-flex items-center gap-2">
                  <PaymentMethodMark method={receiptData.method} selected={true} />
                  <span className="capitalize">{receiptData.method}</span>
                </span>
              </div>
              <div className="flex items-center justify-between py-1"><span>Transaction ID</span><span className="font-mono text-[11px]">{receiptData.transactionId}</span></div>
              <div className="flex items-center justify-between py-1"><span>Date & time</span><span>{new Date(receiptData.createdAt).toLocaleString()}</span></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowReceipt(false)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => { setShowReceipt(false); completeAndNavigate(receiptData.proposal || proposal); }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
