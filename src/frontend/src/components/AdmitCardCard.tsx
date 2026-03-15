import { Button } from "@/components/ui/button";
import { Building2, Calendar, CreditCard, Download } from "lucide-react";
import type { AdmitCard } from "../backend.d";
import NewBadge from "./NewBadge";

export default function AdmitCardCard({
  admitCard,
  index,
}: { admitCard: AdmitCard; index: number }) {
  return (
    <div
      data-ocid={`admitcards.item.${index}`}
      className="card-hover bg-card border border-border rounded-lg p-4 flex flex-col gap-3"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <CreditCard className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <NewBadge postedDate={admitCard.postedDate} />
          </div>
          <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2">
            {admitCard.examName}
          </h3>
        </div>
      </div>

      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-primary" />
          <span>{admitCard.examBoard}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>
            Exam Date:{" "}
            <span className="font-medium text-foreground">
              {admitCard.examDate}
            </span>
          </span>
        </div>
      </div>

      <div className="pt-1 border-t border-border">
        <a
          data-ocid={`admitcards.download.button.${index}`}
          href={admitCard.downloadLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button
            size="sm"
            className="w-full text-xs h-7 bg-blue-600 hover:bg-blue-700 text-white gap-1"
          >
            <Download className="w-3 h-3" /> Download Hall Ticket
          </Button>
        </a>
      </div>
    </div>
  );
}
