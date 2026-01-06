import { Shield, Wallet, Calendar, Lock, TrendingUp, Puzzle } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Rigorously Assessed Tutors",
    description: "Every tutor passes a 4-gate assessment covering subject mastery, teaching ability, and communication skills.",
  },
  {
    icon: <Wallet className="w-6 h-6" />,
    title: "Lowest Rates + Daily Pay",
    description: "15% platform commission (vs. 30–40% industry standard). Tutors get daily payouts, not monthly.",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Flexible Scheduling",
    description: "Book sessions whenever you need. Tutors set their own schedule—no fixed shifts.",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Safe & Secure",
    description: "Encrypted sessions, secure payments, verified profiles, and 24/7 support monitoring.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Proven Learning Outcomes",
    description: "Students report significant improvements in confidence and exam performance with peer-based learning.",
  },
  {
    icon: <Puzzle className="w-6 h-6" />,
    title: "Smart Tutor Matching",
    description: "Matching considers subject, learning style, ratings, and past performance.",
  },
];

const FeaturesSection = () => {
  const { ref, isInView } = useInView();

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">Why Students & Tutors Love StudyShare</h2>
          <p className="section-subtitle">
            Built for the modern learner and teacher, with features that matter.
          </p>
        </div>

        <div
          ref={ref}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card border transition-all duration-500 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="icon-circle">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
