import { Check } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const PricingSection = () => {
  const { ref, isInView } = useInView();

  return (
    <section id="pricing" className="py-20 bg-muted">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">
            No hidden fees. Pay only for sessions you complete.
          </p>
        </div>

        <div
          ref={ref}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {/* For Students */}
          <div
            className={`bg-card rounded-2xl p-8 border-2 border-primary/20 shadow-lg transition-all duration-500 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="text-center mb-6">
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                For Students
              </span>
              <h3 className="text-2xl font-bold text-foreground mb-2">Pay Per Session</h3>
              <div className="text-4xl font-bold text-primary">
                ₹100 – ₹500
              </div>
              <p className="text-muted-foreground mt-2">30-min sessions</p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "Unlimited chat with your tutor between sessions",
                "Session notes & resources saved in your account",
                "Free cancellation up to 2 hours before",
                "24/7 support",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <button className="btn-primary w-full">Browse Tutors</button>
          </div>

          {/* For Tutors */}
          <div
            className={`bg-card rounded-2xl p-8 border-2 border-secondary/20 shadow-lg transition-all duration-500 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <div className="text-center mb-6">
              <span className="inline-block px-4 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
                For Tutors
              </span>
              <h3 className="text-2xl font-bold text-foreground mb-2">Earn Per Session</h3>
              <div className="text-4xl font-bold text-secondary">
                ₹85 – ₹425
              </div>
              <p className="text-muted-foreground mt-2">After 15% platform fee</p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "15% platform commission (lowest in industry)",
                "Daily payouts to bank or wallet",
                "Reputation-based rate increases",
                "Bonuses for retention & referrals",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <button className="btn-secondary w-full">Apply as Tutor</button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-16 max-w-4xl mx-auto overflow-x-auto">
          <h3 className="text-2xl font-bold text-foreground text-center mb-6">How We Compare</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-accent text-accent-foreground">
                <th className="p-4 text-left rounded-tl-lg">Platform</th>
                <th className="p-4 text-center">Commission</th>
                <th className="p-4 text-center">Payout Frequency</th>
                <th className="p-4 text-center rounded-tr-lg">Training Fee</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-primary/10 border-b border-border">
                <td className="p-4 font-bold text-primary">StudyShare</td>
                <td className="p-4 text-center font-semibold text-primary">15%</td>
                <td className="p-4 text-center font-semibold text-primary">Daily</td>
                <td className="p-4 text-center font-semibold text-primary">Free</td>
              </tr>
              <tr className="bg-card border-b border-border">
                <td className="p-4 text-foreground">Vedantu</td>
                <td className="p-4 text-center text-muted-foreground">30-40%</td>
                <td className="p-4 text-center text-muted-foreground">Monthly</td>
                <td className="p-4 text-center text-muted-foreground">Varies</td>
              </tr>
              <tr className="bg-card border-b border-border">
                <td className="p-4 text-foreground">Unacademy</td>
                <td className="p-4 text-center text-muted-foreground">35-45%</td>
                <td className="p-4 text-center text-muted-foreground">Monthly</td>
                <td className="p-4 text-center text-muted-foreground">Required</td>
              </tr>
              <tr className="bg-card">
                <td className="p-4 text-foreground rounded-bl-lg">Preply</td>
                <td className="p-4 text-center text-muted-foreground">33%</td>
                <td className="p-4 text-center text-muted-foreground">Weekly</td>
                <td className="p-4 text-center text-muted-foreground rounded-br-lg">Free</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
