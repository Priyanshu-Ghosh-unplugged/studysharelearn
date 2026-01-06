const CTASection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* For Students */}
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 md:p-10 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Find Your Perfect Tutor Today
            </h3>
            <p className="text-white/90 mb-6 text-lg">
              Browse 5,000+ verified tutors across all subjects.
            </p>
            <button className="bg-white text-primary font-semibold px-8 py-4 rounded-lg hover:bg-white/90 transition-colors">
              Get Started Free
            </button>
            <p className="text-white/70 text-sm mt-4">
              No credit card required. First session free.
            </p>
          </div>

          {/* For Tutors */}
          <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl p-8 md:p-10 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Earning?
            </h3>
            <p className="text-white/90 mb-6 text-lg">
              Pass our assessment and get paid daily.
            </p>
            <button className="bg-white text-secondary font-semibold px-8 py-4 rounded-lg hover:bg-white/90 transition-colors">
              Apply as a Tutor
            </button>
            <p className="text-white/70 text-sm mt-4">
              Takes 2–3 hours. No formal teaching experience required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
