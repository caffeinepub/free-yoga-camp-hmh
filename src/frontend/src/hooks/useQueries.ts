import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Admission } from "../backend";
import { useActor } from "./useActor";

export function useGetAllAdmissions() {
  const { actor, isFetching } = useActor();
  return useQuery<Admission[]>({
    queryKey: ["admissions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAdmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTotalAdmissions() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["admissionCount"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getTotalAdmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitAdmission() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      fullName: string;
      mobile: string;
      dob: string;
      address: string;
      occupation: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.submitAdmission(
        data.fullName,
        data.mobile,
        data.dob,
        data.address,
        data.occupation,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
      queryClient.invalidateQueries({ queryKey: ["admissionCount"] });
    },
  });
}

export function useGetAttendanceByDate(date: string) {
  const { actor, isFetching } = useActor();
  return useQuery<bigint[]>({
    queryKey: ["attendance", date],
    queryFn: async () => {
      if (!actor || !date) return [];
      return actor.getAttendanceByDate(date);
    },
    enabled: !!actor && !isFetching && !!date,
  });
}

export function useGetAllAttendanceDates() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["attendanceDates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAttendanceDates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkAttendance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      admissionId,
      date,
    }: { admissionId: bigint; date: string }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.markAttendance(admissionId, date);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attendance", variables.date],
      });
      queryClient.invalidateQueries({ queryKey: ["attendanceDates"] });
    },
  });
}

export function useRemoveAttendance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      admissionId,
      date,
    }: { admissionId: bigint; date: string }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.removeAttendance(admissionId, date);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attendance", variables.date],
      });
      queryClient.invalidateQueries({ queryKey: ["attendanceDates"] });
    },
  });
}
