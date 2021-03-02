import {format} from 'date-fns';

export const mysqlDate = (date: Date): string => {
    return format(date, 'yyyy-MM-dd HH:mm:ss');
};
