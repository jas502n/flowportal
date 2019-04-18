
Ext.define('YZSoft.src.panel.social.Comments', {
    extend: 'Ext.field.TextArea',
    requires: [
        'YZSoft.src.util.InputAssist',
        'YZSoft.src.panel.social.Faces'
    ],
    config: {
        clearIcon: false,
        cls: ['yz-teatarea-social-comments']
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.getComponent().input.on({
            scope: me,
            keydown: 'onKeyDown'
        });

        me.on({
            scope: me,
            backspaceClick: 'onBackspaceClick'
        });
    },

    onKeyDown: function (e) {
        var me = this,
            value = me.getValue(),
            face, newValue;

        if (e.event.keyCode == 8) {
            if (YZSoft.src.util.InputAssist.isCaretAtAnd(me)) {
                face = me.getEndFace(value);
                if (face) {
                    e.stopEvent();
                    newValue = value.substring(0, face.start);
                    me.setValue(newValue);
                }
            }
        }
    },

    onBackspaceClick: function () {
        var me = this,
            value = me.getValue(),
            face, newValue;

        if (!value)
            return;

        face = me.getEndFace(value);
        if (face)
            newValue = value.substring(0, face.start);
        else
            newValue = value.substr(0, value.length - 1);

        me.setValue(newValue);
    },

    getEndFace: function (value) {
        if (!value)
            return;

        var endIndex = value.length - 1,
            ch = value.charAt(endIndex),
            startIndex = value.lastIndexOf('[');

        if (ch != ']' || startIndex == -1)
            return;

        var testStr = value.substring(startIndex + 1, endIndex),
            faces = Ext.Array.union(YZSoft.src.panel.social.Faces.qq),
            rv;

        Ext.Array.each(faces, function (face) {
            if (face.text === testStr) {
                rv = face;
                return false;
            }
        });

        if (rv) {
            return Ext.apply({
                start: startIndex,
                end: endIndex
            }, rv);
        }
    }
});