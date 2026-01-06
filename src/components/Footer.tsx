import { Linkedin, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    "For Students": [
      { label: "Find a Tutor", href: "#" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Reviews", href: "#" },
    ],
    "For Tutors": [
      { label: "Become a Tutor", href: "#" },
      { label: "Teaching Guide", href: "#" },
      { label: "Earnings", href: "#pricing" },
      { label: "Assessment Info", href: "#" },
    ],
    Company: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#contact" },
    ],
    Legal: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Refund Policy", href: "#" },
      { label: "Community Guidelines", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
    { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
    { icon: <Instagram className="w-5 h-5" />, href: "#", label: "Instagram" },
    { icon: <Youtube className="w-5 h-5" />, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-accent text-accent-foreground pt-16 pb-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
              <span className="text-secondary text-2xl">▲</span>
              <span className="text-xl font-bold text-white">StudyShare</span>
            </a>
            <p className="text-white/70 mb-6 max-w-xs">
              India's first peer-to-peer tutoring platform where students teach and learn from each other.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-primary hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-white/60 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-center text-white/50 text-sm">
            © 2026 StudyShare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
