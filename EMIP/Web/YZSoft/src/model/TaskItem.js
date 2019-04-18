Ext.define('YZSoft.src.model.TaskItem', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'TaskID',
        fields: [
            { name: 'TaskID', type: 'int' },
            { name: 'SerialNum', type: 'string' },
            { name: 'ProcessName', type: 'string' },
            { name: 'ProcessVersion', type: 'string' },
            { name: 'OwnerAccount', type: 'string' },
            { name: 'OwnerDisplayName', type: 'string' },
            { name: 'AgentAccount', type: 'string' },
            { name: 'AgentDisplayName', type: 'string' },
            { name: 'CreateAt', type: 'date' },
            { name: 'State', type: 'object' },
            { name: 'Description', type: 'string' },
            { name: 'ShortName', type: 'string' },
            { name: 'Color', type: 'string' },
            { name: 'StatusClass', convert: function (v, record) {
                var obj = record.data.State,
                        state = obj.State;

                if (state)
                    state = state.toLowerCase();

                return 'yz-task-status-' + state;
            }
            },
            { name: 'StatusText', convert: function (v, record) {
                var obj = record.data.State,
                        state = obj.State,
                        steps = obj.children;

                if (state)
                    state = state.toLowerCase();

                switch (state) {
                    case 'running':
                        return RS.$('All__Running');
                        var stepNames = [];
                        Ext.each(steps, function (step) {
                            stepNames.push(step.StepName);
                        });
                        return stepNames.join('<br/>');
                    case 'approved':
                        return RS.$('All_BPM_Approved');
                    case 'rejected':
                        return RS.$('All_BPM_Rejected');
                    case 'aborted':
                        return RS.$('All_BPM_Aborted');
                    case 'deleted':
                        return RS.$('All_BPM_Deleted');
                    default:
                        return RS.$('All_BPM_UnknownStatus');
                }
            }
            },
            { name: 'ProcessingSteps', convert: function (v, record) {
                var obj = record.data.State,
                    state = obj.State,
                    steps = obj.children;

                if (state)
                    state = state.toLowerCase();

                switch (state) {
                    case 'running':
                        var stepNames = [];
                        Ext.each(steps, function (step) {
                            var stepText = step.StepName;

                            if(step.RecipientDisplayName)
                                stepText += '(' + step.RecipientDisplayName + ')';

                            stepNames.push(stepText);
                        });
                        return stepNames.join(',');
                    default:
                        return '';
                }
            }
            }
        ]
    }
});