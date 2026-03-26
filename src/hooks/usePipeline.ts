"use client";

import { useState, useEffect, useCallback } from "react";
import type { PipelineItem, ActivityLogEntry } from "@/types";

const STORAGE_KEY = "coastisclear_pipeline";

export function usePipeline() {
  const [items, setItems] = useState<PipelineItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // Private browsing or storage unavailable
    }
    setLoaded(true);
  }, []);

  const save = useCallback((newItems: PipelineItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch {
      // Storage full
    }
  }, []);

  const addItem = useCallback(
    (item: PipelineItem) => {
      save([...items, item]);
    },
    [items, save]
  );

  const updateItem = useCallback(
    (id: string, updater: (item: PipelineItem) => PipelineItem) => {
      save(items.map((item) => (item.id === id ? updater(item) : item)));
    },
    [items, save]
  );

  const removeItem = useCallback(
    (id: string) => {
      save(items.filter((item) => item.id !== id));
    },
    [items, save]
  );

  const advanceStep = useCallback(
    (
      itemId: string,
      rightsType: "master" | "publishing",
      stepNumber: number
    ) => {
      updateItem(itemId, (item) => {
        const side = rightsType === "master" ? item.master : item.publishing;
        const newSteps = side.steps.map((s) =>
          s.stepNumber === stepNumber
            ? { ...s, completed: true, completedAt: new Date().toISOString(), completedBy: "you" }
            : s
        );
        const newLog: ActivityLogEntry = {
          action: `Step ${stepNumber} completed: ${side.steps[stepNumber]?.stepName}`,
          rightsType,
          stepNumber,
          performedBy: "you",
          performedAt: new Date().toISOString(),
        };

        return {
          ...item,
          [rightsType]: { ...side, steps: newSteps },
          activityLog: [...item.activityLog, newLog],
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [updateItem]
  );

  const updateSideStatus = useCallback(
    (
      itemId: string,
      rightsType: "master" | "publishing",
      status: string
    ) => {
      updateItem(itemId, (item) => {
        const side = rightsType === "master" ? item.master : item.publishing;
        const newLog: ActivityLogEntry = {
          action: `Status changed to: ${status}`,
          rightsType,
          performedBy: "you",
          performedAt: new Date().toISOString(),
        };
        return {
          ...item,
          [rightsType]: { ...side, status },
          activityLog: [...item.activityLog, newLog],
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [updateItem]
  );

  const setQuoteExpiration = useCallback(
    (itemId: string, expiration: string, amount?: string, terms?: string) => {
      updateItem(itemId, (item) => ({
        ...item,
        quoteExpiration: expiration,
        quoteAmount: amount,
        quoteTerms: terms,
        updatedAt: new Date().toISOString(),
      }));
    },
    [updateItem]
  );

  return {
    items,
    loaded,
    addItem,
    updateItem,
    removeItem,
    advanceStep,
    updateSideStatus,
    setQuoteExpiration,
  };
}
