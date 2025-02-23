import { AxiosResponse } from 'axios';
import { useApiLeases } from 'hooks/pims-api/useApiLeases';
import { useApiRequestWrapper } from 'hooks/pims-api/useApiRequestWrapper';
import { Api_Lease } from 'models/api/Lease';
import { UserOverrideCode } from 'models/api/UserOverrideCode';
import { useCallback } from 'react';

/**
 * hook that adds a lease.
 */
export const useAddLease = () => {
  const { postLease } = useApiLeases();

  const addLease = useApiRequestWrapper<
    (
      lease: Api_Lease,
      userOverrideCodes: UserOverrideCode[],
    ) => Promise<AxiosResponse<Api_Lease, any>>
  >({
    requestFunction: useCallback(
      async (lease: Api_Lease, userOverrideCodes: UserOverrideCode[] = []) =>
        await postLease(lease, userOverrideCodes),
      [postLease],
    ),
    requestName: 'addLease',
    throwError: true,
    skipErrorLogCodes: [409],
  });

  return { addLease };
};
