import { useState } from "react";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error" | "loading">("idle");
  const [message, setMessage] = useState("");

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    // Store in database securely instead of localStorage
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.trim().toLowerCase() });

    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation - email already subscribed
        setStatus("success");
        setMessage("You're already subscribed! Thank you for your interest.");
      } else {
        setStatus("error");
        setMessage("Subscription failed. Please try again later.");
      }
    } else {
      setStatus("success");
      setMessage("Thank you for subscribing! You'll receive updates soon.");
      setEmail("");
    }

    // Reset after 5 seconds
    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 5000);
  };

  return (
    <section id="contact" className="py-16 bg-primary/10">
      <div className="container mx-auto max-w-2xl text-center">
        <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Get Exclusive Updates
        </h2>
        <p className="text-muted-foreground mb-8">
          Join students & tutors getting tips on learning, teaching, and earning.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-5 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={status === "loading"}
          />
          <button 
            type="submit" 
            className="btn-primary whitespace-nowrap"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {status !== "idle" && status !== "loading" && (
          <div
            className={`mt-4 flex items-center justify-center gap-2 ${
              status === "success" ? "text-green-600" : "text-red-500"
            }`}
          >
            {status === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
