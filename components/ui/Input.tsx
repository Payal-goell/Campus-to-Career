"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, hint, leftIcon, rightIcon, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[var(--color-text-muted)]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            disabled={disabled}
            ref={ref}
            className={cn(
              "w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] transition-all duration-200 outline-none",
              "focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:bg-[var(--color-surface-raised)]",
              "hover:border-[var(--color-border-default)]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[var(--color-border-subtle)]",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-[var(--color-danger-border)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-[var(--color-text-muted)]">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-[var(--color-danger-text)] font-medium">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";
