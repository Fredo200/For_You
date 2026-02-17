"use client";

import React, { useState } from 'react';

const CoffeeButton = ({ isDark }: { isDark: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => setIsOpen(!isOpen);

    const modalOverlayClass = "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300";

    const cardClass = isDark
        ? "relative w-full max-w-md rounded-3xl bg-indigo-950/80 p-8 border border-white/10 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300 text-white"
        : "relative w-full max-w-md rounded-3xl bg-white/80 p-8 border border-white/40 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300 text-slate-800";

    const closeBtnClass = isDark
        ? "absolute right-6 top-6 text-white/50 hover:text-white transition-colors"
        : "absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors";

    const mpesaTextClass = isDark ? "text-indigo-200" : "text-emerald-600";

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={toggleModal}
                className="fixed bottom-8 right-8 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 font-bold text-white shadow-xl transition-all hover:scale-110 hover:shadow-orange-500/40 active:scale-95 group"
            >
                <span className="text-2xl animate-bounce group-hover:animate-none">☕</span>
                <span className="hidden sm:inline">Support me</span>
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

                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-4xl">
                                    📲
                                </div>
                                <h2 className="text-2xl font-black">M-PESA Payment</h2>
                                <p className={`mt-2 ${isDark ? 'opacity-70' : 'text-slate-500'}`}>
                                    Support this app by sending a small donation.
                                </p>
                            </div>

                            <div className={`rounded-2xl p-6 ${isDark ? 'bg-white/5' : 'bg-slate-50 border border-slate-200 shadow-inner'}`}>
                                <ol className="list-decimal space-y-4 pl-4 text-sm font-medium">
                                    <li>Open M-PESA menu on your phone</li>
                                    <li>Select <b>Send Money</b></li>
                                    <li>Enter Phone Number: <span className={`${mpesaTextClass} font-bold text-lg`}>0113064584</span></li>
                                    <li>Enter Amount (e.g., 200 KES)</li>
                                    <li>Enter your PIN and complete</li>
                                </ol>
                            </div>

                            <p className={`text-center text-xs ${isDark ? 'opacity-50' : 'text-slate-400'}`}>
                                Your support means the world! 🌍 Thank you!
                            </p>

                            <button
                                onClick={toggleModal}
                                className={`w-full rounded-2xl py-4 font-bold transition-all ${isDark ? 'bg-white text-indigo-900 hover:bg-opacity-90' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20'}`}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CoffeeButton;
