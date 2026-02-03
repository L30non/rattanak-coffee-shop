/* eslint-disable @typescript-eslint/no-explicit-any */
// Error logging utility with Sentry integration support
type ErrorContext = {
  component?: string;
  userId?: string;
  action?: string;
  metadata?: Record<string, any>;
};

export class ErrorLogger {
  private static isSentryAvailable(): boolean {
    return typeof window !== "undefined" && !!(window as any).Sentry;
  }

  static logError(
    error: Error,
    context?: ErrorContext,
    severity: "error" | "warning" | "info" = "error",
  ): void {
    // Always log to console
    console.error(`[${severity.toUpperCase()}]`, error, context);

    // Send to Sentry if available
    if (this.isSentryAvailable()) {
      const Sentry = (window as any).Sentry;

      Sentry.captureException(error, {
        level: severity,
        tags: {
          component: context?.component,
          action: context?.action,
        },
        user: context?.userId ? { id: context.userId } : undefined,
        extra: context?.metadata,
      });
    }
  }

  static logMessage(
    message: string,
    level: "error" | "warning" | "info" | "debug" = "info",
    context?: ErrorContext,
  ): void {
    const logMethod =
      level === "warning" ? "warn" : level === "debug" ? "log" : level;
    console[logMethod](`[${level.toUpperCase()}]`, message, context);

    if (this.isSentryAvailable()) {
      const Sentry = (window as any).Sentry;

      Sentry.captureMessage(message, {
        level,
        tags: {
          component: context?.component,
          action: context?.action,
        },
        extra: context?.metadata,
      });
    }
  }

  static setUserContext(userId: string, email?: string, name?: string): void {
    if (this.isSentryAvailable()) {
      const Sentry = (window as any).Sentry;

      Sentry.setUser({
        id: userId,
        email,
        username: name,
      });
    }
  }

  static clearUserContext(): void {
    if (this.isSentryAvailable()) {
      const Sentry = (window as any).Sentry;
      Sentry.setUser(null);
    }
  }

  static addBreadcrumb(
    message: string,
    category?: string,
    data?: Record<string, any>,
  ): void {
    if (this.isSentryAvailable()) {
      const Sentry = (window as any).Sentry;

      Sentry.addBreadcrumb({
        message,
        category: category || "app",
        data,
        level: "info",
      });
    }
  }
}

// API error wrapper
export async function handleApiError<T>(
  apiCall: () => Promise<T>,
  context?: ErrorContext,
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    ErrorLogger.logError(
      error instanceof Error ? error : new Error(String(error)),
      context,
    );
    throw error;
  }
}

// Hook for error tracking in components
export function useErrorTracking(componentName: string) {
  const trackError = (error: Error, action?: string, metadata?: any) => {
    ErrorLogger.logError(error, {
      component: componentName,
      action,
      metadata,
    });
  };

  const trackAction = (action: string, metadata?: any) => {
    ErrorLogger.addBreadcrumb(
      `${componentName}: ${action}`,
      componentName,
      metadata,
    );
  };

  return { trackError, trackAction };
}
