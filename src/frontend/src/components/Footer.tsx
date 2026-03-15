import { ExternalLink } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-navy-900 text-navy-200">
      <div className="saffron-stripe h-1" />
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-display text-white font-bold text-lg mb-3">
              GovJobsNews
            </h3>
            <p className="text-sm text-navy-300 leading-relaxed">
              India's most trusted portal for government job notifications, exam
              results, admit cards, and official updates.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-1.5">
              {[
                { label: "Latest Jobs", href: "#jobs" },
                { label: "Exam Results", href: "#results" },
                { label: "Admit Cards", href: "#admit-cards" },
                { label: "Notifications", href: "#notifications" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    data-ocid="footer.link"
                    className="text-sm text-navy-300 hover:text-saffron-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Important Portals
            </h4>
            <ul className="space-y-1.5">
              {[
                { label: "UPSC", href: "https://upsc.gov.in" },
                { label: "SSC", href: "https://ssc.nic.in" },
                { label: "IBPS", href: "https://www.ibps.in" },
                {
                  label: "Railway Recruitment",
                  href: "https://www.rrbcdg.gov.in",
                },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="footer.link"
                    className="text-sm text-navy-300 hover:text-saffron-400 transition-colors flex items-center gap-1"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-navy-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-navy-400">
            © {year} GovJobsNews. All rights reserved. For official information,
            always refer to the respective government websites.
          </p>
          <a
            href={utm}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-navy-400 hover:text-saffron-400 transition-colors"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
