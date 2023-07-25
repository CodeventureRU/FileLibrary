export const dateToFormat = (date, format) => {
    const dateObject = new Date(date);

    switch (format) {
        case "dd.mm.yyyy":
            let dd = ('0' + dateObject.getDate()).slice(-2);
            let mm = ('0' + (dateObject.getMonth() + 1)).slice(-2);
            let yyyy = dateObject.getFullYear();

            return `${dd}.${mm}.${yyyy}`;
        case "dd MM yyyy":
            let options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                timezone: 'UTC'
            };
            return dateObject.toLocaleString("ru", options).replaceAll(".", "");
    }
}