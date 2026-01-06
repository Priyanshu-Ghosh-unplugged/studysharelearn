import { Search, Video, CheckCircle, ClipboardCheck, User, Star, TrendingUp } from "lucide-react";
import { useInView } from "@/hooks/useInView";

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const StepCard = ({ icon, title, description, delay }: StepCardProps) => {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`feature-card transition-all duration-500 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="icon-circle">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const HowItWorks = () => {
  const studentSteps = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Search & Book",
      description: "Browse verified tutors by subject, rating, and availability. Book instantly or send a request.",
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Learn Live Online",
      description: "Join 1-on-1 sessions via secure video. Use whiteboard, share files, and ask unlimited questions.",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Pay Only After Session",
      description: "No upfront fees. Pay only for sessions you complete via UPI, card, or wallet.",
    },
  ];

  const tutorSteps = [
    {
      icon: <ClipboardCheck className="w-6 h-6" />,
      title: "Pass Quality Assessment",
      description: "Complete 4 gates: Digital literacy, Subject mastery, Teaching demo, Live mock session.",
    },
    {
      icon: <User className="w-6 h-6" />,
      title: "Create Your Profile",
      description: "Add bio, subjects, and choose your rates (₹85–425 per session). Record a short intro video.",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Start Taking Sessions",
      description: "Students book your available slots. You teach live, they pay post-session.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Grow & Earn More",
      description: "High ratings unlock higher rates, featured placement, and bonuses.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-muted">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">How StudyShare Works</h2>
          <p className="section-subtitle">
            Get started in 3 simple steps for students, 4 for tutors.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* For Students */}
          <div id="for-students">
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                👨‍🎓
              </span>
              For Students
            </h3>
            <div className="grid gap-6">
              {studentSteps.map((step, index) => (
                <StepCard key={index} {...step} delay={index * 100} />
              ))}
            </div>
          </div>

          {/* For Tutors */}
          <div id="for-tutors">
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                👩‍🏫
              </span>
              For Tutors
            </h3>
            <div className="grid gap-6">
              {tutorSteps.map((step, index) => (
                <StepCard key={index} {...step} delay={index * 100} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
