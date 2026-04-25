import { baseApi } from '@/shared/api/baseApi';
import { Task, TaskFilter } from '../model/types';

interface UpdateTaskBody {
    title?: string;
    description?: string;
    scheduledAt?: string | null;
    status?: Task['status'];
}

export const tasksApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTasks: builder.query<Task[], TaskFilter | void>({
            query: (filter) => ({
                url: '/tasks/',
                params: filter && filter !== 'all' ? { status: filter } : undefined,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Task' as const, id })),
                        { type: 'Task', id: 'LIST' },
                    ]
                    : [{ type: 'Task', id: 'LIST' }],
        }),
        completeTask: builder.mutation<Task, number>({
            query: (id) => ({ url: `/tasks/${id}/complete`, method: 'PATCH' }),
            invalidatesTags: (_r, _e, id) => [{ type: 'Task', id }, { type: 'Task', id: 'LIST' }],
        }),
        updateTask: builder.mutation<Task, { id: number; body: UpdateTaskBody }>({
            query: ({ id, body }) => ({ url: `/tasks/${id}`, method: 'PATCH', body }),
            invalidatesTags: (_r, _e, { id }) => [{ type: 'Task', id }, { type: 'Task', id: 'LIST' }],
        }),
        deleteTask: builder.mutation<void, number>({
            query: (id) => ({ url: `/tasks/${id}`, method: 'DELETE' }),
            invalidatesTags: (_r, _e, id) => [{ type: 'Task', id }, { type: 'Task', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetTasksQuery,
    useCompleteTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
} = tasksApi;