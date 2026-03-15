import { Bell } from "lucide-react";
import { useActiveNotifications } from "../hooks/useQueries";

export default function NewsTicker() {
  const { data: notifications } = useActiveNotifications();

  if (!notifications || notifications.length === 0) return null;

  const tickerItems = notifications.slice(0, 5);

  return (
    <div className="bg-navy-800 border-b border-navy-700 py-1.5 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-0">
          {/* Label */}
          <div className="flex items-center gap-1.5 bg-saffron-500 text-navy-900 px-3 py-0.5 rounded-sm text-xs font-bold whitespace-nowrap flex-shrink-0 mr-3">
            <Bell className="w-3 h-3" />
            BREAKING
          </div>

          {/* Scrolling text */}
          <div className="overflow-hidden flex-1">
            <div className="ticker-animation whitespace-nowrap text-sm text-navy-100 flex items-center gap-8">
              {tickerItems.map((n) => (
                <a
                  key={n.id.toString()}
                  href={n.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="ticker.link"
                  className="hover:text-saffron-400 transition-colors inline-flex items-center gap-2"
                >
                  <span className="text-saffron-400">★</span>
                  {n.title}
                </a>
              ))}
              {/* Repeat for seamless loop */}
              {tickerItems.map((n) => (
                <a
                  key={`r-${n.id.toString()}`}
                  href={n.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-saffron-400 transition-colors inline-flex items-center gap-2"
                >
                  <span className="text-saffron-400">★</span>
                  {n.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
