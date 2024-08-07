/*
 * Copyright (c) 2023-2024 Josef Müller.
 */

import { toastController } from '@ionic/vue';
import { DURATIONS } from '@/shared/utils';

/**
 * Format a date to DD.MM.YYYY, e.g. 1.1.2020
 * @param date
 * @returns the formatted date
 */
export function formatDate(date?: Date): string {
    if (!date) {
        return '';
    }
    return date.toISOString().split('T')[0].split('-').reverse().join('.');
}


/**
 * Present a toast to the user
 * @param message the message to display
 * @param isError
 * @param duration the duration of the toast in milliseconds
 */
export const presentToast = async (message?: string, isError = false, duration = DURATIONS.SHORT) => {
    if ((message ?? '') === '') {
        return
    }

    const toast = toastController.create({
        message, duration, position: 'top', color: isError ? 'danger' : 'success'
    });
    await (await toast).present()
}


/**
 * Returns a hash code from a string
 * @return {Number}    A 32bit integer
 * @see https://stackoverflow.com/a/8831937
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 * @param obj the object to hash
 */
export function hash(obj: unknown): number {
    const str = JSON.stringify(obj);
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        const chr: number = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
