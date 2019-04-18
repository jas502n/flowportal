
Ext.define('YZSoft.src.panel.social.FrequenceFace', {
    extend: 'YZSoft.src.container.SquaredContainer',
    requires:[
        'YZSoft.src.panel.social.Faces'
    ],
    config: {
        faces: [
            'e114', 'e177', 'e100', 'e127', 'e176', 'e152', 'e181', 'e102', 'e183', 'e107', 'e151', 'e179', 'e136', 'e189', 'e121', 'e142'
        ]
    },

    constructor: function (config) {
        var me = this,
            faces = YZSoft.src.panel.social.Faces.getFaces(config.faces || me.config.faces),
            items = [];

        Ext.Array.each(faces, function (face) {
            items.push({
                cls: ['yz-button-flat', 'yz-button-qqface'],
                iconCls: 'yz-icon-qqface-' + face.id,
                face: face,
                scope: me,
                handler: 'onFaceClick'
            });
        });

        cfg = {
            padding: '6 3',
            defaults: {
                xtype: 'button',
                iconAlign: 'top'
            },
            minBoxCount: 8,
            minBoxWidth: 80,
            items: items
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onFaceClick: function (button) {
        this.fireEvent('faceClick', button.config.face, button);
    }
});