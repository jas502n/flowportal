
Ext.define('YZSoft.src.picker.Time', {
    extend: 'Ext.picker.Picker',
    xtype: 'yztimepicker',
    requires: ['Ext.DateExtras', 'Ext.util.InputBlocker'],
    config: {
        hideOnMaskTap: true,

        yearFrom: 1980,
        yearTo: new Date().getFullYear() + 20,
        hourFrom: 0,
        hourTo: 23,
        hourDefault: 8,
        minuteScale: 1,

        yearText: 'Year',
        monthText: 'Month',
        dayText: 'Day',
        hourText: 'Hour',
        minuteText: 'Minute',
        weekText: 'Week',

        weekDateFormat: 'm/d',

        doneButton: true,
        yearPostfix: RS.$('All__YearPostfix'),
        dayPostfix: RS.$('All__DayPostfix'),
        hourPostfix: RS.$('All__HourPostfix'),
        minutePostfix: RS.$('All__MinutePostfix'),
        weekFormat: RS.$('All__DateFmt_Week'),
        slotOrder: ['year', 'month', 'day', 'hour', 'minute']
    },

    platformConfig: [{
        theme: ['Windows'],
        doneButton: {
            iconCls: 'check2',
            ui: 'round',
            text: ''
        }
    }],

    constructor: function (config) {
        config = config || {};

        this.callParent(arguments);

        if (this.getMinuteScale() == 60 && !config.slotOrder)
            this.setSlotOrder(['year', 'month', 'day', 'hour']);

        this.createSlots();
    },

    initialize: function () {
        this.callParent();

        this.on({
            scope: this,
            delegate: '> slot',
            slotpick: this.onSlotPick
        });

        this.on({
            scope: this,
            show: function () {
                this.onSlotPick()
            }
        });
    },

    setValue: function (value, animated) {
        if (!value) {
            value = Ext.Date.clearTime(new Date());
            value.setHours(this.getHourDefault());
        }

        if (Ext.isDate(value)) {
            var firstDate = Ext.Date.getWeekFirstDate(value),
                week = Ext.Date.getWeekOfMonth(firstDate);

            value = {
                day: value.getDate(),
                month: value.getMonth() + 1,
                year: value.getFullYear(),
                hour: value.getHours(),
                minute: value.getMinutes(),
                week: week
            };
        }

        this.callParent([value, animated]);
    },

    getValue: function (useDom) {
        var values = {},
            items = this.getItems().items,
            ln = items.length,
            daysInMonth, day, month, year, item, i;

        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item instanceof Ext.picker.Slot) {
                values[item.getName()] = item.getValue(useDom);
            }
        }

        if (values.week) {
            year = Ext.isNumber(values.year) ? values.year : 1;
            month = Ext.isNumber(values.month) ? values.month : 1;
            return Ext.Date.getWeekFirstDateByWeekNo(year, month, values.week);
        }

        //if all the slots return null, we should not return a date
        if (values.year === null && values.month === null && values.day === null) {
            return null;
        }

        year = Ext.isNumber(values.year) ? values.year : 1;
        month = Ext.isNumber(values.month) ? values.month : 1;
        day = Ext.isNumber(values.day) ? values.day : 1;
        hour = Ext.isNumber(values.hour) ? values.hour : 0;
        minute = Ext.isNumber(values.minute) ? values.minute : 0;

        if (month && year && month && day) {
            daysInMonth = this.getDaysInMonth(month, year);
        }
        day = (daysInMonth) ? Math.min(day, daysInMonth) : day;

        return new Date(year, month - 1, day, hour, minute);
    },

    updateYearFrom: function () {
        if (this.initialized) {
            this.createSlots();
        }
    },

    updateYearTo: function () {
        if (this.initialized) {
            this.createSlots();
        }
    },

    updateHourFrom: function () {
        if (this.initialized) {
            this.createSlots();
        }
    },

    updateHourTo: function () {
        if (this.initialized) {
            this.createSlots();
        }
    },

    updateYearText: function (yearText) {
        var innerItems = this.getInnerItems,
            ln = innerItems.length,
            item, i;

        //loop through each of the current items and set the title on the correct slice
        if (this.initialized) {
            for (i = 0; i < ln; i++) {
                item = innerItems[i];

                if (item.title == this.yearText) {
                    item.setTitle(yearText);
                }
            }
        }
    },

    updateMonthText: function (newMonthText, oldMonthText) {
        var innerItems = this.getInnerItems,
            ln = innerItems.length,
            item, i;

        //loop through each of the current items and set the title on the correct slice
        if (this.initialized) {
            for (i = 0; i < ln; i++) {
                item = innerItems[i];

                if ((typeof item.title == "string" && item.title == oldMonthText) || (item.title.html == oldMonthText)) {
                    item.setTitle(newMonthText);
                }
            }
        }
    },

    updateDayText: function (newDayText, oldDayText) {
        var innerItems = this.getInnerItems,
            ln = innerItems.length,
            item, i;

        //loop through each of the current items and set the title on the correct slice
        if (this.initialized) {
            for (i = 0; i < ln; i++) {
                item = innerItems[i];

                if ((typeof item.title == "string" && item.title == oldDayText) || (item.title.html == oldDayText)) {
                    item.setTitle(newDayText);
                }
            }
        }
    },

    updateHourText: function (newHourText, oldHourText) {
        var innerItems = this.getInnerItems,
        ln = innerItems.length,
        item, i;

        //loop through each of the current items and set the title on the correct slice
        if (this.initialized) {
            for (i = 0; i < ln; i++) {
                item = innerItems[i];

                if ((typeof item.title == "string" && item.title == oldHourText) || (item.title.html == oldHourText)) {
                    item.setTitle(newHourText);
                }
            }
        }
    },

    updateMinuteText: function (newMinuteText, oldMinuteText) {
        var innerItems = this.getInnerItems,
        ln = innerItems.length,
        item, i;

        //loop through each of the current items and set the title on the correct slice
        if (this.initialized) {
            for (i = 0; i < ln; i++) {
                item = innerItems[i];

                if ((typeof item.title == "string" && item.title == oldMinuteText) || (item.title.html == oldMinuteText)) {
                    item.setTitle(newMinuteText);
                }
            }
        }
    },

    createSlots: function () {
        var me = this,
            slotOrder = me.getSlotOrder(),
            yearsFrom = me.getYearFrom(),
            yearsTo = me.getYearTo(),
            hoursFrom = me.getHourFrom(),
            hoursTo = me.getHourTo(),
            minuteScale = Math.max(me.getMinuteScale(), 1),
            yearPostfix = me.getYearPostfix() || '',
            dayPostfix = me.getDayPostfix() || '',
            hourPostfix = me.getHourPostfix() || '',
            minutePostfix = me.getMinutePostfix() || '',
            years = [],
            days = [],
            weeks = [],
            months = [],
            hours = [],
            minutes = [],
            reverse = yearsFrom > yearsTo,
            ln, i, daysInMonth, weeksInMonth;

        while (yearsFrom) {
            years.push({
                text: yearsFrom + yearPostfix,
                value: yearsFrom
            });

            if (yearsFrom === yearsTo) {
                break;
            }

            if (reverse) {
                yearsFrom--;
            } else {
                yearsFrom++;
            }
        }

        daysInMonth = me.getDaysInMonth(1, new Date().getFullYear());
        for (i = 0; i < daysInMonth; i++) {
            days.push({
                text: (i + 1) + dayPostfix,
                value: i + 1
            });
        }

        //无用
        weeksInMonth = 10;
        for (i = 0; i < weeksInMonth; i++) {
            weeks.push({
                text: i + 1,
                value: i + 1 //Ext.Date.clearTime(new Date())
            });
        }

        for (i = 0, ln = Ext.Date.monthNames.length; i < ln; i++) {
            months.push({
                text: Ext.Date.monthNames[i],
                value: i + 1
            });
        }

        if (hoursFrom > hoursTo) {
            var tmp = hoursFrom;
            hoursFrom = hoursTo;
            hoursTo = tmp;
        }

        for (i = hoursFrom; i <= hoursTo; i++) {
            hours.push({
                text: i + hourPostfix,
                value: i
            });
        }

        for (i = 0; i <= 59; ) {
            //var j = i >= 10 ? i : '0' + i;
            var j = i;
            minutes.push({
                text: j + minutePostfix,
                value: i
            });
            i = i + minuteScale;
        }

        var slots = [];

        slotOrder.forEach(function (item) {
            slots.push(me.createSlot(item, days, weeks, months, years, hours, minutes));
        });

        me.setSlots(slots);
    },

    createSlot: function (name, days, weeks, months, years, hours, minutes) {
        switch (name) {
            case 'year':
                return {
                    name: name,
                    align: 'center',
                    data: years,
                    title: this.getYearText(),
                    flex: 1
                };
            case 'month':
                return {
                    name: name,
                    align: 'center',
                    data: months,
                    title: this.getMonthText(),
                    flex: 1
                };
            case 'day':
                return {
                    name: name,
                    align: 'center',
                    data: days,
                    title: this.getDayText(),
                    flex: 1
                };
            case 'week':
                return {
                    name: name,
                    align: 'center',
                    data: weeks,
                    title: this.getWeekText(),
                    flex: 2
                };
            case 'hour':
                return {
                    name: name,
                    align: 'center',
                    data: hours,
                    title: this.getHourText(),
                    flex: 1
                };
            case 'minute':
                return {
                    name: name,
                    align: 'center',
                    data: minutes,
                    title: this.getMinuteText(),
                    flex: 1
                };
        }
    },

    onSlotPick: function (picker, value) {
        var value = this.getValue(true),
            year = value.getFullYear(),
            month = value.getMonth(),
            yearSlot = this.getSlot('year'),
            monthSlot = this.getSlot('month'),
            daySlot = this.getSlot('day'),
            weekSlot = this.getSlot('week'),
            i;

        if (picker && picker.isSlot && picker.getName() != 'year' && picker.getName() != 'month') {
            return;
        }
        else {
            if (yearSlot)
                year = yearSlot.getValue(true);

            if (monthSlot)
                month = monthSlot.getValue(true) - 1;
        }

        if (!value || !Ext.isDate(value))
            return;

        this.callParent(arguments);

        if (daySlot) {
            var slot = daySlot,
                store = slot.getStore(),
                dayPostfix = this.getDayPostfix() || '',
                days = [],
                daysInMonth;

            daysInMonth = this.getDaysInMonth(month + 1, year);
            for (i = 0; i < daysInMonth; i++) {
                days.push({
                    text: (i + 1) + dayPostfix,
                    value: i + 1
                });
            }

            if (store.getCount() != days.length) {
                store.setData(days);

                var viewItems = slot.getViewItems(),
                    valueField = slot.getValueField(),
                    index, item;

                index = store.find(valueField, value.getDate());
                index = index == -1 ? store.getCount() - 1 : index;
                item = Ext.get(viewItems[index]);

                slot.selectedIndex = index;
                slot.scrollToItem(item);
                slot.setValue(slot.getValue(true));
            }
        }

        if (weekSlot) {
            var slot = weekSlot,
                store = slot.getStore(),
                weekFormat = this.getWeekFormat() || '',
                weekDateFormat = this.getWeekDateFormat(),
                weeks = [],
                firstDate, lastDate;

            firstDate = Ext.Date.getWeekFirstDate(new Date(year, month, 1));
            lastDate = Ext.Date.add(firstDate, Ext.Date.DAY, 6);
            for (i = 0; true; i++) {
                weeks.push({
                    text: Ext.String.format(weekFormat, (i + 1), Ext.Date.format(firstDate, weekDateFormat), Ext.Date.format(lastDate, weekDateFormat)),
                    value: i + 1
                });

                firstDate = Ext.Date.add(firstDate, Ext.Date.DAY, 7);
                lastDate = Ext.Date.add(lastDate, Ext.Date.DAY, 7);

                if (firstDate.getMonth() != month)
                    break;
            }

            store.setData(weeks);

            var viewItems = slot.getViewItems(),
                valueField = slot.getValueField(),
                index, item;

            index = store.find(valueField, Ext.Date.getWeekOfMonth(value));
            index = index == -1 ? 0 : index;
            item = Ext.get(viewItems[index]);

            slot.selectedIndex = index;
            slot.scrollToItem(item);
            slot.setValue(slot.getValue(true));
        }
    },

    getSlot: function (name) {
        var innerItems = this.getInnerItems(),
            ln = innerItems.length,
            i, slot;

        this.slots = this.slots || {};

        if (this.slots[name]) {
            return this.slots[name];
        }

        for (i = 0; i < ln; i++) {
            slot = innerItems[i];
            if (slot.isSlot && slot.getName() == name) {
                this.slots[name] = slot;
                return slot;
            }
        }

        return null;
    },

    getDaysInMonth: function (month, year) {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return month == 2 && this.isLeapYear(year) ? 29 : daysInMonth[month - 1];
    },

    isLeapYear: function (year) {
        return !!((year & 3) === 0 && (year % 100 || (year % 400 === 0 && year)));
    },

    onDoneButtonTap: function () {
        var oldValue = this._value,
            newValue = this.getValue(true),
            testValue = newValue;

        if (Ext.isDate(newValue)) {
            testValue = newValue.toDateString();
        }
        if (Ext.isDate(oldValue)) {
            oldValue = oldValue.toDateString();
        }

        if (testValue != oldValue) {
            this.fireEvent('change', this, newValue);
        }

        this.hide();
        Ext.util.InputBlocker.unblockInputs();
    }
});