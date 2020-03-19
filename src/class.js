import { default as locale } from "./locale";

class KDate extends Date {

    // CONSTRUCTORS
    //---------------------------------------------------------------

    constructor(year, month, day) {
        super();
        if (year && month && day) {

            const { yearR, monthR, dayR } = roofValues(year, month, day);

            // ATTRIBUTES
            // =================
            this.year = yearR;
            this.month = monthR;
            this.day = dayR;
            /* this.weekday */
        }
    }

    static buildPrevMonth(date = new KDate) {
        const year = date.month === JANUARY ? date.year - 1 : date.year;
        const month = date.month === JANUARY ? DECEMBER : date.month - 1;
        const day = date.day;
        return new KDate(year, month, day);
    }

    static buildNextMonth(date = new KDate) {
        const year = date.month === DECEMBER ? date.year + 1 : date.year;
        const month = date.month === DECEMBER ? JANUARY : date.month + 1;
        const day = date.day;
        return new KDate(year, month, day);
    }

    // GETTERS
    //----------------------------------------------------------------

    get year() {
        return this.getFullYear();
    }

    get month() {
        return this.getMonth() + 1;
    }

    get day() {
        return this.getDate();
    }

    get weekday() {
        return this.getDay() + 1;
    }

    // SETTERS
    //----------------------------------------------------------------

    set year(year) {
        this.setFullYear(year);
    }

    set month(month) {
        this.setMonth(month - 1);
    }

    set day(day) {
        this.setDate(day);
    }

    // META-METHODS
    //----------------------------------------------------------------

    [Symbol.iterator]() {
        let i = -1;
        let data = [
            this.year,
            this.month,
            this.day
        ];
        return {
            next: () => ({ value: data[++i], done: !(i in data) })
        };
    }

    // METHODS
    //----------------------------------------------------------------

    equals(date) {
        return (this.year === date.year
            ? this.month === date.month
                ? this.day === date.day
                : false
            : false
        );
    }

    getWeekdayName(lang = "en", nbChar = 255) {
        return locale[lang].weekdays[this.weekday - 1].substring(0, nbChar);
    }

    getMonthName(lang = "en", nbChar = 255) {
        return locale[lang].months[this.month - 1].substring(0, nbChar);
    }

    // STATIC METHODS
    //--------------------------------------------------------------

    static buildCalendar(date = new KDate) {
        const prev = KDate.buildPrevMonth(date);
        const next = KDate.buildNextMonth(date);

        const length = getMonthLength(...date);
        const prevLength = getMonthLength(...prev);

        const weekday = getMonthFirstWeekday(...date);
        console.log(weekday);

        const daysPrev = weekday - 1;
        const days = length;
        const daysNext = (NB_WEEKS * NB_DAYS) - (daysPrev + days);

        const prevSpan = [...new Array(daysPrev)]
            .map((v, i) => new KDate(prev.year, prev.month, prevLength - daysPrev + (i + 1)));

        const span = [...new Array(days)]
            .map((v, i) => new KDate(date.year, date.month, (i + 1)));

        const nextSpan = [...new Array(daysNext)]
            .map((v, i) => new KDate(next.year, next.month, i + 1));

        const calendarSpan = [...prevSpan, ...span, ...nextSpan];

        return [...new Array(NB_WEEKS)]
            .map(week => week = calendarSpan.splice(0, NB_DAYS));
    }

    static getWeekdays(lang = "en", nbChar = 255) {
        return locale[lang].weekdays.map(weekday => weekday.substring(0, nbChar));
    }

    static getMonths(lang = "en", nbChar = 255) {
        return locale[lang].months.map(month => month.substring(0, nbChar));
    }
}

// PRIVATE CONSTANTS
//------------------------------------------------

const NB_WEEKS = 6;
const NB_DAYS = 7;
const JANUARY = 1;
const FEBRUARY = 2;
const DECEMBER = 12;
const MONTHS_WITH_30_DAYS = [4, 6, 9, 11];
const LEAP_YEAR_STEP = 4;

// PRIVATE METHODS
//-----------------------------------------------

const getMonthFirstWeekday = (year, month) => {
    return (new KDate(year, month, 1)).weekday;
}

const getMonthLength = (year, month) => {
    return (month === FEBRUARY
        ? (year % LEAP_YEAR_STEP === 0)
            ? 29 : 28
        : (MONTHS_WITH_30_DAYS.includes(month))
            ? 30 : 31
    );
}

const roofValues = (year, month, day) => {
    const length = getMonthLength(year, month);
    const yearR = year;
    const monthR = month >= DECEMBER ? DECEMBER : month;
    const dayR = day >= length ? length : day;
    return { yearR, monthR, dayR };
}

export default KDate;