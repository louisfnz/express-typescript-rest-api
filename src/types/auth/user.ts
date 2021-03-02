export type Permission = {
    group: string;
    title: string;
    action: string;
};

export type RequestUser = {
    id: number;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    email: string;
    owner: boolean;
    permissions: Permission[];
};
