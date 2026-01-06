import { useInView } from "@/hooks/useInView";
import { useEffect, useState } from "react";

interface StatProps {
  value: number;
  label: string;
  suffix?: string;
  isInView: boolean;
  delay: number;
}

const AnimatedStat = ({ value, label, suffix = "+", isInView, delay }: StatProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, isInView, delay]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 0)}k`;
    }
    return num.toLocaleString();
  };

  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
        {value === 4.8 ? count.toFixed(1) : formatNumber(count)}
        {suffix}
      </div>
      <div className="text-white/80 text-lg">{label}</div>
    </div>
  );
};

const stats = [
  { value: 50000, label: "Active Students", suffix: "+" },
  { value: 5000, label: "Verified Tutors", suffix: "+" },
  { value: 200000, label: "Sessions Completed", suffix: "+" },
  { value: 4.8, label: "Average Rating", suffix: "/5" },
];

const StatsSection = () => {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-20 gradient-stats">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
          StudyShare by the Numbers
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <AnimatedStat
              key={index}
              {...stat}
              isInView={isInView}
              delay={index * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
