import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Quick Navigation",
      links: [
        { name: "Home -  NTExam Platform", href: "/" },
        { name: "About  NTExam", href: "/about-us" },
        { name: "Exam Syllabus & Study Materials", href: "#syllabus" },
        { name: "Exam Calendar & Schedule", href: "#calendar" },
        { name: "Top Performers & Winners", href: "#achievers" },
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "#contact" },
        { name: "Help Center", href: "#help" },
        { name: "Student Portal", href: "#portal" },
        { name: "Payment Support", href: "#payment" },
        { name: "Technical Support", href: "#tech" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms & Conditions", href: "/terms-conditions" },
        { name: "Cancellation & Refund Policy", href: "/cancellation-refund" },
        { name: "Cookie Policy", href: "#cookies" },
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", color: "hover:text-blue-500" },
    { icon: Twitter, href: "#", color: "hover:text-blue-400" },
    { icon: Instagram, href: "#", color: "hover:text-pink-500" },
    { icon: Youtube, href: "#", color: "hover:text-red-500" }
  ];

  return (
    <footer className="bg-foreground text-white" itemScope itemType="https://schema.org/WPFooter">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2" itemScope itemType="https://schema.org/Organization">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-primary p-2 rounded-xl shadow-soft">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white" itemProp="name"> NTExam</h1>
                <p className="text-xs sm:text-sm text-white/80" itemProp="description">Navoday Talent Exam Platform</p>
              </div>
            </div>
            
            <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-4 max-w-md">
              India's premier online competitive exam platform empowering 50,000+ students across the nation. 
              Join us for comprehensive exam preparation, expert study materials, and academic excellence.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>noreply@ NTExam.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+919426060635</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>305, 3rd floor flamingo, Sargasan, Gandhinagar, Gujarat 382421</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`text-white/60 ${social.color} transition-colors duration-300 hover:scale-110 transform`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Stay Updated with Latest Exam News
              </h3>
              <p className="text-white/70 text-sm">
                Subscribe to our newsletter for exam updates, study tips, and exclusive content.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-primary focus:bg-white/20 transition-all duration-300"
              />
              <button className="bg-gradient-primary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-white/70 text-center md:text-left">
              © {currentYear} Navoday Talent Exam. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;