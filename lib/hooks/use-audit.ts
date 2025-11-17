import { useQuery, useMutation } from '@tanstack/react-query';
import { auditApi, type AuditFilters } from '@/lib/api/audit';

export function useAuditLog(filters?: AuditFilters) {
  return useQuery({
    queryKey: ['audit', filters],
    queryFn: () => auditApi.list(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useAuditEntry(auditId: string) {
  return useQuery({
    queryKey: ['audit', auditId],
    queryFn: () => auditApi.get(auditId),
    enabled: !!auditId,
  });
}

export function useAuditExport() {
  return useMutation({
    mutationFn: (filters?: AuditFilters) => auditApi.export(filters),
  });
}
