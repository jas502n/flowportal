
Ext.define('YZSoft.src.xform.FormContainer', {
    override: 'Ext.Container',

    constructor: function (config) {
        this.callParent(arguments);

        if (config && config.formInfo)
            this.formInfo = config.formInfo;

        if (this.$autoFireFormLoad())
            this.fireEvent('formload');
    },

    $autoFireFormLoad: function () {
        return true;
    },

    $applyFormState: function (formInfo) {
        var me = this,
            formdataset = formInfo && formInfo.formdataset,
            fields;

        if (!formdataset)
            return;

        fields = me.$getFieldsArrayBy(function (field) {
            return field.config && field.config.xdatabind;
        });

        Ext.each(fields, function (field) {
            var column = me.$getColumn(formInfo.formdataset, field.config && field.config.xdatabind);
            if (column)
                me.$applyWritable(field, column.Writeable);
        });
    },

    $getFormData: function (formInfo) {
        var me = this,
            formInfo = formInfo || me.formInfo,
            fields, data = {}, vars = {};

        fields = me.$getFieldsArrayBy(function (field) {
            return (field.config && field.config.xdatabind) || field.isRepeaterContainer;
        }, function (field) {
            return field.isRepeaterContainer;
        });

        me.$getFormDataInner(formInfo, fields, true, data, vars);

        return {
            vars: vars,
            FormData: data
        };
    },

    $getFormDataInner: function (formInfo, fields, isGetMasterTable, data, vars) {
        var me = this;

        Ext.each(fields, function (field) {
            if (field.isRepeaterContainer) {
                var detailData = {},
                    items = field.getRepeaterItems();

                Ext.each(items, function (item) {
                    var blockData = {},
                        blockVar = {},
                        blockFields;

                    blockFields = me.$getFieldsArrayBy(function (field) {
                        return (field.config && field.config.xdatabind) || field.isRepeaterContainer;
                    }, function (field) {
                        return field.isRepeaterContainer;
                    }, item);

                    me.$getFormDataInner(formInfo, blockFields, false, blockData, blockVar);

                    Ext.Object.each(blockData, function (tableName, value) {
                        var table = detailData[tableName] = detailData[tableName] || [];
                        Ext.Array.each(value, function (row) {
                            var blockRow = Ext.apply(row, {
                                $vars: blockVar
                            });

                            if (item.srcRow) {
                                var schemaTable = formInfo.formdataset[tableName];
                                if (schemaTable) {
                                    var keys = {};
                                    Ext.Object.each(schemaTable.Columns, function (columnName, column) {
                                        if (column.PrimaryKey && item.srcRow.hasOwnProperty(columnName)) {
                                            keys[columnName] = item.srcRow[columnName];
                                        }
                                    });

                                    blockRow['RowPrimaryKeys'] = Ext.Object.toQueryString(keys);
                                }
                            }

                            table.push(blockRow);
                        });
                    });
                });

                Ext.apply(data, detailData);
            }
            else {
                var $var = me.$getVar(formInfo.formdataset, field.config && field.config.xdatabind),
                    table = $var && $var.table,
                    column = $var && $var.column,
                    value = me.$getFieldValue(field, fields);

                if ($var.isVar) {
                    if (value)
                        vars[$var.name] = value.value;

                    return;
                }

                if (!column)
                    return;

                if (!table.IsRepeatable || !isGetMasterTable) {
                    var datatable = data[table.TableName] = data[table.TableName] || [{}],
                        row = datatable[0];

                    if (value)
                        row[column.ColumnName] = me.$parseFieldValue(value.value, column);
                }
            }
        });
    },

    $getCheckboxGroupMembers: function (field, fields) {
        var me = this,
            xdatabind = field.config && field.config.xdatabind,
            items = [];

        if (!xdatabind)
            return [field];

        Ext.Array.each(fields, function (field) {
            if (field.isCheckbox) {
                var itemxdatabind = field.config && field.config.xdatabind;
                if (String.Equ(itemxdatabind, xdatabind))
                    items.push(field);
            }
        });

        return items;
    },

    $gettCheckboxValue: function (field, fields) {
        var me = this,
            items = me.$gettCheckboxGroupMembers(field, fields),
            vs = [];

        if (items.length == 1)
            return field.getSubmitValue();

        Ext.Array.each(items, function (item) {
            if (item.isChecked())
                vs.push(item.getSubmitValue());
        });

        return vs.join(',');
    },

    $settCheckboxValue: function (field, value, fields) {
        var me = this,
            items = me.$gettCheckboxGroupMembers(field, fields),
            vs = (value || '').toString().split(',');

        if (items.length == 1) {
            field.setChecked((!!value));
            return;
        }

        Ext.each(items, function (item) {
            item.setChecked(me.$stringArrayContains(vs, item._value));
        });
    },

    $stringArrayContains: function (arr, n) {
        if (!arr || !n)
            return false;

        for (var i = 0; i < arr.length; i++) {
            if (String.Equ(arr[i], n))
                return true;
        }

        return false;
    },

    $getFieldValue: function (field, fields) {
        var me = this,
            value;

        if (field.isRadio) {
            if (field.isChecked()) {
                value = {
                    value: field.getValue()
                };
            }
        }
        else if (field.isCheckbox) {
            value = {
                value: me.$gettCheckboxValue(field, fields)
            };
        }
        else {
            value = {
                value: field[field.getSubmitValue ? "getSubmitValue" : "getValue"]()
            };
        }

        return value;
    },

    $setFormData: function (postModel, formInfo, currow) {
        var me = this,
            fields, data = {}, vars = {};

        fields = me.$getFieldsArrayBy(function (field) {
            return (field.config && field.config.xdatabind) || field.isRepeaterContainer;
        }, function (field) {
            return field.isRepeaterContainer;
        });

        me.$setFormDataInner(postModel, formInfo, fields, true, currow);
    },

    $setFormDataInner: function (postModel, formInfo, fields, isSetRepeatData, currow) {
        var me = this;

        Ext.each(fields, function (field) {
            if (field.isRepeaterContainer) {
                if (!field.$xformlistener) {
                    field.on({
                        scope: me,
                        blockCreated: function (repearterContainer, repearterItem) {
                            me.$onBlockCreated(formInfo, repearterContainer, repearterItem)
                        }
                    })

                    field.$xformlistener = true;
                }

                var table = me.$getRepeaterFieldBindTable(formInfo, field),
                    rows = (table && table.Rows) || [],
                    i;

                if ((postModel && rows.length) ||
                    (postModel && table && !table.AllowAddRecord) ||
                    !postModel) {
                    field.setBlockCount(rows.length);
                    for (i = 0; i < rows.length; i++) {
                        var block = field.getRepeaterItem(i),
                        row = rows[i];

                        block.$setFormData(postModel, formInfo, row);
                        block.srcRow = row;
                    }
                }

                if (table) {
                    field.setAllowAddRecord(table.AllowAddRecord)
                }
            }
            else {
                var $var = me.$getVar(formInfo.formdataset, field.config && field.config.xdatabind),
                    table = $var && $var.table,
                    column = $var && $var.column,
                    row, value;

                if (!table || !column)
                    return;

                if (currow)
                    row = currow;
                else
                    row = formInfo.formdataset[table.TableName].Rows[0];

                value = row[column.ColumnName];

                if (row.hasOwnProperty(column.ColumnName)) {
                    if (field.isRadio) {
                        field.setChecked(value == field._value || String.Equ(value,field._value));
                    }
                    else if (field.isCheckbox) {
                        me.$settCheckboxValue(field, value, fields);
                    }
                    else {
                        if (field.xtype == 'field')
                            field.setHtml(YZSoft.$1(me.$formatFieldValue(value, column)));
                        else
                            field[field.setFormValue ? "setFormValue" : "setValue"](me.$formatFieldValue(value, column));
                    }
                }
            }
        });
    },

    $parseFieldValue: function (value, column) {
        return value;
    },

    $formatFieldValue: function (value, column) {
        return value;
    },

    $applyWritable: function (field, writeable) {
        if (!writeable) {
            if (field.getDisabled && field.getReadOnly && field.setReadOnly) {
                if (!field.getDisabled() && !field.getReadOnly())
                    field.setReadOnly(true);
            }
        }
        else {
            field.addCls('yz-field-editable');
        }
    },

    $getFieldsArrayBy: function (fn, $break, from) {
        var me = this,
            fields = [],
            from = from || me;

        var getFields = function (item) {
            if (fn(item)) {
                fields.push(item);
            }

            if (item.isContainer) {
                if (!$break || !$break(item)) {
                    item.items.each(getFields);
                }
            }
        };

        from.items.each(getFields);
        return fields;
    },

    $getVar: function (formdataset, varname) {
        var me = this,
            varMaps = me.$varMaps || {},
            $var;

        if (!varname)
            return;

        $var = varMaps[varname];
        if ($var)
            return $var;

        $var = varMaps[varname] = me.$parseVarName(formdataset, varname);
        return $var
    },

    $getColumn: function (formdataset, varname) {
        var me = this,
            $var = me.$getVar(formdataset, varname);

        return $var && $var.column;
    },

    $parseVarName: function (formdataset, varname) {
        var me = this,
            names, len;

        if (!varname)
            return;

        names = varname.split('.');
        len = names.length;

        if (len == 0)
            return null;

        if (len == 1) {
            return {
                isVar: true,
                name: varname
            };
        }

        var tableName = names[len - 2],
            columnName = names[len - 1],
            $var, table, column;

        $var = {
            isVar: true,
            name: varname
        };

        table = formdataset && (formdataset[tableName] || formdataset[tableName.toUpperCase()]);
        column = table && (table.Columns[columnName] || table.Columns[columnName.toUpperCase()]);
        if (column) {
            return {
                isColumn: true,
                tableName: tableName,
                columnName: columnName,
                table: table,
                column: column
            };
        }
        else {
            return {
                isVar: true,
                name: varname
            };
        }
    },

    $getRepeaterFieldBindTable: function (formInfo, field) {
        var me = this,
            item = field.createRepeaterItem(null, true),
            i;

        blockFields = me.$getFieldsArrayBy(function (field) {
            return (field.config && field.config.xdatabind);
        }, function (field) {
            return field.isRepeaterContainer;
        }, item);

        for (i = 0; i < blockFields.length; i++) {
            var field = blockFields[i],
                $var = me.$getVar(formInfo.formdataset, field.config && field.config.xdatabind),
                table = $var && $var.table;

            if (table)
                return table;
        }
    },

    $onBlockCreated: function (formInfo, repearterContainer, repearterItem) {
        repearterItem.$applyFormState(formInfo);
    }
});