import { useState } from "react";

const STATUS_IDLE = "idle";
const STATUS_PENDING = "pending";
const STATUS_LOADING = "loading";
const STATUS_SENDING = "sending";

const useStatus = () => {
  const [status, setStatus] = useState<string>(STATUS_IDLE);

  const setIdle = () => setStatus(STATUS_IDLE);
  const setLoading = () => setStatus(STATUS_LOADING);
  const setPending = () => setStatus(STATUS_PENDING);
  const setSending = () => setStatus(STATUS_SENDING);

  return {
    status,
    setIdle,
    setLoading,
    setPending,
    setSending,
  };
};

export default useStatus;
