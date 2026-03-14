import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Admission {
    dob: string;
    fullName: string;
    submittedAt: bigint;
    address: string;
    mobile: string;
    occupation: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAdmission(id: bigint): Promise<Admission>;
    getAllAdmissions(): Promise<Array<Admission>>;
    getCallerUserRole(): Promise<UserRole>;
    getTotalAdmissions(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    submitAdmission(fullName: string, mobile: string, dob: string, address: string, occupation: string): Promise<void>;
    markAttendance(admissionId: bigint, date: string): Promise<void>;
    removeAttendance(admissionId: bigint, date: string): Promise<void>;
    getAttendanceByDate(date: string): Promise<Array<bigint>>;
    getAllAttendanceDates(): Promise<Array<string>>;
}
