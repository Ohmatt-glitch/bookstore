"use client";

import React, { useState } from "react";
import { X, CreditCard, QrCode, CheckCircle2, ShieldCheck, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface CheckoutFlowProps {
  total: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ total, isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "qr">("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNext = () => {
    if (step === 2) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep(3);
        setTimeout(onSuccess, 3000);
      }, 2000);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-md"
        onClick={step === 3 ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        {step < 3 && (
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 z-10 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        )}

        <div className="p-8 sm:p-10">
          {/* Header */}
          {step < 3 && (
            <div className="mb-8">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600">
                <ShieldCheck className="h-4 w-4" />
                กระบวนการชำระเงินที่ปลอดภัย
              </div>
              <h2 className="text-2xl font-bold text-stone-900">
                {step === 1 ? "รายละเอียดการเรียกเก็บเงิน" : "วิธีการชำระเงิน"}
              </h2>
            </div>
          )}

          {/* Stepper */}
          {step < 3 && (
             <div className="mb-10 flex items-center gap-2">
                <div className={`h-2 flex-1 rounded-full ${step >= 1 ? "bg-indigo-600" : "bg-stone-200"}`} />
                <div className={`h-2 flex-1 rounded-full ${step >= 2 ? "bg-indigo-600" : "bg-stone-200"}`} />
                <div className={`h-2 flex-1 rounded-full ${step >= 3 ? "bg-indigo-600" : "bg-stone-200"}`} />
             </div>
          )}

          {/* Step 1: Info */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase">ชื่อ</label>
                  <input type="text" className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-indigo-500" placeholder="John" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase">นามสกุล</label>
                  <input type="text" className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-indigo-500" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500 uppercase">ที่อยู่อีเมล</label>
                <input type="email" className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-indigo-500" placeholder="john@example.com" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500 uppercase">ที่อยู่สำหรับจัดส่ง</label>
                <textarea className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-indigo-500" placeholder="123 Cozy Lane..." rows={2} />
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center justify-between rounded-2xl border-2 p-4 transition-all ${
                    paymentMethod === "card" ? "border-indigo-600 bg-indigo-50/50" : "border-stone-100 hover:border-stone-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                     <div className={`rounded-xl p-3 ${paymentMethod === "card" ? "bg-indigo-600 text-white" : "bg-stone-100 text-stone-400"}`}>
                        <CreditCard className="h-6 w-6" />
                     </div>
                     <div className="text-left">
                        <p className="font-bold text-stone-900">บัตรเครดิต</p>
                        <p className="text-xs text-stone-500">ชำระเงินอย่างปลอดภัยผ่าน Stripe</p>
                     </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 border-stone-200 flex items-center justify-center ${paymentMethod === "card" ? "border-indigo-600" : ""}`}>
                     {paymentMethod === "card" && <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />}
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("qr")}
                  className={`flex items-center justify-between rounded-2xl border-2 p-4 transition-all ${
                    paymentMethod === "qr" ? "border-indigo-600 bg-indigo-50/50" : "border-stone-100 hover:border-stone-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                     <div className={`rounded-xl p-3 ${paymentMethod === "qr" ? "bg-indigo-600 text-white" : "bg-stone-100 text-stone-400"}`}>
                        <QrCode className="h-6 w-6" />
                     </div>
                     <div className="text-left">
                        <p className="font-bold text-stone-900">โอนเงินผ่านคิวอาร์โค้ด</p>
                        <p className="text-xs text-stone-500">สแกนรหัสด้วยแอปธนาคาร</p>
                     </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 border-stone-200 flex items-center justify-center ${paymentMethod === "qr" ? "border-indigo-600" : ""}`}>
                     {paymentMethod === "qr" && <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />}
                  </div>
                </button>
              </div>

              {paymentMethod === "card" ? (
                <div className="space-y-3">
                   <input type="text" className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm" placeholder="หมายเลขบัตร" />
                   <div className="grid grid-cols-2 gap-4">
                      <input type="text" className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm" placeholder="MM/YY" />
                      <input type="text" className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm" placeholder="CVC" />
                   </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 bg-stone-50 rounded-2xl border border-stone-100 border-dashed">
                   <div className="h-32 w-32 bg-white rounded-xl shadow-lg border-2 border-stone-100 flex items-center justify-center mb-2">
                       <QrCode className="h-24 w-24 text-stone-800" />
                   </div>
                   <p className="text-xs text-stone-400 font-medium">สแกนเพื่อชำระเงิน ${total.toFixed(2)}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center text-center py-10 animate-in zoom-in-50 duration-500">
               <div className="mb-6 rounded-full bg-emerald-100 p-6 text-emerald-600">
                  <CheckCircle2 className="h-16 w-16" />
               </div>
               <h2 className="mb-2 text-3xl font-bold text-stone-900">การชำระเงินสำเร็จ!</h2>
               <p className="text-lg text-stone-500">
                  ขอบคุณสำหรับการสั่งซื้อ เราได้ส่งใบเสร็จไปที่อีเมลของคุณแล้ว
               </p>
               <p className="mt-8 text-sm text-stone-400">
                  กำลังกลับไปยังหน้าร้านหนังสือ...
               </p>
            </div>
          )}

          {/* Footer Actions */}
          {step < 3 && (
            <div className="mt-10 flex items-center justify-between pt-8 border-t border-stone-100">
               <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">ราคารวม</span>
                  <span className="text-2xl font-bold text-stone-950">${total.toFixed(2)}</span>
               </div>
               <div className="flex gap-2">
                  {step > 1 && (
                    <button 
                      onClick={handleBack}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-stone-500 hover:bg-stone-200 transition-all"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                  )}
                  <button 
                    onClick={handleNext}
                    disabled={isProcessing}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 hover:shadow-indigo-200 disabled:opacity-50"
                  >
                    {isProcessing ? (
                       <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        กำลังดำเนินการ...
                       </>
                    ) : (
                      <>
                        {step === 1 ? "ขั้นตอนถัดไป" : "ชำระเงินตอนนี้"}
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
