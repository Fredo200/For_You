"use client";

import React, { useState } from 'react';
import { createCheckoutSession } from '@/app/actions';

const CoffeeButton = ({ isDark }: { isDark: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mpesaView, setMpesaView] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleModal = () => setIsOpen(!isOpen);

    const handleStripePayment = async () => {
        setLoading(true);
        try {
            const { url } = await createCheckoutSession();
            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error("Payment failed:", error);
            alert("Failed to initiate payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleMpesaClick = () => {
        setMpesaView(true);
    };

    const modalOverlayClass = "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300";

    const cardClass = isDark
        ? "relative w-full max-w-md rounded-3xl bg-indigo-950/80 p-8 border border-white/10 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300 text-white"
        : "relative w-full max-w-md rounded-3xl bg-white/80 p-8 border border-white/40 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300 text-slate-800";

    const closeBtnClass = isDark
        ? "absolute right-6 top-6 text-white/50 hover:text-white transition-colors"
        : "absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors";

    const paymentOptionClass = isDark
        ? "group flex w-full items-center gap-4 rounded-2xl bg-white/5 p-4 transition-all hover:bg-white/10 hover:scale-[1.02] border border-white/5"
        : "group flex w-full items-center gap-4 rounded-2xl bg-white/60 p-4 transition-all hover:bg-white/90 hover:scale-[1.02] border border-slate-200 shadow-sm";

    const mpesaTextClass = isDark ? "text-indigo-200" : "text-emerald-600";

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={toggleModal}
                className="fixed bottom-8 right-8 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 font-bold text-white shadow-xl transition-all hover:scale-110 hover:shadow-orange-500/40 active:scale-95 group"
            >
                <span className="text-2xl animate-bounce group-hover:animate-none">☕</span>
                <span className="hidden sm:inline">Buy me a coffee</span>
            </button>

            {/* Modal */}
            {isOpen && (
                <div className={modalOverlayClass} onClick={toggleModal}>
                    <div className={cardClass} onClick={(e) => e.stopPropagation()}>
                        <button onClick={toggleModal} className={closeBtnClass}>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {!mpesaView ? (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-4xl">
                                        ☕
                                    </div>
                                    <h2 className="text-2xl font-black">Support this App</h2>
                                    <p className={`mt-2 ${isDark ? 'opacity-70' : 'text-slate-500'}`}>
                                        If you enjoy using this weather app, consider buying me a coffee!
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={handleStripePayment}
                                        disabled={loading}
                                        className={paymentOptionClass}
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl">
                                            {loading ? "⌛" : "💳"}
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold">{loading ? "Processing..." : "Pay via Stripe"}</div>
                                            <div className={`text-xs ${isDark ? 'opacity-60' : 'text-slate-500'}`}>Cards, Apple Pay, Google Pay</div>
                                        </div>
                                        {!loading && (
                                            <div className="ml-auto opacity-0 transition-opacity group-hover:opacity-100">
                                                →
                                            </div>
                                        )}
                                    </button>

                                    <button onClick={handleMpesaClick} className={paymentOptionClass}>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
                                            📱
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold">Pay via M-PESA</div>
                                            <div className={`text-xs ${isDark ? 'opacity-60' : 'text-slate-500'}`}>Send money directly</div>
                                        </div>
                                        <div className="ml-auto opacity-0 transition-opacity group-hover:opacity-100">
                                            →
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <button
                                    onClick={() => setMpesaView(false)}
                                    className={`flex items-center gap-2 text-sm font-semibold ${isDark ? 'text-indigo-300' : 'text-blue-600'}`}
                                >
                                    ← Back
                                </button>
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-4xl">
                                        📲
                                    </div>
                                    <h2 className="text-2xl font-black">M-PESA Instructions</h2>
                                </div>

                                <div className={`rounded-2xl p-6 ${isDark ? 'bg-white/5' : 'bg-slate-50 border border-slate-200'}`}>
                                    <ol className="list-decimal space-y-4 pl-4 text-sm font-medium">
                                        <li>Open M-PESA menu on your phone</li>
                                        <li>Select <b>Lipa na M-PESA</b></li>
                                        <li>Select <b>Buy Goods and Services</b></li>
                                        <li>Enter Till Number: <span className={mpesaTextClass}>000000</span></li>
                                        <li>Enter Amount (e.g., 300 KES)</li>
                                        <li>Enter your PIN and complete</li>
                                    </ol>
                                </div>

                                <p className={`text-center text-xs ${isDark ? 'opacity-50' : 'text-slate-400'}`}>
                                    Thank you for your generosity! 🌍
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default CoffeeButton;
