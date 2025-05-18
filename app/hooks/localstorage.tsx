import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue?: T): [T | undefined, (value: T) => void] {
    const [storedValue, setStoredValue] = useState<T | undefined>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading localStorage key:', key, error);
            return initialValue;
        }
    });

    const setValue = (value: T) => {
        try {
            setStoredValue(value);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            console.error('Error setting localStorage key:', key, error);
        }
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleStorageChange = () => {
            try {
                const item = window.localStorage.getItem(key);
                setStoredValue(item ? JSON.parse(item) : initialValue);
            } catch (error) {
                console.error('Error syncing localStorage key:', key, error);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key, initialValue]);

    return [storedValue, setValue];
}

export default useLocalStorage;