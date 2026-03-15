import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Job {
    id: bigint;
    title: string;
    postedDate: bigint;
    officialLink: string;
    vacancies: bigint;
    isActive: boolean;
    category: string;
    organization: string;
    department: string;
    lastDate: string;
    qualification: string;
}
export interface Result {
    id: bigint;
    title: string;
    postedDate: bigint;
    officialLink: string;
    isActive: boolean;
    examBoard: string;
    resultDate: string;
}
export interface AdmitCard {
    id: bigint;
    postedDate: bigint;
    downloadLink: string;
    isActive: boolean;
    examBoard: string;
    examDate: string;
    examName: string;
}
export interface UserProfile {
    name: string;
}
export interface Notification {
    id: bigint;
    title: string;
    date: string;
    postedDate: bigint;
    link: string;
    description: string;
    isActive: boolean;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAdmitCard(examName: string, examBoard: string, downloadLink: string, examDate: string): Promise<AdmitCard>;
    createJob(title: string, department: string, organization: string, qualification: string, vacancies: bigint, lastDate: string, category: string, officialLink: string): Promise<Job>;
    createNotification(title: string, description: string, date: string, link: string): Promise<Notification>;
    createResult(title: string, examBoard: string, resultDate: string, officialLink: string): Promise<Result>;
    deleteAdmitCard(id: bigint): Promise<void>;
    deleteJob(id: bigint): Promise<void>;
    deleteNotification(id: bigint): Promise<void>;
    deleteResult(id: bigint): Promise<void>;
    getActiveAdmitCards(): Promise<Array<AdmitCard>>;
    getActiveJobs(): Promise<Array<Job>>;
    getActiveNotifications(): Promise<Array<Notification>>;
    getActiveResults(): Promise<Array<Result>>;
    getAdmitCard(id: bigint): Promise<AdmitCard>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getJob(id: bigint): Promise<Job>;
    getNotification(id: bigint): Promise<Notification>;
    getResult(id: bigint): Promise<Result>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchJobsByCategory(category: string): Promise<Array<Job>>;
    searchJobsByKeyword(keyword: string): Promise<Array<Job>>;
    updateAdmitCard(id: bigint, examName: string, examBoard: string, downloadLink: string, examDate: string, isActive: boolean): Promise<AdmitCard>;
    updateJob(id: bigint, title: string, department: string, organization: string, qualification: string, vacancies: bigint, lastDate: string, category: string, officialLink: string, isActive: boolean): Promise<Job>;
    updateNotification(id: bigint, title: string, description: string, date: string, link: string, isActive: boolean): Promise<Notification>;
    updateResult(id: bigint, title: string, examBoard: string, resultDate: string, officialLink: string, isActive: boolean): Promise<Result>;
}
