import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { AdmitCard, Job, Notification, Result } from "../backend.d";
import {
  useActiveAdmitCards,
  useActiveJobs,
  useActiveNotifications,
  useActiveResults,
  useCreateAdmitCard,
  useCreateJob,
  useCreateNotification,
  useCreateResult,
  useDeleteAdmitCard,
  useDeleteJob,
  useDeleteNotification,
  useDeleteResult,
  useUpdateAdmitCard,
  useUpdateJob,
  useUpdateNotification,
  useUpdateResult,
} from "../hooks/useQueries";

// ─── Jobs Admin ───────────────────────────────────────────────────────────────
function JobsAdmin() {
  const { data: jobs } = useActiveJobs();
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();

  const emptyForm = {
    title: "",
    department: "",
    organization: "",
    qualification: "",
    vacancies: "",
    lastDate: "",
    category: "",
    officialLink: "",
    isActive: true,
  };
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Job | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openAdd() {
    setEditItem(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(job: Job) {
    setEditItem(job);
    setForm({
      title: job.title,
      department: job.department,
      organization: job.organization,
      qualification: job.qualification,
      vacancies: job.vacancies.toString(),
      lastDate: job.lastDate,
      category: job.category,
      officialLink: job.officialLink,
      isActive: job.isActive,
    });
    setOpen(true);
  }

  async function handleSubmit() {
    try {
      if (editItem) {
        await updateJob.mutateAsync({
          id: editItem.id,
          title: form.title,
          department: form.department,
          organization: form.organization,
          qualification: form.qualification,
          vacancies: BigInt(form.vacancies || "0"),
          lastDate: form.lastDate,
          category: form.category,
          officialLink: form.officialLink,
          isActive: form.isActive,
        });
        toast.success("Job updated successfully");
      } else {
        await createJob.mutateAsync({
          title: form.title,
          department: form.department,
          organization: form.organization,
          qualification: form.qualification,
          vacancies: BigInt(form.vacancies || "0"),
          lastDate: form.lastDate,
          category: form.category,
          officialLink: form.officialLink,
        });
        toast.success("Job created successfully");
      }
      setOpen(false);
    } catch {
      toast.error("Failed to save job");
    }
  }

  async function handleDelete(id: bigint) {
    if (!confirm("Delete this job?")) return;
    try {
      await deleteJob.mutateAsync(id);
      toast.success("Job deleted");
    } catch {
      toast.error("Failed to delete job");
    }
  }

  const isPending = createJob.isPending || updateJob.isPending;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-foreground">
          Manage Jobs ({jobs?.length ?? 0})
        </h3>
        <Button
          data-ocid="admin.jobs.open_modal_button"
          size="sm"
          onClick={openAdd}
          className="gap-1"
        >
          <Plus className="w-4 h-4" /> Add Job
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table data-ocid="admin.jobs.table">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead className="hidden sm:table-cell">Last Date</TableHead>
              <TableHead className="hidden sm:table-cell">Vacancies</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(jobs || []).map((job, i) => (
              <TableRow
                key={job.id.toString()}
                data-ocid={`admin.jobs.row.${i + 1}`}
              >
                <TableCell className="font-medium text-sm max-w-[200px] truncate">
                  {job.title}
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {job.department}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm">
                  {job.lastDate}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm">
                  {job.vacancies.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      data-ocid={`admin.jobs.edit_button.${i + 1}`}
                      size="sm"
                      variant="ghost"
                      onClick={() => openEdit(job)}
                      className="h-7 w-7 p-0"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      data-ocid={`admin.jobs.delete_button.${i + 1}`}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(job.id)}
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          data-ocid="admin.jobs.dialog"
          className="max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Job" : "Add New Job"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label>Title</Label>
              <Input
                data-ocid="admin.jobs.input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Job title"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Department</Label>
                <Input
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                  placeholder="Department"
                />
              </div>
              <div>
                <Label>Organization</Label>
                <Input
                  value={form.organization}
                  onChange={(e) =>
                    setForm({ ...form, organization: e.target.value })
                  }
                  placeholder="Organization"
                />
              </div>
            </div>
            <div>
              <Label>Qualification</Label>
              <Input
                value={form.qualification}
                onChange={(e) =>
                  setForm({ ...form, qualification: e.target.value })
                }
                placeholder="Required qualification"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Vacancies</Label>
                <Input
                  type="number"
                  value={form.vacancies}
                  onChange={(e) =>
                    setForm({ ...form, vacancies: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Last Date</Label>
                <Input
                  type="date"
                  value={form.lastDate}
                  onChange={(e) =>
                    setForm({ ...form, lastDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Central Govt, Banking"
              />
            </div>
            <div>
              <Label>Official Link</Label>
              <Input
                value={form.officialLink}
                onChange={(e) =>
                  setForm({ ...form, officialLink: e.target.value })
                }
                placeholder="https://"
              />
            </div>
            {editItem && (
              <div className="flex items-center gap-2">
                <Switch
                  data-ocid="admin.jobs.switch"
                  checked={form.isActive}
                  onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                />
                <Label>Active</Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              data-ocid="admin.jobs.cancel_button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.jobs.submit_button"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Results Admin ────────────────────────────────────────────────────────────
function ResultsAdmin() {
  const { data: results } = useActiveResults();
  const createResult = useCreateResult();
  const updateResult = useUpdateResult();
  const deleteResult = useDeleteResult();

  const emptyForm = {
    title: "",
    examBoard: "",
    resultDate: "",
    officialLink: "",
    isActive: true,
  };
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Result | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openAdd() {
    setEditItem(null);
    setForm(emptyForm);
    setOpen(true);
  }
  function openEdit(r: Result) {
    setEditItem(r);
    setForm({
      title: r.title,
      examBoard: r.examBoard,
      resultDate: r.resultDate,
      officialLink: r.officialLink,
      isActive: r.isActive,
    });
    setOpen(true);
  }

  async function handleSubmit() {
    try {
      if (editItem) {
        await updateResult.mutateAsync({ id: editItem.id, ...form });
        toast.success("Result updated");
      } else {
        await createResult.mutateAsync({
          title: form.title,
          examBoard: form.examBoard,
          resultDate: form.resultDate,
          officialLink: form.officialLink,
        });
        toast.success("Result created");
      }
      setOpen(false);
    } catch {
      toast.error("Failed to save result");
    }
  }

  async function handleDelete(id: bigint) {
    if (!confirm("Delete this result?")) return;
    try {
      await deleteResult.mutateAsync(id);
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  const isPending = createResult.isPending || updateResult.isPending;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">
          Manage Results ({results?.length ?? 0})
        </h3>
        <Button
          data-ocid="admin.results.open_modal_button"
          size="sm"
          onClick={openAdd}
          className="gap-1"
        >
          <Plus className="w-4 h-4" /> Add Result
        </Button>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table data-ocid="admin.results.table">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Title</TableHead>
              <TableHead className="hidden sm:table-cell">Exam Board</TableHead>
              <TableHead className="hidden sm:table-cell">
                Result Date
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(results || []).map((r, i) => (
              <TableRow
                key={r.id.toString()}
                data-ocid={`admin.results.row.${i + 1}`}
              >
                <TableCell className="font-medium text-sm">{r.title}</TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                  {r.examBoard}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm">
                  {r.resultDate}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      data-ocid={`admin.results.edit_button.${i + 1}`}
                      size="sm"
                      variant="ghost"
                      onClick={() => openEdit(r)}
                      className="h-7 w-7 p-0"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      data-ocid={`admin.results.delete_button.${i + 1}`}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(r.id)}
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="admin.results.dialog" className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Result" : "Add Result"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label>Title</Label>
              <Input
                data-ocid="admin.results.input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Exam Board</Label>
              <Input
                value={form.examBoard}
                onChange={(e) =>
                  setForm({ ...form, examBoard: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Result Date</Label>
              <Input
                type="date"
                value={form.resultDate}
                onChange={(e) =>
                  setForm({ ...form, resultDate: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Official Link</Label>
              <Input
                value={form.officialLink}
                onChange={(e) =>
                  setForm({ ...form, officialLink: e.target.value })
                }
                placeholder="https://"
              />
            </div>
            {editItem && (
              <div className="flex items-center gap-2">
                <Switch
                  data-ocid="admin.results.switch"
                  checked={form.isActive}
                  onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                />
                <Label>Active</Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              data-ocid="admin.results.cancel_button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.results.submit_button"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Admit Cards Admin ────────────────────────────────────────────────────────
function AdmitCardsAdmin() {
  const { data: admitCards } = useActiveAdmitCards();
  const createAdmitCard = useCreateAdmitCard();
  const updateAdmitCard = useUpdateAdmitCard();
  const deleteAdmitCard = useDeleteAdmitCard();

  const emptyForm = {
    examName: "",
    examBoard: "",
    downloadLink: "",
    examDate: "",
    isActive: true,
  };
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<AdmitCard | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openAdd() {
    setEditItem(null);
    setForm(emptyForm);
    setOpen(true);
  }
  function openEdit(a: AdmitCard) {
    setEditItem(a);
    setForm({
      examName: a.examName,
      examBoard: a.examBoard,
      downloadLink: a.downloadLink,
      examDate: a.examDate,
      isActive: a.isActive,
    });
    setOpen(true);
  }

  async function handleSubmit() {
    try {
      if (editItem) {
        await updateAdmitCard.mutateAsync({ id: editItem.id, ...form });
        toast.success("Admit card updated");
      } else {
        await createAdmitCard.mutateAsync({
          examName: form.examName,
          examBoard: form.examBoard,
          downloadLink: form.downloadLink,
          examDate: form.examDate,
        });
        toast.success("Admit card created");
      }
      setOpen(false);
    } catch {
      toast.error("Failed to save");
    }
  }

  async function handleDelete(id: bigint) {
    if (!confirm("Delete this admit card?")) return;
    try {
      await deleteAdmitCard.mutateAsync(id);
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  const isPending = createAdmitCard.isPending || updateAdmitCard.isPending;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">
          Manage Admit Cards ({admitCards?.length ?? 0})
        </h3>
        <Button
          data-ocid="admin.admitcards.open_modal_button"
          size="sm"
          onClick={openAdd}
          className="gap-1"
        >
          <Plus className="w-4 h-4" /> Add Admit Card
        </Button>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table data-ocid="admin.admitcards.table">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Exam Name</TableHead>
              <TableHead className="hidden sm:table-cell">Exam Board</TableHead>
              <TableHead className="hidden sm:table-cell">Exam Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(admitCards || []).map((a, i) => (
              <TableRow
                key={a.id.toString()}
                data-ocid={`admin.admitcards.row.${i + 1}`}
              >
                <TableCell className="font-medium text-sm">
                  {a.examName}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                  {a.examBoard}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm">
                  {a.examDate}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      data-ocid={`admin.admitcards.edit_button.${i + 1}`}
                      size="sm"
                      variant="ghost"
                      onClick={() => openEdit(a)}
                      className="h-7 w-7 p-0"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      data-ocid={`admin.admitcards.delete_button.${i + 1}`}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(a.id)}
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="admin.admitcards.dialog" className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editItem ? "Edit Admit Card" : "Add Admit Card"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label>Exam Name</Label>
              <Input
                data-ocid="admin.admitcards.input"
                value={form.examName}
                onChange={(e) => setForm({ ...form, examName: e.target.value })}
              />
            </div>
            <div>
              <Label>Exam Board</Label>
              <Input
                value={form.examBoard}
                onChange={(e) =>
                  setForm({ ...form, examBoard: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Download Link</Label>
              <Input
                value={form.downloadLink}
                onChange={(e) =>
                  setForm({ ...form, downloadLink: e.target.value })
                }
                placeholder="https://"
              />
            </div>
            <div>
              <Label>Exam Date</Label>
              <Input
                type="date"
                value={form.examDate}
                onChange={(e) => setForm({ ...form, examDate: e.target.value })}
              />
            </div>
            {editItem && (
              <div className="flex items-center gap-2">
                <Switch
                  data-ocid="admin.admitcards.switch"
                  checked={form.isActive}
                  onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                />
                <Label>Active</Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              data-ocid="admin.admitcards.cancel_button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.admitcards.submit_button"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Notifications Admin ──────────────────────────────────────────────────────
function NotificationsAdmin() {
  const { data: notifications } = useActiveNotifications();
  const createNotification = useCreateNotification();
  const updateNotification = useUpdateNotification();
  const deleteNotification = useDeleteNotification();

  const emptyForm = {
    title: "",
    description: "",
    date: "",
    link: "",
    isActive: true,
  };
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Notification | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openAdd() {
    setEditItem(null);
    setForm(emptyForm);
    setOpen(true);
  }
  function openEdit(n: Notification) {
    setEditItem(n);
    setForm({
      title: n.title,
      description: n.description,
      date: n.date,
      link: n.link,
      isActive: n.isActive,
    });
    setOpen(true);
  }

  async function handleSubmit() {
    try {
      if (editItem) {
        await updateNotification.mutateAsync({ id: editItem.id, ...form });
        toast.success("Notification updated");
      } else {
        await createNotification.mutateAsync({
          title: form.title,
          description: form.description,
          date: form.date,
          link: form.link,
        });
        toast.success("Notification created");
      }
      setOpen(false);
    } catch {
      toast.error("Failed to save");
    }
  }

  async function handleDelete(id: bigint) {
    if (!confirm("Delete this notification?")) return;
    try {
      await deleteNotification.mutateAsync(id);
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  const isPending =
    createNotification.isPending || updateNotification.isPending;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">
          Manage Notifications ({notifications?.length ?? 0})
        </h3>
        <Button
          data-ocid="admin.notifications.open_modal_button"
          size="sm"
          onClick={openAdd}
          className="gap-1"
        >
          <Plus className="w-4 h-4" /> Add Notification
        </Button>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table data-ocid="admin.notifications.table">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Title</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(notifications || []).map((n, i) => (
              <TableRow
                key={n.id.toString()}
                data-ocid={`admin.notifications.row.${i + 1}`}
              >
                <TableCell className="font-medium text-sm">{n.title}</TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                  {n.date}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      data-ocid={`admin.notifications.edit_button.${i + 1}`}
                      size="sm"
                      variant="ghost"
                      onClick={() => openEdit(n)}
                      className="h-7 w-7 p-0"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      data-ocid={`admin.notifications.delete_button.${i + 1}`}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(n.id)}
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          data-ocid="admin.notifications.dialog"
          className="max-w-md"
        >
          <DialogHeader>
            <DialogTitle>
              {editItem ? "Edit Notification" : "Add Notification"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label>Title</Label>
              <Input
                data-ocid="admin.notifications.input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                data-ocid="admin.notifications.textarea"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <Label>Link</Label>
              <Input
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="https://"
              />
            </div>
            {editItem && (
              <div className="flex items-center gap-2">
                <Switch
                  data-ocid="admin.notifications.switch"
                  checked={form.isActive}
                  onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                />
                <Label>Active</Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              data-ocid="admin.notifications.cancel_button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.notifications.submit_button"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Admin Panel (main) ───────────────────────────────────────────────────────
export default function AdminPanel() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Admin Panel
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Manage all government job listings, results, admit cards, and
          notifications.
        </p>
      </div>

      <Tabs defaultValue="jobs">
        <TabsList data-ocid="admin.tab" className="mb-6">
          <TabsTrigger data-ocid="admin.jobs.tab" value="jobs">
            Jobs
          </TabsTrigger>
          <TabsTrigger data-ocid="admin.results.tab" value="results">
            Results
          </TabsTrigger>
          <TabsTrigger data-ocid="admin.admitcards.tab" value="admit-cards">
            Admit Cards
          </TabsTrigger>
          <TabsTrigger
            data-ocid="admin.notifications.tab"
            value="notifications"
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <JobsAdmin />
        </TabsContent>
        <TabsContent value="results">
          <ResultsAdmin />
        </TabsContent>
        <TabsContent value="admit-cards">
          <AdmitCardsAdmin />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsAdmin />
        </TabsContent>
      </Tabs>
    </main>
  );
}
