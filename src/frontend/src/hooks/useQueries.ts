import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Admission } from "../backend.d";
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
      idProofType: string;
      address: string;
      idProofFileKey: string;
      email: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.submitAdmission(
        data.fullName,
        data.mobile,
        data.dob,
        data.idProofType,
        data.address,
        data.idProofFileKey,
        data.email,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
      queryClient.invalidateQueries({ queryKey: ["admissionCount"] });
    },
  });
}
