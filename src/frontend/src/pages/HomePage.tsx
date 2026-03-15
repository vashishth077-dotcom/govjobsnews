import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Briefcase, CreditCard, FileText, Search } from "lucide-react";
import { useState } from "react";
import AdmitCardCard from "../components/AdmitCardCard";
import JobCard from "../components/JobCard";
import NewsTicker from "../components/NewsTicker";
import NotificationCard from "../components/NotificationCard";
import ResultCard from "../components/ResultCard";
import {
  useActiveAdmitCards,
  useActiveJobs,
  useActiveNotifications,
  useActiveResults,
  useSearchJobs,
} from "../hooks/useQueries";

const categories = [
  "all",
  "Central Govt",
  "UPSC",
  "Railway",
  "Banking",
  "Medical",
  "State Govt",
  "Defence",
  "Teaching",
];

const SKELETON_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6"];

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {SKELETON_KEYS.map((k) => (
        <div
          key={k}
          className="bg-card border border-border rounded-lg p-4 space-y-3"
          data-ocid="jobs.loading_state"
        >
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-7 w-24" />
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("jobs");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [appliedCategory, setAppliedCategory] = useState("all");

  const { data: jobs, isLoading: jobsLoading } = useActiveJobs();
  const { data: results, isLoading: resultsLoading } = useActiveResults();
  const { data: admitCards, isLoading: admitCardsLoading } =
    useActiveAdmitCards();
  const { data: notifications, isLoading: notificationsLoading } =
    useActiveNotifications();
  const { data: searchedJobs, isLoading: searchLoading } = useSearchJobs(
    appliedKeyword,
    appliedCategory,
  );

  const isSearchActive = appliedKeyword !== "" || appliedCategory !== "all";
  const displayJobs = isSearchActive ? searchedJobs || [] : jobs || [];

  function handleSearch() {
    setAppliedKeyword(searchKeyword);
    setAppliedCategory(searchCategory);
    setActiveTab("jobs");
  }

  function handleClear() {
    setSearchKeyword("");
    setSearchCategory("all");
    setAppliedKeyword("");
    setAppliedCategory("all");
  }

  return (
    <main>
      <NewsTicker />

      {/* Hero */}
      <section className="gov-header-bg py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <p className="text-saffron-400 text-sm font-medium mb-2 uppercase tracking-wider">
              Official Government Portal
            </p>
            <h1 className="font-display text-3xl md:text-4xl text-white font-bold mb-3 leading-tight">
              India's Trusted Source for
              <span className="text-saffron-400"> Government Jobs</span>
            </h1>
            <p className="text-navy-200 text-base mb-6">
              Latest job notifications, exam results, admit cards, and official
              updates from SSC, UPSC, Railways, Banking, and more.
            </p>

            {/* Search */}
            <div className="bg-white rounded-lg p-3 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-ocid="search.input"
                  placeholder="Search jobs, exams, departments..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-9 border-0 shadow-none focus-visible:ring-0 bg-transparent"
                />
              </div>
              <Select value={searchCategory} onValueChange={setSearchCategory}>
                <SelectTrigger
                  data-ocid="search.select"
                  className="w-full sm:w-40 border-0 border-l border-border rounded-none bg-transparent shadow-none"
                >
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                type="button"
                data-ocid="search.submit_button"
                onClick={handleSearch}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-saffron-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-saffron-600">
            {[
              { label: "Active Jobs", value: jobs?.length || "—" },
              { label: "Results", value: results?.length || "—" },
              { label: "Admit Cards", value: admitCards?.length || "—" },
              { label: "Notifications", value: notifications?.length || "—" },
            ].map((stat) => (
              <div key={stat.label} className="py-3 px-4 text-center">
                <div className="text-2xl font-display font-bold text-navy-900">
                  {stat.value}
                </div>
                <div className="text-xs text-navy-700 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <TabsList className="bg-secondary" data-ocid="main.tab">
              <TabsTrigger
                value="jobs"
                data-ocid="jobs.tab"
                className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Briefcase className="w-4 h-4" />
                <span className="hidden sm:inline">Latest</span> Jobs
              </TabsTrigger>
              <TabsTrigger
                value="results"
                data-ocid="results.tab"
                className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <FileText className="w-4 h-4" />
                Results
              </TabsTrigger>
              <TabsTrigger
                value="admit-cards"
                data-ocid="admitcards.tab"
                className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <CreditCard className="w-4 h-4" />
                Admit Cards
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                data-ocid="notifications.tab"
                className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Bell className="w-4 h-4" />
                Alerts
              </TabsTrigger>
            </TabsList>

            {isSearchActive && (
              <button
                type="button"
                data-ocid="search.cancel_button"
                onClick={handleClear}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Clear search filters
              </button>
            )}
          </div>

          <TabsContent value="jobs" id="jobs">
            {isSearchActive && (
              <div className="mb-4 text-sm text-muted-foreground">
                Showing results for:{" "}
                <span className="font-medium text-foreground">
                  {appliedKeyword || appliedCategory !== "all"
                    ? `"${appliedKeyword}" in ${appliedCategory === "all" ? "all categories" : appliedCategory}`
                    : ""}
                </span>
              </div>
            )}
            {jobsLoading || searchLoading ? (
              <LoadingSkeleton />
            ) : displayJobs.length === 0 ? (
              <div
                data-ocid="jobs.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No jobs found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayJobs.map((job, i) => (
                  <JobCard key={job.id.toString()} job={job} index={i + 1} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" id="results">
            {resultsLoading ? (
              <LoadingSkeleton />
            ) : !results || results.length === 0 ? (
              <div
                data-ocid="results.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No results available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((result, i) => (
                  <ResultCard
                    key={result.id.toString()}
                    result={result}
                    index={i + 1}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="admit-cards" id="admit-cards">
            {admitCardsLoading ? (
              <LoadingSkeleton />
            ) : !admitCards || admitCards.length === 0 ? (
              <div
                data-ocid="admitcards.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No admit cards available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {admitCards.map((card, i) => (
                  <AdmitCardCard
                    key={card.id.toString()}
                    admitCard={card}
                    index={i + 1}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="notifications" id="notifications">
            {notificationsLoading ? (
              <LoadingSkeleton />
            ) : !notifications || notifications.length === 0 ? (
              <div
                data-ocid="notifications.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No notifications available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {notifications.map((notif, i) => (
                  <NotificationCard
                    key={notif.id.toString()}
                    notification={notif}
                    index={i + 1}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
