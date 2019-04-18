
Ext.define('YZSoft.src.util.MessageConverter', {
    singleton: true,
    requires: [
        'YZSoft.src.panel.social.Faces',
        'YZSoft.src.util.Image'
    ],
    inlineRegxs: [
        /\{imageFile:\d{9,}\}/gi,
        /\{localImageFile:[^\}]{1,}\}/gi,
        /\{vedioFile:\d{9,}\}/gi,
        /\{localVedioFile:[^\}]{1,}\}/gi,
        /\{docFile:\d{9,}[^\}]*\}/gi,
        /\{audioFile:\d{9,}\}/gi,
        /\{localAudioFile:[^\}]{1,}\}/gi,
        /\{qqface:[^\}]{1,}\}/gi,
        /\{taskRejected:\d{1,}\}/gi,
        /\{taskApproved:\d{1,}\}/gi
    ],
    blockRegxs: {
        manualRemind: /^\{"manualRemind":[\s\S]*\}$/i,
        systemRemind: /^\{"systemRemind":[\s\S]*\}$/i
    },
    typeRegxs: [
        /^\{imageFile:\d{9,}\}$/i,
        /^\{localImageFile:[^\}]{1,}\}$/i,
        /^\{vedioFile:\d{9,}\}$/i,
        /^\{localVedioFile:[^\}]{1,}\}$/i,
        /^\{docFile:\d{9,}[^\}]*\}$/i,
        /^\{audioFile:\d{9,}\}$/i,
        /^\{localAudioFile:[^\}]{1,}\}$/i,
        /^\{qqface:[^\}]{1,}\}$/i
    ],
    regFace: /\[[^\]]*\]/gi,

    convert: function (txt) {
        var me = this,
            blocktype;

        Ext.Object.each(me.blockRegxs, function (type, regx) {
            if (regx.test(txt)) {
                blocktype = type;
                return false;
            }
        });

        if (blocktype){
            var fn = me['convert' + Ext.String.capitalize(blocktype)],
                obj = Ext.decode(txt, true);

            if (obj && fn)
                return fn(obj);
        }

        for (var i = 0; i < me.inlineRegxs.length; i++) {
            var regx = me.inlineRegxs[i];

            txt = (txt || '').replace(regx, me.replacer.bind(me));
        }

        return txt;
    },

    convertLastMessage: function (txt) {
        var me = this,
            blocktype;

        Ext.Object.each(me.blockRegxs, function (type, regx) {
            if (regx.test(txt)) {
                blocktype = type;
                return false;
            }
        });

        if (blocktype) {
            var fn = me['convert' + Ext.String.capitalize(blocktype) + 'LM'],
                obj = Ext.decode(txt, true);

            if (obj && fn)
                return fn(obj);
        }

        for (var i = 0; i < me.inlineRegxs.length; i++) {
            var regx = me.inlineRegxs[i];

            txt = (txt || '').replace(regx, me.replacerLM.bind(me));
        }

        return txt;
    },

    encodeFace: function (txt) {
        var me = this,
            regx = me.regFace;

        return (txt || '').replace(regx, me.replacerFace.bind(me));
    },

    getMessageType: function (txt) {
        var me = this,
            regxs = me.typeRegxs;

        if (regxs[0].test(txt))
            return 'image';
        if (regxs[1].test(txt))
            return 'image';
        if (regxs[2].test(txt))
            return 'video';
        if (regxs[3].test(txt))
            return 'video';
        if (regxs[4].test(txt))
            return 'doc';
        if (regxs[5].test(txt))
            return 'audio';
        if (regxs[6].test(txt))
            return 'audio';
        if (regxs[7].test(txt))
            return 'qqface';

        return 'text';
    },

    convertItem: function (type, id) {
        var fn = this['convert' + Ext.String.capitalize(type)];
        return fn ? fn(id) : '';
    },

    convertItemLM: function (type, id) {
        var fn = this['convert' + Ext.String.capitalize(type) + 'LM'];
        return fn ? fn(id) : '';
    },

    convertImageFile: function (id) {
        var me = this,
            url, size;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/Attachment/Assist.ashx'),
            params: {
                Method: 'GetImageSize',
                fileid: id
            },
            success: function (action) {
                size = action.result;
            }
        });

        url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
            Method: 'ImageStreamFromFileID',
            scale: 'Scale',
            format: 'png',
            width: 540,
            height: 600,
            fileid: id
        }));

        size = YZSoft.src.util.Image.getImageDisplaySize(size, {
            width: 180,
            height: 200
        });

        return Ext.String.format('<img class="yz-social-msg-item-img" fileid="{0}" src="{1}" style="width:{2}px;height:{3}px"/>', id, url, size.width, size.height);
    },

    convertLocalImageFile: function (uri) {
        return Ext.String.format('<img class="yz-social-msg-item-img" uri="{0}" src="{1}" />', uri, uri);
    },

    convertVedioFile: function (id) {
        var me = this,
            url, size;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/Attachment/Assist.ashx'),
            params: {
                Method: 'GetImageSize',
                fileid: id
            },
            success: function (action) {
                size = action.result;
            }
        });

        url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
            Method: 'ImageStreamFromFileID',
            scale: 'Scale',
            format: 'png',
            width: 540,
            height: 600,
            fileid: id
        }));

        size = YZSoft.src.util.Image.getImageDisplaySize(size, {
            width: 180,
            height: 200
        });

        return Ext.String.format('<div class="yz-social-msg-item-video-wrap"><img class="yz-social-msg-item-video" fileid="{0}" src="{1}" style="width:{2}px;height:{3}px"/></div>', id, url, size.width, size.height);
    },

    convertLocalVedioFile: function (uri) {
        return Ext.String.format('<img class="yz-social-msg-item-video" src="{0}"></img>', uri);
    },

    convertDocFile: function (body) {
        body = body || '';

        var me = this,
            idx = body.indexOf(','),
            id, filename;

        if (idx == -1) {
            id = body;
            filename = id;
        }
        else {
            id = body.substr(0, idx);
            filename = body.substr(idx + 1);
        }

        return Ext.String.format('<a class="yz-social-msg-item-doc" fileid="{0}" href="javascript:void(0);">{1}</a>', id, filename);
    },

    convertAudioFile: function (id) {
        return Ext.String.format('<div class="yz-social-msg-item-audio" fileid="{0}"></div>', id);
    },

    convertLocalAudioFile: function (uri) {
        return Ext.String.format('<div class="yz-social-msg-item-audio" uri="{0}"></div>', uri);
    },

    convertQqface: function (id) {
        var me = this,
            url;

        url = Ext.String.format(YZSoft.$url('YZSoft$Local/resources/images/faces/{0}.gif'), id);

        return Ext.String.format('<img class="yz-social-msg-item-qqface" src="{0}" align="center"/>', url);
    },

    convertTaskRejected: function (id) {
        var me = this,
            rejectinfo;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Notify.ashx'),
            params: {
                Method: 'GetTaskRejectedInfo',
                stepid: id
            },
            success: function (action) {
                rejectinfo = action.result;
            }
        });

        if (!rejectinfo)
            return RS.$('All__MessageConvert_TaskDeleted');

        return Ext.String.format([
            '<div class="taskreject-wrap" taskid="{1}" processName="{0}">',
                '<div class="taskreject-base">',
                    '<div class="processName">{0}</div>',
                    '<div class="desc">{3}</div>',
                    '<div class="reject"><span class="rejectby">{4}</span>{6}</div>',
                    '<div class="comments">{5}</div>',
                '</div>',
                '<div class="notify-more taskreject-more">',
                    '<div class="detail">{7}</div>',
                '</div>',
            '</div>'
        ].join(''),
        rejectinfo.processName,
        rejectinfo.taskid,
        rejectinfo.sn,
        rejectinfo.desc || rejectinfo.sn || '',
        rejectinfo.rejectBy,
        rejectinfo.comments || '',
        RS.$('All__MessageConvert_RejectedBy'),
        RS.$('All__ShowDetail'));
    },

    convertTaskApproved: function (id) {
        var me = this,
            approveinfo;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Notify.ashx'),
            params: {
                Method: 'GetTaskApprovedInfo',
                taskid: id
            },
            success: function (action) {
                approveinfo = action.result;
            }
        });

        if (!approveinfo)
            return RS.$('All__MessageConvert_TaskDeleted');

        return Ext.String.format([
            '<div class="taskapprove-wrap" taskid="{1}" processName="{0}">',
                '<div class="taskapprove-base">',
                    '<div class="processname">{0}</div>',
                    '<div class="desc">{3}</div>',
                    '<div class="sn">{5}{2}</div>',
                    '<div class="createat">{6}{4}</div>',
                '</div>',
                '<div class="notify-more taskapprove-more">',
                    '<div class="detail">{7}</div>',
                '</div>',
            '</div>'
        ].join(''),
        approveinfo.processName,
        approveinfo.taskid,
        approveinfo.sn,
        approveinfo.desc || approveinfo.sn || '',
        Ext.Date.format(approveinfo.createat, 'Y-m-d H:i'),
        RS.$('All__MessageConvert_SN'),
        RS.$('All__MessageConvert_PostAt'),
        RS.$('All__ShowDetail'));
    },

    convertImageFileLM: function (id) {
        return RS.$('All__MessageConvert_Image');
    },

    convertVedioFileLM: function (id) {
        return RS.$('All__MessageConvert_Video');
    },

    convertDocFileLM: function (id) {
        return RS.$('All__MessageConvert_File');
    },

    convertAudioFileLM: function (id) {
        return RS.$('All__MessageConvert_Audio');
    },

    convertQqfaceLM: function (id) {
        var me = this,
            faces = Ext.Array.union(YZSoft.src.panel.social.Faces.qq),
            findFace;

        Ext.Array.each(faces, function (face) {
            if (face.id == id) {
                findFace = face;
                return false;
            }
        });

        if (findFace)
            return Ext.String.format('[{0}]', findFace.text);

        return RS.$('All__MessageConvert_Face');
    },

    convertTaskRejectedLM: function (id) {
        var me = this,
            rejectinfo;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Notify.ashx'),
            params: {
                Method: 'GetTaskRejectedInfo',
                stepid: id
            },
            success: function (action) {
                rejectinfo = action.result;
            }
        });

        if (!rejectinfo)
            return RS.$('All__MessageConvert_TaskDeleted');

        return Ext.String.format(RS.$('All__MessageConvert_TaskRejected_FMT'), rejectinfo.processName);
    },

    convertTaskApprovedLM: function (id) {
        var me = this,
            approveinfo;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Notify.ashx'),
            params: {
                Method: 'GetTaskApprovedInfo',
                taskid: id
            },
            success: function (action) {
                approveinfo = action.result;
            }
        });

        if (!approveinfo)
            return RS.$('All__MessageConvert_TaskDeleted');

        return Ext.String.format(RS.$('All__MessageConvert_TaskApproved_FMT'), approveinfo.processName);
    },

    convertManualRemind: function (obj) {
        var me = this,
            remindinfo;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Notify.ashx'),
            params: {
                Method: 'GetProcessRemindInfo',
                stepid: obj.manualRemind
            },
            success: function (action) {
                remindinfo = action.result;
            }
        });

        if (!remindinfo)
            return RS.$('All__MessageConvert_TaskDeleted');


        return Ext.String.format([
            '<div class="processremind-wrap {8}" stepid="{0}" taskid="{9}" processName="{3}">',
            '<div class="processremind-base">',
            '<div class="comments">{1}</div>',
            '<div class="processname">{3}</div>',
            '<div class="sn">{5}{2}</div>',
            '<div class="createat">{6}{4}</div>',
            '</div>',
            '<div class="notify-more processremind-more">',
            '<div class="detail">{7}</div>',
            '</div>',
            '</div>'
        ].join(''),
            remindinfo.stepid,
            Ext.String.format('{0} : {1}', obj.senderShortName, obj.comments || RS.$('All__Remind')),
            remindinfo.sn,
            Ext.String.format(RS.$('All__RemindTitle'), remindinfo.ownerDisplayName || remindinfo.ownerAccount, remindinfo.processName),
            Ext.Date.format(remindinfo.createat, 'Y-m-d H:i'),
            RS.$('All__MessageConvert_SN'),
            RS.$('All__MessageConvert_PostAt'),
            remindinfo.finished ? RS.$('All__ShowDetail') : RS.$('All__GoProcess'),
            remindinfo.finished ? 'processremind-finished' : 'processremind-running',
            remindinfo.taskid
        );
    },

    convertSystemRemind: function (obj) {
        var me = this,
            remindinfo;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Notify.ashx'),
            params: {
                Method: 'GetProcessRemindInfo',
                stepid: obj.systemRemind
            },
            success: function (action) {
                remindinfo = action.result;
            }
        });

        if (!remindinfo)
            return RS.$('All__MessageConvert_TaskDeleted');


        return Ext.String.format([
            '<div class="processremind-wrap {8}" stepid="{0}" taskid="{9}" processName="{3}">',
            '<div class="processremind-base">',
            '<div class="comments">{1}</div>',
            '<div class="processname">{3}</div>',
            '<div class="sn">{5}{2}</div>',
            '<div class="createat">{6}{4}</div>',
            '</div>',
            '<div class="notify-more processremind-more">',
            '<div class="detail">{7}</div>',
            '</div>',
            '</div>'
        ].join(''),
            remindinfo.stepid,
            RS.$('All__SystemRemind'),
            remindinfo.sn,
            Ext.String.format(RS.$('All__RemindTitle'), remindinfo.ownerDisplayName || remindinfo.ownerAccount, remindinfo.processName),
            Ext.Date.format(remindinfo.createat, 'Y-m-d H:i'),
            RS.$('All__MessageConvert_SN'),
            RS.$('All__MessageConvert_PostAt'),
            remindinfo.finished ? RS.$('All__ShowDetail') : RS.$('All__GoProcess'),
            remindinfo.finished ? 'processremind-finished' : 'processremind-running',
            remindinfo.taskid
        );
    },

    convertManualRemindLM: function (obj) {
        return Ext.String.format('{0} : {1}', obj.senderShortName, obj.comments || '');
    },

    convertSystemRemindLM: function (obj) {
        return Ext.String.format(RS.$('All__SystemRemind'));
    },

    replacer: function (str, p1, p2, offset, s) {
        var me = this,
            msg = str.substr(1, str.length - 2) || '',
            index = msg.indexOf(':'),
            items = msg.split(':'),
            type = index != -1 ? msg.substr(0, index) : '',
            id = index != -1 ? msg.substr(index + 1) : '';

        return me.convertItem(type, id);
    },

    replacerLM: function (str, p1, p2, offset, s) {
        var me = this,
            msg = str.substr(1, str.length - 2) || '',
            index = msg.indexOf(':'),
            items = msg.split(':'),
            type = index != -1 ? msg.substr(0, index) : '',
            id = index != -1 ? msg.substr(index + 1) : '';

        return me.convertItemLM(type, id);
    },

    replacerFace: function (str, p1, p2, offset, s) {
        var me = this,
            faceText = str.substr(1, str.length - 2),
            faces = Ext.Array.union(YZSoft.src.panel.social.Faces.qq),
            findFace;

        Ext.Array.each(faces, function (face) {
            if (face.text == faceText) {
                findFace = face;
                return false;
            }
        });

        if (findFace)
            return Ext.String.format('{qqface:{0}}', findFace.id);

        return '[' + faceText + ']';
    }
});
