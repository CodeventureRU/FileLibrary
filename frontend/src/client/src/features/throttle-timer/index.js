import {useEffect, useState} from "react";

// Функция для создания текста с правильным склонением слова "секунд"
const createRemainsText = (time) => {
    function getSecondsText(seconds) {
        const lastDigit = seconds % 10;
        if (seconds >= 11 && seconds <= 19) {
            return 'секунд';
        } else if (lastDigit === 1) {
            return 'секунду';
        } else if (lastDigit >= 2 && lastDigit <= 4) {
            return 'секунды';
        } else {
            return 'секунд';
        }
    }

    return `Повторите через ${time} ${getSecondsText(time)}`;
}

const STANDARD_THROTTLE_TIME = 300;

export const useThrottleTimer = (errors, requested) => {
    const [remainsText, setRemainsText] = useState("");
    const [isWaiting, setIsWaiting] = useState(false);

    // Функция для установки состояния remains и remainsText
    const setRemainsValue = time => {
        setRemainsText(createRemainsText(time));
    }

    // Эффект, который будет запускаться при изменении errors или requested (прошел новый запрос)
    useEffect(() => {
        if (requested > 0) {
            setIsWaiting(true);
            let remains = STANDARD_THROTTLE_TIME; // По умолчанию ставим remains на основе стандартного времени ожидания для троттлинга
            // Но если запрос пришел с ошибкой, и в нем передано время, то переставляем его на переданное значение
            if (errors?.remains) {
                remains = errors.remains
            }

            // Устанавливаем состояние remainsText на основе remains
            setRemainsValue(remains);
            let requestedAt = Math.floor(Date.now() / 1000)

            // Запускаем таймер для обновления remainsText каждую секунду
            setTimeout(() => remainTimer(remains, requestedAt), 1001);
        }
    }, [errors, requested]);

    // Функция для запуска таймера, уменьшающего время и обновляющего состояние remainsText и isWaiting
    const remainTimer = (time, requestedAt) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const diff = currentTime - requestedAt;
        const remainsSeconds = time - diff;
        setRemainsValue(remainsSeconds);

        // Если осталось больше 1 секунды, запускаем таймер снова
        if (remainsSeconds > 0) {
            setTimeout(() => remainTimer(time, requestedAt), 1000);
        } else {
            setIsWaiting(false);
        }
    }

    // Возвращаем состояния remains и remainsText
    return {isWaiting, remainsText};
}