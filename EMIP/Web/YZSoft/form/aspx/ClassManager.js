
Ext.define('YZSoft.form.aspx.ClassManager', {
    singleton: true,
    components: {
        'grid': 'YZSoft.form.aspx.grid.Repeater',
        'aspxform:xlabel':'YZSoft.form.aspx.field.Label',
        'aspxform:xtextbox': function (attrs) {
            if (String.Equ(attrs.textmode, 'MultiLine'))
                return 'YZSoft.form.aspx.field.TextArea';
            else
                return 'YZSoft.form.aspx.field.Text';
        },
        'aspxform:xdatetimepicker': function (attrs) {
            if (String.Equ(attrs.type, 'TimeMinutes') ||
                String.Equ(attrs.type, 'TimeMinutes15') ||
                String.Equ(attrs.type, 'TimeMinutes30') ||
                String.Equ(attrs.type, 'TimeHour'))
                return 'YZSoft.form.aspx.field.TimePicker';
            else
                return 'YZSoft.form.aspx.field.DatePicker';
        },
        'aspxform:xcheckboxlist': 'YZSoft.form.aspx.field.PopupCheckboxList',
        'aspxform:xradiobuttonlist': 'YZSoft.form.aspx.field.PopupRadioList',
        'aspxform:xdropdownlist': 'YZSoft.form.aspx.field.Select',
        'aspxform:xattachments': 'YZSoft.form.aspx.field.Attachment',
        'aspxform:ximageattachment': 'YZSoft.form.aspx.field.ImageAttachment',
        'aspxform:xhtmleditor': 'YZSoft.form.aspx.field.HtmlEditor',
        'aspxform:xdatabrowserbutton': 'YZSoft.form.aspx.field.DataBrowserButton',
        'aspxform:xbarcode': 'YZSoft.form.aspx.field.Barcode',
        'aspxform:xselectuserbutton': 'YZSoft.form.aspx.field.SelectUserButton',
        'aspxform:xselectoubutton': 'YZSoft.form.aspx.field.SelectOUButton',
        'aspxform:xexceldataimportbutton': null,
        'aspxform:xexceldataexportbutton': null,
        'aspxform:xhistoryformlink': 'YZSoft.form.aspx.field.HistoryFormLink',
        'aspxform:xchildformlink': 'YZSoft.form.aspx.field.ChildFormLink',
        'aspxform:xgridlineno': null,
        'aspxform:xaddblockbutton': null,
        'aspxform:xcheckbox': 'YZSoft.form.aspx.field.Checkbox',
        'aspxform:xradiobutton': 'YZSoft.form.aspx.field.Radio',
        'aspxform:xlistbox': function (attrs) {
            if (String.Equ(attrs.selectionmode, 'Multiple'))
                return 'YZSoft.form.aspx.field.PopupCheckboxList';
            else
                return 'YZSoft.form.aspx.field.PopupRadioList';
        },
        'aspxform:xhyperlink': 'YZSoft.form.aspx.field.Url',
        'aspxform:xprintbutton': null,
        'aspxform:xpositionmap': 'YZSoft.form.aspx.field.PositionMap',
        'aspxform:xbutton': null,
        'aspxform:xcustombrowserbutton': function (attrs) {
            return 'YZSoft.form.aspx.field.' + attrs.xclass;
        },
        'aspxform:xextjscontrol': function (attrs) {
            return 'YZSoft.form.aspx.field.' + attrs.xclass;
        },
        'aspxform:xsigntrace': null,
        'aspxform:xsignhistory': null,
        'aspxform:xcomments': null,
        'aspxform:xcommentstextbox': null,
        'aspxform:xcommentstextbox': null,
        'aspxform:xtaskstatus': null,
        'aspxform:xsnapshotlist': null,
        'wrap': 'YZSoft.form.aspx.Wrap'
    },
    validators: {
        'aspxform:xrequiredfieldvalidator': 'YZSoft.form.aspx.validator.Required',
        'aspxform:xrangevalidator': 'YZSoft.form.aspx.validator.Range',
        'aspxform:xregularexpressionvalidator': 'YZSoft.form.aspx.validator.RegExp',
        'aspxform:xcomparevalidator': 'YZSoft.form.aspx.validator.Compare',
        'aspxform:xcustomvalidator': 'YZSoft.form.aspx.validator.Custom'
    },

    constructor: function () {
        var me = this,
            ctypes;

        Ext.each(['components', 'validators'], function (p) {
            ctypes = me[p];

            Ext.Object.each(ctypes, function (name, ctype) {
                ctypes[name] = {
                    xclass: ctype
                };
            });

            Ext.Object.each(ctypes, function (name, ctype) {
                ctype.ctype = name;
            });
        });
    },

    getDefaultConfig: function (ctype, cfg, zone) {
        var me = this,
            zone = zone || 'components',
            ctypes = me[zone],
            ctypeDefine = ctypes[ctype],
            cmpCfg;

        if (!ctypeDefine)
            return;

        return Ext.clone(ctypeDefine.config);
    },

    getXClass: function (ctype, cfg, zone) {
        var me = this,
            zone = zone || 'components',
            ctypes = me[zone],
            ctypeDefine = ctypes[ctype],
            cfg = cfg || {},
            xclass;

        if (!ctypeDefine) {
            Ext.Logger && Ext.Logger.warn(Ext.String.format(RS.$('All_Uniform_Miss_CType'), ctype));
            return undefined;
        }

        if (Ext.isFunction(ctypeDefine.xclass))
            xclass = ctypeDefine.xclass(cfg.attrs);
        else
            xclass = ctypeDefine.xclass;

        return xclass || null;
    }
});