import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AdmitCard, Job, Notification, Result } from "../backend.d";
import {
  sampleAdmitCards,
  sampleJobs,
  sampleNotifications,
  sampleResults,
} from "../data/sampleData";
import { useActor } from "./useActor";

export function useActiveJobs() {
  const { actor, isFetching } = useActor();
  return useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: async () => {
      if (!actor) return sampleJobs;
      const result = await actor.getActiveJobs();
      return result.length > 0 ? result : sampleJobs;
    },
    enabled: !isFetching,
    staleTime: 30_000,
  });
}

export function useActiveResults() {
  const { actor, isFetching } = useActor();
  return useQuery<Result[]>({
    queryKey: ["results"],
    queryFn: async () => {
      if (!actor) return sampleResults;
      const result = await actor.getActiveResults();
      return result.length > 0 ? result : sampleResults;
    },
    enabled: !isFetching,
    staleTime: 30_000,
  });
}

export function useActiveAdmitCards() {
  const { actor, isFetching } = useActor();
  return useQuery<AdmitCard[]>({
    queryKey: ["admitCards"],
    queryFn: async () => {
      if (!actor) return sampleAdmitCards;
      const result = await actor.getActiveAdmitCards();
      return result.length > 0 ? result : sampleAdmitCards;
    },
    enabled: !isFetching,
    staleTime: 30_000,
  });
}

export function useActiveNotifications() {
  const { actor, isFetching } = useActor();
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return sampleNotifications;
      const result = await actor.getActiveNotifications();
      return result.length > 0 ? result : sampleNotifications;
    },
    enabled: !isFetching,
    staleTime: 30_000,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !isFetching,
    staleTime: 60_000,
  });
}

export function useSearchJobs(keyword: string, category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Job[]>({
    queryKey: ["searchJobs", keyword, category],
    queryFn: async () => {
      if (!actor) {
        let results = sampleJobs;
        if (category && category !== "all") {
          results = results.filter((j) => j.category === category);
        }
        if (keyword) {
          const kw = keyword.toLowerCase();
          results = results.filter(
            (j) =>
              j.title.toLowerCase().includes(kw) ||
              j.department.toLowerCase().includes(kw) ||
              j.organization.toLowerCase().includes(kw),
          );
        }
        return results;
      }
      if (keyword) {
        return actor.searchJobsByKeyword(keyword);
      }
      if (category && category !== "all") {
        return actor.searchJobsByCategory(category);
      }
      return actor.getActiveJobs();
    },
    enabled: !isFetching,
    staleTime: 10_000,
  });
}

// Admin mutations
export function useCreateJob() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      department: string;
      organization: string;
      qualification: string;
      vacancies: bigint;
      lastDate: string;
      category: string;
      officialLink: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createJob(
        data.title,
        data.department,
        data.organization,
        data.qualification,
        data.vacancies,
        data.lastDate,
        data.category,
        data.officialLink,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useUpdateJob() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: bigint;
      title: string;
      department: string;
      organization: string;
      qualification: string;
      vacancies: bigint;
      lastDate: string;
      category: string;
      officialLink: string;
      isActive: boolean;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateJob(
        data.id,
        data.title,
        data.department,
        data.organization,
        data.qualification,
        data.vacancies,
        data.lastDate,
        data.category,
        data.officialLink,
        data.isActive,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useDeleteJob() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteJob(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useCreateResult() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      examBoard: string;
      resultDate: string;
      officialLink: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createResult(
        data.title,
        data.examBoard,
        data.resultDate,
        data.officialLink,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["results"] }),
  });
}

export function useUpdateResult() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: bigint;
      title: string;
      examBoard: string;
      resultDate: string;
      officialLink: string;
      isActive: boolean;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateResult(
        data.id,
        data.title,
        data.examBoard,
        data.resultDate,
        data.officialLink,
        data.isActive,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["results"] }),
  });
}

export function useDeleteResult() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteResult(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["results"] }),
  });
}

export function useCreateAdmitCard() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      examName: string;
      examBoard: string;
      downloadLink: string;
      examDate: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createAdmitCard(
        data.examName,
        data.examBoard,
        data.downloadLink,
        data.examDate,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admitCards"] }),
  });
}

export function useUpdateAdmitCard() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: bigint;
      examName: string;
      examBoard: string;
      downloadLink: string;
      examDate: string;
      isActive: boolean;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateAdmitCard(
        data.id,
        data.examName,
        data.examBoard,
        data.downloadLink,
        data.examDate,
        data.isActive,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admitCards"] }),
  });
}

export function useDeleteAdmitCard() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteAdmitCard(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admitCards"] }),
  });
}

export function useCreateNotification() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      description: string;
      date: string;
      link: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createNotification(
        data.title,
        data.description,
        data.date,
        data.link,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useUpdateNotification() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: bigint;
      title: string;
      description: string;
      date: string;
      link: string;
      isActive: boolean;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateNotification(
        data.id,
        data.title,
        data.description,
        data.date,
        data.link,
        data.isActive,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useDeleteNotification() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteNotification(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
