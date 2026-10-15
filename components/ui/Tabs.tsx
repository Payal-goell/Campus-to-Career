"use client";

import React, { useState } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

/* ─── Composable Radix Tabs Exports ────────────────────────── */
export const TabsRoot = TabsPrimitive.Root;
export const TabsList = TabsPrimitive.List;
export const TabsTrigger = TabsPrimitive.Trigger;
export const TabsContent = TabsPrimitive.Content;

/* ─── High-Level Tabs with Sliding Indicator ──────────────── */
export interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {
  tabs?: TabItem[];
  variant?: "underline" | "pill" | "segment";
}

export function Tabs({ tabs, variant = "underline", className, children, ...props }: TabsProps) {
  const [activeTab, setActiveTab] = useState(props.defaultValue ?? tabs?.[0]?.value);

  // If used composably with child TabsList / TabsTrigger
  if (!tabs) {
    return (
      <TabsPrimitive.Root className={cn("w-full", className)} {...props}>
        {children}
      </TabsPrimitive.Root>
    );
  }

  return (
    <TabsPrimitive.Root
      className={cn("w-full", className)}
      onValueChange={(v) => {
        setActiveTab(v);
        props.onValueChange?.(v);
      }}
      {...props}
    >
      <TabsPrimitive.List
        className={cn(
          "flex",
          variant === "underline" && "border-b border-[var(--color-border-subtle)] gap-1",
          variant === "pill" && "gap-1 p-1 bg-[var(--color-surface-overlay)] rounded-xl w-fit",
          variant === "segment" && "grid bg-[var(--color-surface-overlay)] rounded-xl p-1"
        )}
        style={variant === "segment" ? { gridTemplateColumns: `repeat(${tabs.length}, 1fr)` } : undefined}
        aria-label="Navigation tabs"
      >
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "relative inline-flex items-center gap-2 font-semibold text-sm",
              "transition-colors duration-200 outline-none",
              "focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:rounded-lg",
              "disabled:pointer-events-none disabled:opacity-40",
              variant === "underline" && [
                "px-3 py-2.5 text-[var(--color-text-muted)]",
                "data-[state=active]:text-[var(--color-brand-primary)]",
                "hover:text-[var(--color-text-primary)]",
              ],
              (variant === "pill" || variant === "segment") && [
                "px-4 py-2 rounded-lg text-[var(--color-text-muted)]",
                "data-[state=active]:text-[var(--color-text-primary)]",
                "hover:text-[var(--color-text-primary)]",
                "justify-center",
              ]
            )}
          >
            {/* Sliding active indicator */}
            {activeTab === tab.value && (
              <motion.span
                layoutId={`tab-indicator-${props.defaultValue ?? "default"}`}
                className={cn(
                  "absolute inset-0 z-0",
                  variant === "underline" && "bottom-0 top-auto h-0.5 rounded-t-full bg-[var(--color-brand-primary)]",
                  (variant === "pill" || variant === "segment") &&
                    "bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border-subtle)]"
                )}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon && <span aria-hidden>{tab.icon}</span>}
              {tab.label}
              {tab.badge !== undefined && (
                <span className="bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                  {tab.badge}
                </span>
              )}
            </span>
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {children}
    </TabsPrimitive.Root>
  );
}
