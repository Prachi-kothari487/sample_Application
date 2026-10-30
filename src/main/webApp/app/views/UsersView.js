
Ext.define('MusicApp.view.UsersView', {
    extend: 'Ext.Container',
    xtype: 'usersview',

    layout: 'vbox',
    scrollable: true,
    padding: 24,

    items: [
        {
            xtype: 'container',
             layout: {
                type: 'hbox',
                align: 'middle'
            },
            margin: '0 0 24 0',
            items: [
                {
                    xtype: 'component',
                    flex: 1,
                    html: `
                        <div style="font-size:28px; font-weight:600; color:#202938;">
                            User Management
                        </div>
                        <div style="font-size:14px; color:#778095; margin-top:8px;">
                            Manage users and their access to Music-application
                        </div>
                    `
                },
                {
                    xtype: 'button',
                    text: '+ Add User',
                    ui: 'action',


                    handler: function () {
                        var form = Ext.create('Ext.form.Panel', {
                            title: 'Add New User',
                            width: 450,
                            bodyPadding: 20,
                            defaults: {
                                xtype: 'textfield',
                                labelAlign: 'top',
                                width: '100%',
                                required: true
                            },
                            items: [
                                {
                                    name: 'username',
                                    label: 'Username',
                                    placeholder: 'Enter username'
                                },
                                {
                                    name: 'password',
                                    label: 'Password',
                                    inputType: 'password',
                                    placeholder: 'Enter password'
                                },
                                {
                                    name: 'firstname',
                                    label: 'First Name',
                                    placeholder: 'Enter first name'
                                },
                                {
                                    name: 'lastname',
                                    label: 'Last Name',
                                    placeholder: 'Enter last name'
                                },
                                {
                                    name: 'email',
                                    label: 'Email',
                                    inputType: 'email',
                                    placeholder: 'Enter email'
                                },
                                {
                                    xtype: 'selectfield',
                                    name: 'role',
                                    label: 'Role',
                                    options: [
                                        { text: 'User', value: 'User' },
                                        { text: 'Admin', value: 'Admin' }
                                    ],
                                    value: 'User'
                                },
                                {
                                    xtype: 'selectfield',
                                    name: 'status',
                                    label: 'Status',
                                    options: [
                                        { text: 'Active', value: 'Active' },
                                        { text: 'Inactive', value: 'Inactive' }
                                    ],
                                    value: 'Active'
                                }
                            ],
                            buttons: [
                                {
                                    text: 'Cancel',
                                    handler: function () {
                                        windowForm.destroy();
                                    }
                                },
                                {
                                    text: 'Save User',
                                    ui: 'action',
                                    handler: function () {
                                        var values = form.getValues();

                                        if (!values.username || !values.password ||
                                            !values.firstname || !values.lastname ||
                                            !values.email || !values.role || !values.status) {
                                            Ext.Msg.alert('Validation', 'Please fill all fields.');
                                            return;
                                        }

                                        fetch('/sample-application/api/users', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            credentials: 'same-origin',
                                            body: JSON.stringify(values)
                                        })
                                            .then(function (response) {
                                                if (!response.ok) {
                                                    throw new Error('Could not create user. Check the entered details.');
                                                }
                                                return response.json();
                                            })
                                            .then(function () {
                                                windowForm.destroy();
                                                Ext.Msg.alert('Success', 'User created successfully!');

                                                var grid = Ext.ComponentQuery.query('usersview grid')[0];
                                                if (grid) {
                                                    grid.getStore().reload();
                                                }
                                            })
                                            .catch(function (error) {
                                                Ext.Msg.alert('Error', error.message);
                                            });
                                    }
                                }
                            ]
                        });

                        var windowForm = Ext.create('Ext.Dialog', {
                            title: 'Add User',
                            width: 480,
                            maxHeight: '90%',
                            scrollable: true,
                            closable: true,
                            modal: true,
                            items: [form]
                        });

                        windowForm.show();
                    }


                }
            ]
        },
        {
            xtype: 'container',
            style: {
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
            },
            padding: 20,
            width: '100%',
            items: [

                {
                    xtype: 'textfield',
                    label: 'Search Users',
                    placeholder: 'Search by username, name, or email...',
                    clearable: true,
                    width: '100%',

                    listeners: {
                        change: function (field, newValue) {
                            var grid = Ext.ComponentQuery.query('usersview grid')[0];

                            if (!grid) {
                                return;
                            }

                            var store = grid.getStore();
                            var searchText = (newValue || '').toLowerCase().trim();

                            store.clearFilter();

                            if (searchText) {
                                store.filterBy(function (record) {
                                    return (
                                        (record.get('name') || '').toLowerCase().includes(searchText) ||
                                        (record.get('firstname') || '').toLowerCase().includes(searchText) ||
                                        (record.get('lastname') || '').toLowerCase().includes(searchText) ||
                                        (record.get('email') || '').toLowerCase().includes(searchText)
                                    );
                                });
                            }
                        }
                    }
                },


                {
                    xtype: 'grid',
                    width: '100%',
                    minHeight: 350,
                    margin: '16 0 0 0',

                    store: {
                        fields: [
                            'id',
                            'name',
                            'firstname',
                            'lastname',
                            'email',
                            'role',
                            'status'
                        ],

                        autoLoad: true,

                        proxy: {
                            type: 'ajax',
                            url: '/sample-application/api/users',
                            reader: {
                                type: 'json'
                            }
                        }
                    },

                    columns: [
                        {
                            text: 'ID',
                            dataIndex: 'id',
                            width: 70
                        },
                        {
                            text: 'Username',
                            dataIndex: 'name',
                            flex: 1
                        },
                        {
                            text: 'First Name',
                            dataIndex: 'firstname',
                            flex: 1
                        },
                        {
                            text: 'Last Name',
                            dataIndex: 'lastname',
                            flex: 1
                        },
                        {
                            text: 'Email',
                            dataIndex: 'email',
                            flex: 2
                        },
                        {
                            text: 'Role',
                            dataIndex: 'role',
                            flex: 1
                        },
                        {
                            text: 'Status',
                            dataIndex: 'status',
                            flex: 1
                        },

                        {
                            text: 'Action',
                            width: 100,
                            cell: {
                                tools: {
                                    edit: {
                                        iconCls: 'x-fa fa-edit',
                                        text: 'Edit',

                                        handler: function (grid, location) {
                                            var record = location.record;

                                            var form = Ext.create('Ext.form.Panel', {
                                                bodyPadding: 20,

                                                defaults: {
                                                    xtype: 'textfield',
                                                    labelAlign: 'top',
                                                    width: '100%'
                                                },

                                                items: [
                                                    {
                                                        name: 'name',
                                                        label: 'Username',
                                                        value: record.get('name'),
                                                        required: true
                                                    },
                                                    {
                                                        name: 'firstname',
                                                        label: 'First Name',
                                                        value: record.get('firstname')
                                                    },
                                                    {
                                                        name: 'lastname',
                                                        label: 'Last Name',
                                                        value: record.get('lastname')
                                                    },
                                                    {
                                                        name: 'email',
                                                        label: 'Email',
                                                        value: record.get('email')
                                                    },
                                                    {
                                                        xtype: 'selectfield',
                                                        name: 'role',
                                                        label: 'Role',
                                                        value: record.get('role'),
                                                        options: [
                                                            { text: 'User', value: 'User' },
                                                            { text: 'Admin', value: 'Admin' }
                                                        ]
                                                    },
                                                    {
                                                        xtype: 'selectfield',
                                                        name: 'status',
                                                        label: 'Status',
                                                        value: record.get('status'),
                                                        options: [
                                                            { text: 'Active', value: 'Active' },
                                                            { text: 'Inactive', value: 'Inactive' }
                                                        ]
                                                    }
                                                ]
                                            });

                                            var windowForm = Ext.create('Ext.Dialog', {
                                                title: 'Edit User',
                                                width: 480,
                                                maxHeight: '90%',
                                                scrollable: true,
                                                modal: true,
                                                items: [form],

                                                buttons: [
                                                    {
                                                        text: 'Cancel',
                                                        handler: function () {
                                                            windowForm.destroy();
                                                        }
                                                    },
                                                    {
                                                        text: 'Save Changes',
                                                        ui: 'action',

                                                        handler: function () {
                                                            var values = form.getValues();

                                                            if (!values.name) {
                                                                Ext.Msg.alert(
                                                                    'Validation',
                                                                    'Username is required.'
                                                                );
                                                                return;
                                                            }

                                                            var updates = {};

                                                            ['name', 'firstname', 'lastname',
                                                                'email', 'role', 'status'].forEach(function (field) {
                                                                if (values[field] !== record.get(field)) {
                                                                    updates[field] = values[field];
                                                                }
                                                            });

                                                            if (Object.keys(updates).length === 0) {
                                                                windowForm.destroy();
                                                                return;
                                                            }

                                                            fetch('/sample-application/api/users/' + record.get('id'), {
                                                                method: 'PATCH',
                                                                headers: {
                                                                    'Content-Type': 'application/json'
                                                                },
                                                                credentials: 'same-origin',
                                                                body: JSON.stringify(updates)
                                                            })
                                                                .then(function (response) {
                                                                    if (!response.ok) {
                                                                        throw new Error('Could not update user.');
                                                                    }

                                                                    windowForm.destroy();

                                                                    Ext.Msg.alert(
                                                                        'Success',
                                                                        'User updated successfully!'
                                                                    );

                                                                    var usersGrid =
                                                                        Ext.ComponentQuery.query('usersview grid')[0];

                                                                    if (usersGrid) {
                                                                        usersGrid.getStore().reload();
                                                                    }
                                                                })
                                                                .catch(function (error) {
                                                                    Ext.Msg.alert('Error', error.message);
                                                                });
                                                        }
                                                    }
                                                ]
                                            });

                                            windowForm.show();
                                        }

                                    }
                                }
                            }
                        }

                    ]
                },

            ]
        }
    ]
});
