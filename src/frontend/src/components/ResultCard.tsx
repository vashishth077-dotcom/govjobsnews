import { Button } from "@/components/ui/button";
import { Building2, Calendar, CheckCircle2, ExternalLink } from "lucide-react";
import type { Result } from "../backend.d";
import NewBadge from "./NewBadge";

export default function ResultCard({
  result,
  index,
}: { result: Result; index: number }) {
  return (
    <div
      data-ocid={`results.item.${index}`}
      className="card-hover bg-card border border-border rounded-lg p-4 flex flex-col gap-3"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <NewBadge postedDate={result.postedDate} />
          </div>
          <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2">
            {result.title}
          </h3>
        </div>
      </div>

      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-primary" />
          <span>{result.examBoard}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>
            Result Date:{" "}
            <span className="font-medium text-foreground">
              {result.resultDate}
            </span>
          </span>
        </div>
      </div>

      <div className="pt-1 border-t border-border">
        <a
          data-ocid={`results.check.button.${index}`}
          href={result.officialLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button
            size="sm"
            className="w-full text-xs h-7 bg-green-600 hover:bg-green-700 text-white gap-1"
          >
            Check Result <ExternalLink className="w-3 h-3" />
          </Button>
        </a>
      </div>
    </div>
  );
}
