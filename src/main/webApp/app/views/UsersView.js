
Ext.define('MusicApp.view.UsersView', {
    extend: 'Ext.Container',
    xtype: 'usersview',
    cls: 'cappuccino-users-view',
    layout: 'vbox',
    scrollable: true,


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
                    cls: 'users-page-heading',
                    flex: 1,
                    html: `
    <div class="users-title">
        User Management
    </div>
    <div class="users-subtitle">
        Manage users and their access to MusicVault
    </div>
`
                },
                {
                    xtype: 'button',
                    text: '+ Add User',
                    cls: 'add-user-button',
                    ui:'plain',
                    width: 150,
                    height:56,



                    handler: function () {
                        var emailCheckRequestId = 0;
                        var emailAlreadyExists = false;
                        var emailCheckInProgress = false;
                        var windowForm=null;
                        var form = Ext.create('Ext.form.Panel', {

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
                                    placeholder: 'Enter password',
                                    minLength: 8,
                                    maxLength: 16,
                                    enforceMaxLength: true,

                                    listeners: {
                                        change: function (field, newValue) {

                                            var validationBox = field.up('formpanel').down('#passwordValidation');

                                            if (!newValue) {
                                                validationBox.hide();
                                                return;
                                            }

                                            validationBox.show();

                                            var rules = [
                                                {
                                                    text: '8 to 16 characters',
                                                    valid: newValue.length >= 8 && newValue.length <= 16
                                                },
                                                {
                                                    text: 'At least one uppercase letter (A-Z)',
                                                    valid: /[A-Z]/.test(newValue)
                                                },
                                                {
                                                    text: 'At least one lowercase letter (a-z)',
                                                    valid: /[a-z]/.test(newValue)
                                                },
                                                {
                                                    text: 'At least one number (0-9)',
                                                    valid: /[0-9]/.test(newValue)
                                                },
                                                {
                                                    text: 'At least one special character',
                                                    valid: /[^A-Za-z0-9\s]/.test(newValue)
                                                },
                                                {
                                                    text: 'No spaces or whitespace',
                                                    valid: !/\s/.test(newValue)
                                                }
                                            ];

                                            var html = rules.map(function (rule) {

                                                var color = rule.valid ? '#4F8A5B' : '#B85C50';
                                                var symbol = rule.valid ? '&#10003;' : '&#10007;';

                                                return `
                    <div style="color:${color}; margin-bottom:5px;">
                        ${symbol} ${rule.text}
                    </div>
                `;

                                            }).join('');

                                            var allValid = rules.every(function (rule) {
                                                return rule.valid;
                                            });

                                            if (allValid) {
                                                html += `
                    <div style="color:#4F8A5B; font-weight:600; margin-top:6px;">
                        Password looks good!
                    </div>
                `;
                                            }

                                            validationBox.setHtml(html);
                                        }
                                    }
                                },

                                {
                                    xtype: 'component',
                                    itemId: 'passwordValidation',
                                    hidden: true,
                                    cls: 'password-validation-message',
                                    margin: '0 0 12 0',
                                    html: ''
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
                                    itemId: 'emailField',
                                    label: 'Email',
                                    inputType: 'email',
                                    placeholder: 'Enter email',

                                    listeners: {
                                        blur:function (field){
                                            var email=(field.getValue()||'').trim();

                                            if(!email){
                                                return ;
                                            }
                                            checkEmailExists(email);
                                        },
                                        change:function (field,newValue){
                                            emailCheckRequestId++;
                                            emailAlreadyExists=false;
                                            emailCheckInProgress=false;

                                            var validationBox=form.down('#emailValidation');

                                            if(validationBox){
                                                validationBox.hide();
                                                validationBox.setHtml('');
                                            }
                                            updateSaveButton();
                                        }
                                    }


                                },
                                {
                                    xtype: 'component',
                                    itemId: 'emailValidation',
                                    hidden: true,
                                    margin:'0 0 12 0',
                                    html:''
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
                            ]
                        });
                        function updateSaveButton(){
                            var saveButton=windowForm && windowForm.down('#saveUserButton');

                            if(saveButton){
                                saveButton.setDisabled(emailAlreadyExists||emailCheckInProgress);
                            }
                        }
                        function showEmailMessage(message, color) {
                            var validationBox = form.down('#emailValidation');

                            if (!validationBox) {
                                return;
                            }

                            validationBox.setHtml(
                                '<div style="color:' + color + '; margin-top:4px;">' +
                                message +
                                '</div>'
                            );

                            validationBox.show();
                        }

                        function checkEmailExists(email) {

                            var requestId = ++emailCheckRequestId;

                            emailCheckInProgress = true;
                            updateSaveButton();

                            return fetch(
                                '/sample-application/api/users/check-email?email=' +
                                encodeURIComponent(email),
                                {
                                    method: 'GET',
                                    credentials: 'same-origin'
                                }
                            )
                                .then(function (response) {

                                    if (!response.ok) {
                                        throw new Error('Unable to verify email.');
                                    }

                                    return response.json();
                                })
                                .then(function (exists) {

                                    if (requestId !== emailCheckRequestId) {
                                        return null;
                                    }

                                    emailAlreadyExists = exists === true;

                                    if (emailAlreadyExists) {

                                        showEmailMessage(
                                            'This email already exists.',
                                            '#B85C50'
                                        );

                                    } else {

                                        showEmailMessage(
                                            'Email is available.',
                                            '#4F8A5B'
                                        );
                                    }

                                    return emailAlreadyExists;
                                })
                                .catch(function () {

                                    if (requestId === emailCheckRequestId) {

                                        // Fail closed: don't allow saving if verification fails.
                                        emailAlreadyExists = true;

                                        showEmailMessage(
                                            'Could not verify email. Please try again.',
                                            '#B85C50'
                                        );
                                    }

                                    return null;
                                })
                                .finally(function () {

                                    if (requestId === emailCheckRequestId) {

                                        emailCheckInProgress = false;
                                        updateSaveButton();
                                    }
                                });
                        }


                         windowForm = Ext.create('Ext.Dialog', {
                            title: 'Add User',
                            cls: 'add-user-dialog cappuccino-form-dialog',
                            width: 480,
                            maxHeight: '90%',
                            scrollable: true,
                            closable: true,
                            modal: true,

                            items: [form],

                            buttons: [
                                {
                                    text: 'Cancel',
                                    ui: 'plain',
                                    cls: 'cappuccino-dialog-cancel',
                                    handler: function () {
                                        windowForm.destroy();
                                    }
                                },
                                {
                                    text: 'Save User',
                                    ui: 'plain',
                                    itemId: 'saveUserButton',
                                    cls: 'cappuccino-dialog-save',
                                    handler: function () {
                                        var values = form.getValues();

                                        if (!values.username || !values.password ||
                                            !values.firstname || !values.lastname ||
                                            !values.email || !values.role || !values.status) {

                                            Ext.Msg.alert(
                                                'Validation',
                                                'Please fill all fields.'
                                            );
                                            return;
                                        }
                                        var passwordRegex =
                                            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s])\S{8,16}$/;

                                        if (!passwordRegex.test(values.password)) {

                                            Ext.Msg.alert(
                                                'Invalid Password',
                                                'Password must contain 8-16 characters, at least one uppercase letter, one lowercase letter, one number and one special character. Spaces are not allowed.'
                                            );

                                            return;
                                        }
                                        values.email=values.email.trim();

                                        checkEmailExists(values.email).then(function (exists) {

                                            if (exists === null) {

                                                Ext.Msg.alert(
                                                    'Error',
                                                    'Unable to verify email. Please try again.'
                                                );

                                                return;
                                            }

                                            if (exists === true) {
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
                                                        throw new Error(
                                                            'Could not create user. Check the entered details.'
                                                        );
                                                    }

                                                    return response.json();
                                                })
                                                .then(function () {

                                                    windowForm.destroy();

                                                    Ext.Msg.alert(
                                                        'Success',
                                                        'User created successfully!'
                                                    );

                                                    var grid = Ext.ComponentQuery.query(
                                                        'usersview grid'
                                                    )[0];

                                                    if (grid) {
                                                        grid.getStore().reload();
                                                    }
                                                })
                                                .catch(function (error) {

                                                    Ext.Msg.alert('Error', error.message);
                                                });
                                        });
                                                                         }
                                }
                            ]
                        });

                        windowForm.show();
                    }



                }
            ]
        },
        {
            xtype: 'container',
            cls: 'users-content-panel',

            width: '100%',
            items: [

                {
                    xtype: 'textfield',
                    cls: 'cappuccino-search-field',
                    itemId: 'usersSearchField',
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
                            var searchText = (newValue || '').trim();

                            // Search results always start from page 1
                            store.currentPage = 1;

                            // Send search text to backend
                            store.load({
                                params: {
                                    page: 1,
                                    size: 12,
                                    search: searchText
                                }
                            });
                        }
                    }

                },


                {
                    xtype: 'grid',
                    cls: 'cappuccino-users-grid',
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
                        currentPage: 1,
                        totalPages: 1,

                        proxy: {
                            type: 'ajax',
                            url: '/sample-application/api/users/page',

                            extraParams: {
                                page: 1,
                                size: 12
                            },

                            reader: {
                                type: 'json',
                                rootProperty: 'users',
                                keepRawData: true
                            }
                        },


                        listeners: {
                            load: function (store, records, successful) {

                                if (!successful) {
                                    return;
                                }

                                var data = store.getProxy().getReader().rawData;

                                if (!data) {
                                    console.error('User pagination data not found');
                                    return;
                                }

                                store.currentPage = data.currentPage;
                                store.totalPages = data.totalPages;

                                var usersView = Ext.ComponentQuery.query('usersview')[0];

                                if (usersView) {
                                    usersView.updateUsersPagination(
                                        data.currentPage,
                                        data.totalPages
                                    );
                                }
                            }
                        }
                    },



                    columns: [
                        {
                            text: 'ID',
                            dataIndex: 'id',
                            width: 65
                        },
                        {
                            text: 'Username',
                            dataIndex: 'name',
                            width:145
                        },
                        {
                            text: 'First Name',
                            dataIndex: 'firstname',
                            width:135
                        },
                        {
                            text: 'Last Name',
                            dataIndex: 'lastname',
                            width:135
                        },
                        {
                            text: 'Email',
                            dataIndex: 'email',
                            flex: 2,
                            minWidth:190
                        },
                        {
                            text: 'Role',
                            dataIndex: 'role',
                            width:115
                        },
                        {
                            text: 'Status',
                            dataIndex: 'status',
                            width:125
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
                                                cls: 'cappuccino-form-dialog',
                                                buttons: [
                                                    {
                                                        text: 'Cancel',
                                                        ui: 'plain',
                                                        cls: 'cappuccino-dialog-cancel',
                                                        handler: function () {
                                                            windowForm.destroy();
                                                        }
                                                    },
                                                    {
                                                        text: 'Save Changes',
                                                        ui: 'plain',
                                                        cls: 'cappuccino-dialog-save',
                                                        handler: function () {
                                                            var values = form.getValues();

                                                            if (!values.name) {
                                                                Ext.Msg.alert(
                                                                    'Validation',
                                                                    'Username is required.',
                                                                    null,
                                                                    {
                                                                        cls: 'cappuccino-alert'
                                                                    }
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
                                                                        'User updated successfully!',
                                                                        null,
                                                                        {
                                                                            cls: 'cappuccino-alert'
                                                                        }
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

                                    },
                                    delete: {
                                        iconCls: 'x-fa fa-trash',
                                        text: 'Delete',

                                        handler: function (grid, location) {

                                            var record = location.record;
                                            var userId = record.get('id');

                                            Ext.Msg.confirm(
                                                'Confirm Delete',
                                                'Are you sure you want to delete this user?',
                                                function (button) {

                                                    if (button === 'yes') {

                                                        fetch('/sample-application/api/users/' + userId, {
                                                            method: 'DELETE',
                                                            credentials: 'same-origin'
                                                        })
                                                            .then(function (response) {

                                                                if (!response.ok) {
                                                                    throw new Error('Could not delete user.');
                                                                }

                                                                Ext.Msg.alert(
                                                                    'Success',
                                                                    'User deleted successfully!'
                                                                );

                                                                grid.getStore().reload();
                                                            })
                                                            .catch(function (error) {
                                                                Ext.Msg.alert('Error', error.message);
                                                            });
                                                    }
                                                }
                                            );
                                        }
                                    }
                                }
                            }
                        }

                    ]
                },

                {
                    xtype: 'container',
                    itemId: 'usersPagination',
                    cls: 'cappuccino-pagination',

                    width: '100%',
                    margin: '20 0',

                    layout: {
                        type: 'hbox',
                        pack: 'center',
                        align: 'center'
                    },

                    items: [
                        {
                            xtype: 'button',
                            itemId: 'usersPrevPage',
                            iconCls: 'x-fa fa-chevron-left',
                            ui: 'plain',
                            cls: 'cappuccino-page-arrow',
                            width: 40,
                            height: 40,
                            disabled: true,

                            handler: function () {
                                var view = Ext.ComponentQuery.query('usersview')[0];

                                if (view) {
                                    var grid = view.down('grid');
                                    view.loadUsersPage(grid.getStore().currentPage - 1);
                                }
                            }
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'usersPageInput',
                            value: 1,
                            minValue: 1,
                            clearable: false,
                            width: 50,
                            height: 40,
                            cls: 'cappuccino-page-input',
                            margin: '0 10',

                            listeners: {
                                action: function (field) {
                                    var view = Ext.ComponentQuery.query('usersview')[0];

                                    if (view) {
                                        view.loadUsersPage(field.getValue());
                                    }
                                }
                            }
                        },

                        // Total Pages
                        {
                            xtype: 'component',
                            itemId: 'usersTotalPages',
                            html: 'of 1',
                            cls: 'cappuccino-total-pages',
                            margin: '0 10'
                        },

                        // Next Arrow
                        {
                            xtype: 'button',
                            itemId: 'usersNextPage',
                            iconCls: 'x-fa fa-chevron-right',
                            ui: 'plain',
                            cls: 'cappuccino-page-arrow',
                            width: 40,
                            height: 40,

                            handler: function () {
                                var view = Ext.ComponentQuery.query('usersview')[0];

                                if (view) {
                                    var grid = view.down('grid');
                                    view.loadUsersPage(grid.getStore().currentPage + 1);
                                }
                            }
                        }
                    ]
                }

            ]
        }
    ],


loadUsersPage: function (page) {

    var grid = this.down('grid');

    if (!grid) {
        return;
    }

    var store = grid.getStore();

    page = parseInt(page, 10);

    var totalPages = store.totalPages || 0;

    // Validate page number
    if (
        isNaN(page) ||
        page < 1 ||
        page > totalPages ||
        totalPages === 0
    ) {
        var pageInput = this.down('#usersPageInput');

        if (pageInput) {
            pageInput.setValue(store.currentPage || 1);
        }

        return;
    }

    var searchField = this.down('#usersSearchField');

    var searchText = searchField
        ? (searchField.getValue() || '').trim()
        : '';

    store.load({
        params: {
            page: page,
            size: 12,
            search: searchText
        }
    });
},

updateUsersPagination: function (currentPage, totalPages) {

    var pageInput = this.down('#usersPageInput');
    var totalPagesText = this.down('#usersTotalPages');
    var prevButton = this.down('#usersPrevPage');
    var nextButton = this.down('#usersNextPage');

    totalPages = totalPages || 0;

    if (pageInput) {
        pageInput.setValue(currentPage || 1);
        pageInput.setMaxValue(Math.max(totalPages, 1));
    }

    if (totalPagesText) {
        totalPagesText.setHtml('of ' + totalPages);
    }

    if (prevButton) {
        prevButton.setDisabled(
            currentPage <= 1 || totalPages === 0
        );
    }

    if (nextButton) {
        nextButton.setDisabled(
            currentPage >= totalPages || totalPages === 0
        );
    }
}


});
