import { CheckSquare } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
const footerLinks = {
  Product: [
    { label: "Features", path: "/features" },
    { label: "Templates", path: "/templates" },
    { label: "Pricing", path: "/pricing" },
    { label: "Integrations", path: "/integrations" },
  ],
  Company: [
    { label: "About", path: "/about" },
    { label: "Blog", path: "/blog" },
    { label: "Careers", path: "/careers" },
    { label: "Contact", path: "/contact" },
  ],
  Resources: [
    { label: "Help center", path: "/help" },
    { label: "Guides", path: "/guides" },
    { label: "Community", path: "/community" },
    { label: "Status", path: "/status" },
  ],
  Legal: [
    { label: "Privacy", path: "/privacy" },
    { label: "Terms", path: "/terms" },
    { label: "Security", path: "/security" },
  ],
};

const socialLinks = [
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FaGithub, href: "https://github.com", label: "GitHub" },
  { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <a href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                <CheckSquare className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-slate-900 tracking-tight">
                TaskPulse
              </span>
            </a>
            <p className="mt-3 text-sm text-slate-500 max-w-[220px]">
              Simple task management for teams that move fast.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold text-slate-900">
                {section}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.path}>
                    <a
                      href={link.path}
                      className="text-sm text-slate-500 hover:text-slate-900"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} TaskPulse. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="/privacy"
              className="text-xs text-slate-400 hover:text-slate-900"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-xs text-slate-400 hover:text-slate-900"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
