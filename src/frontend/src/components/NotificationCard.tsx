import { Bell, Calendar, ExternalLink } from "lucide-react";
import type { Notification } from "../backend.d";
import NewBadge from "./NewBadge";

export default function NotificationCard({
  notification,
  index,
}: { notification: Notification; index: number }) {
  return (
    <div
      data-ocid={`notifications.item.${index}`}
      className="card-hover bg-card border border-border rounded-lg p-4 flex flex-col gap-3"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-saffron-100 flex items-center justify-center flex-shrink-0">
          <Bell className="w-5 h-5 text-saffron-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <NewBadge postedDate={notification.postedDate} />
          </div>
          <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2">
            {notification.title}
          </h3>
        </div>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
        {notification.description}
      </p>

      <div className="flex items-center justify-between pt-1 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>{notification.date}</span>
        </div>
        {notification.link && (
          <a
            data-ocid={`notifications.read.button.${index}`}
            href={notification.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
          >
            Read More <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
