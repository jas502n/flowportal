
Ext.define('YZSoft.src.util.InputAssist', {
    singleton: true,

    insertAtCaret: function (textfield, text, selectionInserted) {
        var me = this,
            inputEl = textfield.getComponent().input,
            dom = inputEl.dom,
            value = textfield.getValue() || '';

        text = text || '';

        if (dom.selectionStart || dom.selectionStart === 0) {
            var startPos = dom.selectionStart,
                endPos = dom.selectionEnd,
                value = textfield.getValue();

            textfield.setValue(value.substring(0, startPos) + text + value.substring(endPos, value.length));

            startPos = startPos + (selectionInserted ? 0 : text.length);
            endPos = startPos + text.length;
            //dom.setSelectionRange(startPos, endPos);
            //dom.focus();
            //dom.blur();
        }
        else {
            textfield.setValue(value + text);
        }
    },

    getCaretPos: function (textfield) {
        var inputEl = textfield.getComponent().input,
            dom = inputEl.dom,
            value = textfield.getValue() || '';

        if (dom.selectionStart || dom.selectionStart === 0) {
            var startPos = dom.selectionStart,
                endPos = dom.selectionEnd;

            return {
                start: dom.selectionStart,
                end: dom.selectionEnd
            }
        }

        return null;
    },

    isCaretAtAnd: function (textfield) {
        var pos = this.getCaretPos(textfield),
            value = textfield.getValue() || '';

        return !!(pos && pos.start == pos.end && pos.start >= value.length);
    }
});