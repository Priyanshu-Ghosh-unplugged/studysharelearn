import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    quote: "Finally affordable tutoring! My tutor made calculus click in just two sessions. The peer-to-peer approach really works.",
    name: "Aarav Singh",
    role: "Student",
    city: "Indore, MP",
    initials: "AS",
    rating: 5,
  },
  {
    quote: "I earn around ₹800/day teaching 2–3 hours. Daily payouts are a game changer compared to waiting a whole month.",
    name: "Priya Sharma",
    role: "Tutor",
    city: "Delhi, NCR",
    initials: "PS",
    rating: 5,
  },
  {
    quote: "Here, tutors make me think instead of just memorize. It's a completely different learning experience.",
    name: "Rahul Patel",
    role: "Student",
    city: "Mumbai, MH",
    initials: "RP",
    rating: 5,
  },
  {
    quote: "The assessment was tough, but it means students trust the platform. Quality really matters here.",
    name: "Vikram Kumar",
    role: "Tutor",
    city: "Bangalore, KA",
    initials: "VK",
    rating: 5,
  },
  {
    quote: "No upfront payment let us try different tutors without risk. Found the perfect match for my daughter!",
    name: "Neha Gupta",
    role: "Parent",
    city: "Pune, MH",
    initials: "NG",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const itemsToShow = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 3 : typeof window !== 'undefined' && window.innerWidth >= 768 ? 2 : 1;

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < itemsToShow; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">Real Stories from Our Community</h2>
          <p className="section-subtitle">
            Hear from students and tutors who are thriving on StudyShare.
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Carousel */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getVisibleTestimonials().map((testimonial, index) => (
              <div
                key={`${currentIndex}-${index}`}
                className="bg-card rounded-2xl p-6 border border-border shadow-lg transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.city}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-card rounded-full shadow-lg flex items-center justify-center text-foreground hover:bg-muted transition-colors hidden md:flex"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-card rounded-full shadow-lg flex items-center justify-center text-foreground hover:bg-muted transition-colors hidden md:flex"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex ? "bg-primary w-8" : "bg-primary/30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
