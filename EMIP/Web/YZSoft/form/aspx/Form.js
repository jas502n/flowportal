
Ext.define('YZSoft.form.aspx.Form', {
    extend: 'YZSoft.form.Form',
    requires: [
        'YZSoft.form.aspx.ClassManager',
        'YZSoft.form.document.Uniform'
    ],
    config: {
        model: null,
        formInfo: null,
        readOnly: false
    },
    autoCreateViewModel: false,

    constructor: function (config) {
        var me = this,
            config = config || {},
            model = config.model,
            formInfo = config.formInfo;

        me.callParent([config]);

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Form.ashx'),
            params: {
                Method: 'GetUniformDefine',
                aspxform: config.aspxform
            },
            success: function (action) {
                //try {
                me.fireAction('formsettingload', [action.result], 'onFormSettingLoaded', me);
                //}
                //catch (err) {
                //    if (err.msg) //表单加载错误
                //        me.fireEvent('failure', err.msg);
                //    else //程序错误（语法等）
                //        throw err;
                //}
            },
            failure: function (action) {
                me.fireEvent('failure', action.result.errorMessage);
            }
        });
    },

    onFormSettingLoaded: function (result) {
        var me = this,
            forminfo = me.getFormInfo(),
            task = forminfo && forminfo.task,
            src = result.src,
            doc, formulars, items, globalVars, comps = [], comp,
            lastfieldset = null;

        for (var funcname in src.funcs) {
            try {
                src.funcs[funcname] = Ext.decode(src.funcs[funcname]);
            }
            catch (e) {
                me.fireEvent('failure', Ext.String.format(RS.$('All_Uniform_JSFunc_Err'), funcname));
                return false;
            }
        }

        src.js = src.js ? Ext.decode(src.js) : {};

        me.funcs = src.funcs = Ext.apply(src.funcs, src.js.funcs);
        src.js.initialize && src.js.initialize(me);

        doc = me.doc = Ext.create('YZSoft.form.document.Uniform', {
            src: result.src
        });

        globalVars = doc.getBlockVars(doc.src.blockItems);
        formulars = doc.getAllFormulars();
        me.validators = me.createValidators(doc);
        items = me.resolveItems(doc, me.validators, src.items);

        comps.push({
            xtype: 'fieldset',
            hidden: !task,
            items: [{
                xclass: 'YZSoft.form.FormHeader',
                padding: '16 10 10 16',
                task: task
            }]
        });

        Ext.each(items, function (itemCfg) {


            comp = Ext.create(itemCfg.xclass, itemCfg);

            me[itemCfg.itemid] = comp;

            if (comp.isRepeaterContainer) {
                comps.push(comp);
                lastfieldset = null;
            }
            else {
                if (lastfieldset == null) {
                    lastfieldset = Ext.create('Ext.form.FieldSet', {});
                    comps.push(lastfieldset);
                }

                lastfieldset.add(comp);
            }
        });

        me.setItems(comps);
        me.createViewModel(globalVars, formulars);
    },

    resolveItems: function (doc, validators, itemids) {
        var me = this,
            components = doc.src.components,
            items = [];

        Ext.each(itemids, function (itemid) {
            var item = components[itemid],
                cfg = Ext.clone(item),
                visibility = Ext.String.trim((cfg && cfg.attrs && cfg.attrs.visibility) || '').toLowerCase() !== 'false',
                xclass = YZSoft.form.aspx.ClassManager.getXClass(cfg.ctype, cfg),
                defaultCfg = xclass && YZSoft.form.aspx.ClassManager.getDefaultConfig(cfg.ctype, cfg);

            if (xclass === null)
                return;

            if (xclass === undefined)
                xclass = 'YZSoft.form.aspx.field.Text';

            if (visibility === false)
                return;
            if (cfg.attrs.mxclass != undefined) {
                xclass = cfg.attrs.mxclass;
            }
            cfg = Ext.apply({
                xclass: xclass,
                form: me,
                itemid: itemid,
                hiddenExpress: cfg.attrs && cfg.attrs.hiddenexpress,
                disableExpress: cfg.attrs && cfg.attrs.disableexpress,
                $validators: me.getValidatorsByComponentId(validators, itemid)
            }, cfg, defaultCfg);

            delete cfg.blockItems;
            items.push(cfg);

            cfg.items = me.resolveItems(doc, validators, cfg.items);

            if (doc.isGrid(item))
                cfg.blockVars = doc.getBlockVars(item.blockItems);

            if (cfg.items.length == 0)
                delete cfg.items;
        });

        return items;
    },

    createValidators: function (doc) {
        var me = this,
            validators = doc.src.validators,
            rv = [];

        Ext.Object.each(validators, function (validatorid, config) {
            var cfg = Ext.clone(config),
                xclass = YZSoft.form.aspx.ClassManager.getXClass(cfg.ctype, cfg, 'validators'),
                defaultCfg = xclass && YZSoft.form.aspx.ClassManager.getDefaultConfig(cfg.ctype, cfg, 'validators');

            if (xclass === null)
                return;

            if (xclass === undefined)
                return;

            cfg = Ext.apply({
        }, cfg, defaultCfg);

        rv.push(Ext.create(xclass, cfg));
    });

    return rv;
},

getValidatorsByComponentId: function (validators, compId) {
    var me = this,
            rv = [];

    Ext.each(validators, function (validator) {
        if (String.Equ(validator.controltovalidate, compId))
            rv.push(validator);
    });

    return rv;
}
});