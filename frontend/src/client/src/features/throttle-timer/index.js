import {useEffect, useState} from "react";

// Функция для создания текста с правильным склонением слова "секунд"
const createRemainsText = (time) => {
    function getSecondsText(seconds) {
        const lastDigit = seconds % 10;
        if (seconds >= 11 && seconds <= 19) {
            return 'секунд';
        } else if (lastDigit === 1) {
            return 'секунда';
        } else if (lastDigit >= 2 && lastDigit <= 4) {
            return 'секунды';
        } else {
            return 'секунд';
        }
    }

    return `Повторите через ${time} ${getSecondsText(time)}`;
}

export const useThrottleTimer = (errors, requested) => {
    const [remains, setRemains] = useState(0);
    const [remainsText, setRemainsText] = useState("");

    // Функция для установки состояния remains и remainsText
    const setRemainsValue = time => {
        setRemains(time);
        setRemainsText(createRemainsText(time));
    }

    // Эффект, который будет запускаться при изменении errors или requested (прошел новый запрос)
    useEffect(() => {
        if (requested > 0) {
            if (errors?.remains) {
                // Устанавливаем состояния remains и remainsText на основе ошибки remains из объекта errors
                setRemainsValue(Number(errors.remains));
                // Запускаем таймер для обновления remains каждую секунду
                setTimeout(() => remainTimer(Number(errors.remains)), 1000);
            }
        }
    }, [errors, requested]);

    // Функция для запуска таймера, уменьшающего время и обновляющего состояние remains и remainsText
    const remainTimer = (time) => {
        setRemainsValue(time - 1);

        // Если осталось больше 1 секунды, запускаем таймер снова
        if (time > 1) {
            setTimeout(() => remainTimer(time - 1), 1000);
        }
    }

    // Возвращаем состояния remains и remainsText
    return {remains, remainsText};
}