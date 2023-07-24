export default (errors, helperText="") => {
    // Сам факт существования этой функции - надругательство над типизацией в JavaScript

    if (errors === undefined) {
        return helperText;
    }

    if (typeof errors == "string") {
        return errors;
    }

    if (typeof errors == "object") {
        let strings = [];
        // Вот это ивзращение с перебором на случай, если ошибка пришла как объект. Такое маловероятно, но в случае возникновения такой пробелмы функция отработает корректно
        for (let i in errors) {
            strings.push(errors[i]);
        }

        return strings.join("<br/>");
    }
}