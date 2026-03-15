import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Calendar,
  ExternalLink,
  GraduationCap,
  Users,
} from "lucide-react";
import type { Job } from "../backend.d";
import NewBadge from "./NewBadge";

const categoryColors: Record<string, string> = {
  "Central Govt": "bg-navy-100 text-navy-700",
  UPSC: "bg-purple-100 text-purple-700",
  Railway: "bg-green-100 text-green-700",
  Banking: "bg-blue-100 text-blue-700",
  Medical: "bg-red-100 text-red-700",
  "State Govt": "bg-orange-100 text-orange-700",
  Defence: "bg-gray-100 text-gray-700",
  Teaching: "bg-yellow-100 text-yellow-700",
};

export default function JobCard({ job, index }: { job: Job; index: number }) {
  const colorClass =
    categoryColors[job.category] || "bg-secondary text-secondary-foreground";

  return (
    <div
      data-ocid={`jobs.item.${index}`}
      className="card-hover bg-card border border-border rounded-lg p-4 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <NewBadge postedDate={job.postedDate} />
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}
            >
              {job.category}
            </span>
          </div>
          <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2">
            {job.title}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="flex items-start gap-1.5">
          <Building2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary" />
          <span className="line-clamp-1">{job.department}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
          <span>{job.vacancies.toLocaleString()} Posts</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2">
          <GraduationCap className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
          <span className="line-clamp-1">{job.qualification}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs">
          <Calendar className="w-3.5 h-3.5 text-destructive" />
          <span className="text-destructive font-medium">
            Last Date: {job.lastDate}
          </span>
        </div>
        <a
          data-ocid={`jobs.apply.button.${index}`}
          href={job.officialLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="sm"
            className="text-xs h-7 bg-primary hover:bg-primary/90 text-primary-foreground gap-1"
          >
            Apply <ExternalLink className="w-3 h-3" />
          </Button>
        </a>
      </div>
    </div>
  );
}
