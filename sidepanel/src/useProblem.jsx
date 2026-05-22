// src/hooks/useProblem.js
// Drop this hook into your React sidebar — it gives you live LeetCode problem data.

import { useState, useEffect, useCallback } from "react";

const isExtension = typeof chrome !== "undefined" && chrome.runtime?.id;

export function useProblem() {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProblem = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!isExtension) {
        // Dev mode: return mock data so you can work outside the extension
        setProblem({
          title: "Two Sum",
          slug: "two-sum",
          difficulty: "Easy",
          description:
            "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
          code: "var twoSum = function(nums, target) {\n  \n};",
          language: "JavaScript",
          url: "https://leetcode.com/problems/two-sum/",
        });
        setLoading(false);
        return;
      }

      // 1. Try storage first (fastest — already scraped by content script)
      const stored = await chrome.storage.local.get("currentProblem");
      if (stored.currentProblem) {
        setProblem(stored.currentProblem);
        setLoading(false);
      }

      // 2. Ask the active tab's content script for fresh data
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) return;

      chrome.tabs.sendMessage(tab.id, { type: "GET_PROBLEM" }, (response) => {
        if (chrome.runtime.lastError) {
          // Content script not ready yet — stored data is good enough
          return;
        }
        if (response) {
          setProblem(response);
          chrome.storage.local.set({ currentProblem: response });
        }
        setLoading(false);
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProblem();

    if (!isExtension) return;

    // Keep sidebar in sync when user navigates to a new problem
    const onStorageChange = (changes) => {
      if (changes.currentProblem?.newValue) {
        setProblem(changes.currentProblem.newValue);
      }
    };

    chrome.storage.onChanged.addListener(onStorageChange);
    return () => chrome.storage.onChanged.removeListener(onStorageChange);
  }, [fetchProblem]);

  return { problem, loading, error, refresh: fetchProblem };
}