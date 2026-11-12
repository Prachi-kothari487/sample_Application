
Ext.define('MusicApp.view.ResetPasswordView', {
    extend: 'Ext.Container',
    xtype: 'resetpasswordview',

    config: {
        token: null
    },

    cls: 'reset-password-screen',

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },

    scrollable: true,

    style: {
        background: 'linear-gradient(135deg, #F5EBDD, #EAD8C5, #D8BBA3)',
        padding: '25px'
    },

    items: [
        {
            xtype: 'container',
            width: '100%',
            maxWidth: 440,
            cls: 'reset-password-card',

            items: [
                {
                    xtype: 'component',
                    html: `
                        <div class="reset-password-brand">
                            MUSICVAULT
                        </div>

                        <div style="text-align:center; margin-bottom:25px;">
                            <div style="
                                width:65px;
                                height:65px;
                                margin:0 auto 18px;
                                border-radius:50%;
                                background:#F0DFCC;
                                display:flex;
                                align-items:center;
                                justify-content:center;
                                color:#9A6748;
                                font-size:27px;
                                font-weight:bold;">
                                MV
                            </div>

                            <h2 class="reset-password-heading">
                                Reset Password
                            </h2>

                            <p class="reset-password-subtitle">
                                Create a new password and get back to
                                enjoying your favourite music.
                            </p>
                        </div>
                    `
                },

                {
                    xtype: 'component',
                    itemId: 'validationMessage',
                    html: `
                        <div style="
                            text-align:center;
                            color:#8B6B5B;
                            background:#F5EBDD;
                            border-radius:10px;
                            padding:12px;
                            font-size:13px;">
                            Validating your reset link...
                        </div>
                    `,
                    margin: '0 0 20 0'
                },

                {
                    xtype: 'formpanel',
                    itemId: 'resetForm',
                    hidden: true,

                    items: [
                        {
                            xtype: 'passwordfield',
                            name: 'newPassword',
                            label: 'New Password',
                            required: true,
                            placeHolder: 'Enter your new password',
                            margin: '0 0 18 0',
                            labelAlign:'top'
                        },
                        {
                            xtype: 'passwordfield',
                            name: 'confirmPassword',
                            label: 'Confirm Password',
                            required: true,
                            placeHolder: 'Re-enter your new password',
                            margin: '0 0 24 0',
                            labelAlign:'top'
                        },
                        {
                            xtype: 'button',
                            text: 'Reset Password',
                            itemId: 'resetButton',
                            cls: 'reset-primary-button',
                            height: 48,
                            margin: '5 0 0 0',

                            handler: function (button) {
                                var view = button.up('resetpasswordview');
                                view.submitNewPassword();
                            }
                        }
                    ]
                },

                {
                    xtype: 'container',
                    itemId: 'successContainer',
                    hidden: true,

                    items: [
                        {
                            xtype: 'component',
                            html: `
                                <div style="
                                    text-align:center;
                                    padding:15px 5px;">

                                    <div style="
                                        width:65px;
                                        height:65px;
                                        margin:0 auto 18px;
                                        border-radius:50%;
                                        background:#E4EBD9;
                                        color:#557A45;
                                        display:flex;
                                        align-items:center;
                                        justify-content:center;
                                        font-size:30px;
                                        font-weight:bold;">
                                        ✓
                                    </div>

                                    <h2 style="
                                        color:#4B3028;
                                        font-size:22px;
                                        margin-bottom:12px;">
                                        Password Updated!
                                    </h2>

                                    <p style="
                                        color:#8B6B5B;
                                        font-size:14px;
                                        line-height:1.7;">
                                        Your password has been reset
                                        successfully. You can now log in
                                        using your new password.
                                    </p>
                                </div>
                            `
                        },
                        {
                            xtype: 'button',
                            text: 'Back to Login',
                            cls: 'reset-primary-button',
                            height: 48,
                            margin: '10 0 0 0',

                            handler: function () {
                                window.history.replaceState(
                                    {},
                                    document.title,
                                    window.location.pathname
                                );

                                Ext.Viewport.removeAll(true);
                                Ext.Viewport.add({
                                    xtype: 'loginview'
                                });
                            }
                        }
                    ]
                },

                {
                    xtype: 'component',
                    html: `
                        <div class="reset-password-footer">
                            Secure password recovery · MusicVault
                        </div>
                    `
                }
            ]
        }
    ],

    initialize: function () {
        this.callParent(arguments);
        this.validateResetToken();
    },

    validateResetToken: function () {
        var me = this;
        var token = me.getToken();

        if (!token) {
            me.showValidationError('Reset token is missing.');
            return;
        }

        fetch(
            '/sample-application/api/auth/reset-password/validate?token=' +
            encodeURIComponent(token),
            {
                method: 'GET',
                credentials: 'same-origin'
            }
        )
            .then(function (response) {
                return response.text().then(function (message) {
                    if (!response.ok) {
                        throw new Error(
                            message || 'Invalid or expired reset link.'
                        );
                    }
                    return message;
                });
            })
            .then(function (message) {
                me.down('#validationMessage').setHtml(
                    '<div style="' +
                    'text-align:center;' +
                    'color:#557A45;' +
                    'background:#EAF0E2;' +
                    'padding:12px;' +
                    'border-radius:10px;' +
                    'font-size:13px;">' +
                    message +
                    '</div>'
                );

                me.down('#resetForm').show();
            })
            .catch(function (error) {
                me.showValidationError(error.message);
            });
    },

    showValidationError: function (message) {
        me = this;

        me.down('#validationMessage').setHtml(
            '<div style="' +
            'text-align:center;' +
            'color:#B34436;' +
            'background:#F8E5DF;' +
            'padding:12px;' +
            'border-radius:10px;' +
            'font-size:13px;">' +
            message +
            '</div>'
        );
    },

    submitNewPassword: function () {
        var me = this;
        var form = me.down('#resetForm');
        var values = form.getValues();

        if (!values.newPassword || !values.confirmPassword) {
            showCappuccinoAlert(
                'Validation',
                'Please enter and confirm your new password.'
            );
            return;
        }

        if (values.newPassword !== values.confirmPassword) {
            showCappuccinoAlert(
                'Password Mismatch',
                'New password and confirm password do not match.'
            );
            return;
        }

        var button = me.down('#resetButton');

        button.setDisabled(true);
        button.setText('Resetting...');

        fetch('/sample-application/api/auth/reset-password', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: me.getToken(),
                newPassword: values.newPassword
            })
        })
            .then(function (response) {
                return response.text().then(function (message) {
                    if (!response.ok) {
                        throw new Error(
                            message || 'Unable to reset password.'
                        );
                    }
                    return message;
                });
            })
            .then(function () {
                form.hide();
                me.down('#validationMessage').hide();
                me.down('#successContainer').show();
            })
            .catch(function (error) {
                showCappuccinoAlert(
                    'Reset Password Failed',
                    error.message
                );

                button.setDisabled(false);
                button.setText('Reset Password');
            });
    }
});
