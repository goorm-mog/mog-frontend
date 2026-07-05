import { useEffect, useState } from 'react';

type UseSettlementCompletionParams = {
  initiallyCompleted: boolean;
  onCompleteRedirect: () => void;
};

type SettlementCompletedState = {
  initialValue: boolean;
  value: boolean;
};

function useSettlementCompletion({
  initiallyCompleted,
  onCompleteRedirect,
}: UseSettlementCompletionParams) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(3);
  const [settlementCompletedState, setSettlementCompletedState] =
    useState<SettlementCompletedState>({
      initialValue: initiallyCompleted,
      value: initiallyCompleted,
    });

  let isSettlementCompleted = settlementCompletedState.value;

  if (settlementCompletedState.initialValue !== initiallyCompleted) {
    isSettlementCompleted = initiallyCompleted;
    setSettlementCompletedState({
      initialValue: initiallyCompleted,
      value: initiallyCompleted,
    });
  }

  useEffect(() => {
    if (!isCompletionOpen) return undefined;

    const countdownId = window.setInterval(() => {
      setCountdownSeconds((seconds) => Math.max(1, seconds - 1));
    }, 1000);
    const redirectId = window.setTimeout(onCompleteRedirect, 3000);

    return () => {
      window.clearInterval(countdownId);
      window.clearTimeout(redirectId);
    };
  }, [isCompletionOpen, onCompleteRedirect]);

  const openSettlementConfirm = () => {
    if (isSettlementCompleted) return;

    setIsConfirmOpen(true);
  };

  const closeSettlementConfirm = () => {
    setIsConfirmOpen(false);
  };

  const completeSettlement = () => {
    setSettlementCompletedState((currentState) => ({
      ...currentState,
      value: true,
    }));
    setIsConfirmOpen(false);
    setCountdownSeconds(3);
    setIsCompletionOpen(true);
  };

  return {
    isConfirmOpen,
    isCompletionOpen,
    countdownSeconds,
    isSettlementCompleted,
    openSettlementConfirm,
    closeSettlementConfirm,
    completeSettlement,
  };
}

export default useSettlementCompletion;
