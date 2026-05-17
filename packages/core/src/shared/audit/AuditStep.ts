export type AuditStatus =
    | 'start'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';

export interface AuditEvent {
    id: string;
    step: string;
    status: AuditStatus;
    message: string;
    timestamp: string;
    durationMs?: number;
    data?: Record<string, unknown>;
    error?: unknown;
}

export type AuditFeedbackHandler =
    (event: AuditEvent) => void | Promise<void>;

export class AuditStep {

    static async run<T>(
        step: string,
        action: () => Promise<T>,
        options?: {
            data?: Record<string, unknown>;
            feedback?: AuditFeedbackHandler;
        }
    ): Promise<T> {

        const startedAt = Date.now();

        const eventId = crypto.randomUUID();

        const startEvent: AuditEvent = {
            id: eventId,
            step,
            status: 'start',
            message: `Starting step: ${step}`,
            timestamp: new Date().toISOString(),
            data: options?.data
        };

        console.info('[AUDIT]', startEvent);

        await options?.feedback?.(startEvent);

        try {

            const result = await action();

            const successEvent: AuditEvent = {
                id: eventId,
                step,
                status: 'success',
                message: `Step completed: ${step}`,
                timestamp: new Date().toISOString(),
                durationMs: Date.now() - startedAt,
                data: options?.data
            };

            console.info('[AUDIT]', successEvent);

            await options?.feedback?.(successEvent);

            return result;

        } catch (error) {

            const errorEvent: AuditEvent = {
                id: eventId,
                step,
                status: 'error',
                message: `Step failed: ${step}`,
                timestamp: new Date().toISOString(),
                durationMs: Date.now() - startedAt,
                data: options?.data,
                error
            };

            console.error('[AUDIT]', errorEvent);

            await options?.feedback?.(errorEvent);

            throw error;
        }
    }

    static async info(
        step: string,
        message: string,
        options?: {
            data?: Record<string, unknown>;
            feedback?: AuditFeedbackHandler;
        }
    ): Promise<void> {

        const event: AuditEvent = {
            id: crypto.randomUUID(),
            step,
            status: 'info',
            message,
            timestamp: new Date().toISOString(),
            data: options?.data
        };

        console.info('[AUDIT]', event);

        await options?.feedback?.(event);
    }

    static async warning(
        step: string,
        message: string,
        options?: {
            data?: Record<string, unknown>;
            feedback?: AuditFeedbackHandler;
        }
    ): Promise<void> {

        const event: AuditEvent = {
            id: crypto.randomUUID(),
            step,
            status: 'warning',
            message,
            timestamp: new Date().toISOString(),
            data: options?.data
        };

        console.warn('[AUDIT]', event);

        await options?.feedback?.(event);
    }
}
