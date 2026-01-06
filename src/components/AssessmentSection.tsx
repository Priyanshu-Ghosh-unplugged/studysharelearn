import { useInView } from "@/hooks/useInView";
import { useEffect, useState } from "react";

const gates = [
  {
    number: 1,
    title: "Digital Literacy",
    duration: "5–10 min",
    description: "Checks platform proficiency, audio/video setup, whiteboard and file sharing basics.",
    passRate: 95,
  },
  {
    number: 2,
    title: "Subject Mastery",
    duration: "30–45 min",
    description: "Subject-specific tests aligned with NCERT/CBSE and exam standards.",
    passRate: 75,
  },
  {
    number: 3,
    title: "Teaching Demo",
    duration: "20–30 min",
    description: "Tutors submit a 10–15 minute demo lesson and answer teaching-scenario questions.",
    passRate: 68,
  },
  {
    number: 4,
    title: "Live Mock Session",
    duration: "30–40 min",
    description: "Tutors teach a mock session with an evaluator role-playing a student to test adaptability and clarity.",
    passRate: 40,
  },
];

interface AnimatedCounterProps {
  target: number;
  isInView: boolean;
  suffix?: string;
}

const AnimatedCounter = ({ target, isInView, suffix = "" }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target, isInView]);

  return <span>{count}{suffix}</span>;
};

const AssessmentSection = () => {
  const { ref, isInView } = useInView();

  return (
    <section className="py-20 gradient-assessment">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="section-title mb-6">Our Rigorous Quality Framework</h2>
            <p className="text-lg text-muted-foreground mb-8">
              How we ensure only the best tutors teach on StudyShare. Quality matters more than credentials.
            </p>

            <div className="space-y-6">
              {gates.map((gate, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                      {gate.number}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-foreground">{gate.title}</h3>
                        <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                          {gate.duration}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">{gate.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-foreground font-medium">
              Only about 35–40% of applicants pass all four gates, ensuring exceptional quality.
            </p>
          </div>

          {/* Right - Funnel Visualization */}
          <div ref={ref} className="flex justify-center">
            <div className="relative">
              {/* Funnel stages */}
              <div className="space-y-4">
                {[
                  { label: "Applicants", count: 100, width: "w-72" },
                  { label: "Pass Gate 1", count: 95, width: "w-64" },
                  { label: "Pass Gate 2", count: 75, width: "w-56" },
                  { label: "Pass Gate 3", count: 68, width: "w-48" },
                  { label: "Pass Gate 4", count: 40, width: "w-40" },
                ].map((stage, index) => (
                  <div
                    key={index}
                    className={`${stage.width} mx-auto bg-gradient-to-r from-primary to-primary/80 rounded-lg py-4 text-center text-primary-foreground transition-all duration-500 ${
                      isInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="text-2xl font-bold">
                      <AnimatedCounter target={stage.count} isInView={isInView} />
                    </div>
                    <div className="text-sm opacity-90">{stage.label}</div>
                  </div>
                ))}
              </div>

              {/* Connecting arrows */}
              <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full flex flex-col justify-around pointer-events-none -z-10">
                {[1, 2, 3, 4].map((i) => (
                  <svg key={i} className="w-8 h-8 text-primary/30" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4l-8 8h6v8h4v-8h6z" transform="rotate(180 12 12)" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssessmentSection;
