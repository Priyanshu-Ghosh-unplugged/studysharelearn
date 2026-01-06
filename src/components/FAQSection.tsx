import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is StudyShare safe for kids?",
    answer: "Absolutely. All tutors go through rigorous verification and assessment. Sessions are encrypted, and we have 24/7 monitoring. Parents can view session logs and receive progress updates.",
  },
  {
    question: "Do I need to pay upfront?",
    answer: "No! Students only pay after completing a session. There are no subscription fees or hidden charges. You pay only for the sessions you take.",
  },
  {
    question: "How do tutors get verified?",
    answer: "Every tutor passes our 4-gate assessment: Digital Literacy, Subject Mastery, Teaching Demo, and a Live Mock Session. Only 35-40% of applicants pass all gates.",
  },
  {
    question: "What subjects are available?",
    answer: "We cover all major subjects from Class 6-12 including Math, Science (Physics, Chemistry, Biology), English, Social Studies, Computer Science, and more. College-level subjects are also available.",
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer: "Yes. If you're not satisfied with a session, you can request a refund within 24 hours. We review each case and ensure fair resolution for both students and tutors.",
  },
  {
    question: "How much can tutors earn?",
    answer: "Tutors earn ₹85-425 per session (after our 15% commission). With 2-3 hours of teaching daily, tutors typically earn ₹500-1,200 per day. Top tutors earn even more with bonuses.",
  },
  {
    question: "What if my internet cuts during a session?",
    answer: "Sessions are automatically paused if connection drops. You can resume within 15 minutes without any additional charge. If the session can't continue, you're only charged for completed time.",
  },
  {
    question: "Is there a minimum number of sessions I must take or teach?",
    answer: "No minimums! Students can take sessions as needed, and tutors can set their own availability. Full flexibility on both sides.",
  },
  {
    question: "What if I don't pass the tutor assessment?",
    answer: "You can retake the assessment after 30 days. We provide feedback on areas to improve. Many successful tutors passed on their second or third attempt.",
  },
  {
    question: "How do daily payouts work for tutors?",
    answer: "Session earnings are processed by midnight and transferred to your bank account or wallet within 24 hours. No waiting for monthly cycles.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-muted">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="p-5 pt-0 text-muted-foreground">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
