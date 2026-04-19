
/**
 * Тип для ошибки, которую возвращает твой Go-бэкенд через функцию sendError
 */
export interface BackendError {
    data: {
        message: string;
    };
    status: number;
}

/**
 * Type Guard для проверки, является ли ошибка ответом от нашего сервера
 */
export function isBackendError(error: unknown): error is BackendError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'data' in error &&
        typeof (error as any).data === 'object' &&
        typeof (error as any).data.message === 'string'
    );
}