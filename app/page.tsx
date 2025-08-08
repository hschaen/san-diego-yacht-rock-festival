"use client";

import Image from "next/image";
import HamburgerMenu from "@/components/hamburger-menu";
import { useState } from "react";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useHomePage, fallbackContent } from "@/lib/hooks/useContent";

export default function Home() {
  const { content } = useHomePage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Use fallback content if loading or no content
  const pageContent = content || fallbackContent.home;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (db) {
        // Check for duplicate registration
        const registrationsRef = collection(db, "registrations");
        
        // Query for existing registration with same name AND (same email OR same phone)
        const emailQuery = query(
          registrationsRef,
          where("name", "==", formData.name),
          where("email", "==", formData.email)
        );
        
        const phoneQuery = formData.phone ? query(
          registrationsRef,
          where("name", "==", formData.name),
          where("phone", "==", formData.phone)
        ) : null;
        
        const emailSnapshot = await getDocs(emailQuery);
        const phoneSnapshot = phoneQuery ? await getDocs(phoneQuery) : null;
        
        // Check if duplicate exists
        if (!emailSnapshot.empty || (phoneSnapshot && !phoneSnapshot.empty)) {
          alert("You're already registered! We'll notify you when tickets go on sale.");
          setFormData({ name: "", email: "", phone: "" });
          setIsSubmitting(false);
          return;
        }
        
        // No duplicate found, proceed with registration
        await addDoc(collection(db, "registrations"), {
          ...formData,
          timestamp: serverTimestamp(),
        });
        setSubmitSuccess(true);
        setFormData({ name: "", email: "", phone: "" });
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        throw new Error("Database not initialized");
      }
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("There was an error submitting your registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <HamburgerMenu />
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/Yacht Rock Festival bg@2x.jpg"
          alt="Yacht Rock Festival Background"
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-purple-900/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8">
        {/* Logo */}
        <div className="mt-8 sm:mt-12 mb-8">
          <Image
            src="/assets/Yacht Rock Festival logo.png"
            alt="Yacht Rock Festival Logo"
            width={400}
            height={160}
            className="w-64 sm:w-80 md:w-96 lg:w-[400px] h-auto"
            priority
          />
        </div>

        {/* Main Content */}
        <div className="w-full max-w-2xl mx-auto">
          {/* Headlines */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 mb-4 drop-shadow-lg">
              {pageContent.headline}
            </h1>
            <p className="text-xl sm:text-2xl text-cyan-300 mb-6 drop-shadow-lg">
              {pageContent.subheadline}
            </p>
            <p className="text-lg text-white/90 drop-shadow-lg">
              {pageContent.description}
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20">
            {submitSuccess ? (
              <div className="text-center py-8">
                <h3 className="text-2xl font-semibold text-cyan-300 mb-2">
                  {pageContent.successMessage.title}
                </h3>
                <p className="text-white">
                  {pageContent.successMessage.description}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                    {pageContent.formLabels?.name || 'Name'} <span className="text-white/60">(optional)</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={pageContent.formPlaceholders?.name || 'Captain Smooth'}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                    {pageContent.formLabels?.email || 'Email'} <span className="text-yellow-400">(required)</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={pageContent.formPlaceholders?.email || 'smooth@sailing.com'}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-white text-sm font-medium mb-2">
                    {pageContent.formLabels?.phone || 'Cell Number 📱'} <span className="text-white/60">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={pageContent.formPlaceholders?.phone || '(619) 555-YACHT'}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  />
                  <p className="text-cyan-300 text-sm mt-2">
                    📱 Get SMS-only surprises and early access alerts!
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-purple-900 font-bold py-4 px-6 rounded-lg text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isSubmitting ? "Setting Sail..." : pageContent.submitButton}
                </button>

                {/* Trust Boosters */}
                <div className="text-center space-y-2 pt-4">
                  {pageContent.trustBuilders?.map((text, index) => (
                    <p key={index} className="text-white/80 text-sm">
                      {text}
                    </p>
                  ))}
                </div>
              </form>
            )}
          </div>

          {/* Event Details */}
          <div className="text-center mt-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 drop-shadow-lg">
              {pageContent.eventDetails?.date} • {pageContent.eventDetails?.time}
            </h2>
            <p className="text-white text-lg font-semibold drop-shadow-lg">
              {pageContent.eventDetails?.venue}
            </p>
            <p className="text-cyan-200 text-sm drop-shadow-lg">
              {pageContent.eventDetails?.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}