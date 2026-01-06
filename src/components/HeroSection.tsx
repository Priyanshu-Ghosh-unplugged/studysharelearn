import { useEffect, useRef } from "react";

const HeroSection = () => {
  const illustrationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (illustrationRef.current) {
      illustrationRef.current.classList.add("animate-fade-in-up");
    }
  }, []);

  return (
    <section className="gradient-hero min-h-[90vh] flex items-center pt-24 pb-16 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-3 text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Learn from Students Like You.{" "}
              <span className="text-secondary">Earn While You Teach.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
              StudyShare is India's first peer-to-peer tutoring platform where high-performing 
              students teach part-time and get paid daily. No degrees required. Just genuine 
              passion for teaching.
            </p>

            <ul className="space-y-3 mb-10">
              {[
                { emoji: "💰", text: "Get paid daily—not monthly like other platforms" },
                { emoji: "📚", text: "15% commission (lowest in industry) + instant payouts" },
                { emoji: "⭐", text: "Earn ₹500–1,200/day with flexible hours" },
                { emoji: "🎓", text: "Quality-vetted through rigorous assessment gates" },
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-white/95">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-lg">{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button className="btn-primary text-lg px-8 py-4">
                Find a Tutor
              </button>
              <button className="btn-outline-white text-lg px-8 py-4">
                Become a Tutor
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 text-white/80 text-sm">
              {[
                "✓ 50,000+ Active Students",
                "✓ 5,000+ Verified Tutors",
                "✓ 200,000+ Sessions Completed",
              ].map((badge, index) => (
                <span key={index} className="flex items-center gap-2">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Right Illustration */}
          <div ref={illustrationRef} className="lg:col-span-2 opacity-0">
            <div className="relative">
              {/* Video call frame */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                {/* Top bar */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                
                {/* Avatars */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Student */}
                  <div className="bg-white/20 rounded-xl p-4 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-3xl mb-2">
                      👨‍🎓
                    </div>
                    <span className="text-white text-sm">Student</span>
                  </div>
                  
                  {/* Tutor */}
                  <div className="bg-white/20 rounded-xl p-4 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center text-3xl mb-2">
                      👩‍🏫
                    </div>
                    <span className="text-white text-sm">Tutor</span>
                  </div>
                </div>

                {/* Chat bubbles */}
                <div className="mt-4 space-y-2">
                  <div className="bg-primary/30 rounded-lg rounded-tl-none p-3 text-white text-sm max-w-[80%]">
                    Can you explain this problem?
                  </div>
                  <div className="bg-secondary/30 rounded-lg rounded-tr-none p-3 text-white text-sm max-w-[80%] ml-auto">
                    Of course! Let me show you...
                  </div>
                </div>

                {/* Coins */}
                <div className="absolute -right-4 top-1/2 animate-float">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-lg shadow-lg">
                    ₹
                  </div>
                </div>
                <div className="absolute -left-4 bottom-1/4 animate-float" style={{ animationDelay: "1s" }}>
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm shadow-lg">
                    ₹
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
