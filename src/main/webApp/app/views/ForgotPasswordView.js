
Ext.define('MusicApp.view.ForgotPasswordView', {
    extend: 'Ext.Container',
    xtype: 'forgotpasswordview',

    layout: {
        type: 'vbox',
        pack: 'center',
        align: 'center'
    },

    padding: 24,

    style: {
        backgroundColor: '#F5EBDD',
        backgroundImage: "url('/sample-application/resources/images/music-doodle.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    },

    items: [
        {
            xtype: 'formpanel',
            width: '100%',
            maxWidth: 440,
            padding: 28,

            style: {
                backgroundColor: 'rgba(255, 249, 239, 0.94)',
                borderRadius: '20px',
                border: '1px solid #D8B99A',
                boxShadow: '0 8px 30px rgba(75, 48, 40, 0.12)'
            },

            items: [
                {
                    xtype: 'component',
                    html: `
                        <div style="text-align:center; color:#4B3028;">
                            <div style="font-size:32px; margin-bottom:12px;">♫</div>
                            <h2 style="margin:0 0 10px; font-size:27px;">
                                Forgot Password?
                            </h2>
                            <p style="margin:0 0 24px; font-size:14px; color:#80634F;">
                                Enter your registered email to recover your account.
                            </p>
                        </div>
                    `
                },
                {
                    xtype: 'textfield',
                    name: 'email',
                    label: 'Email Address',
                    placeholder: 'Enter your registered email',
                    required: true,
                    clearable: true,
                    labelAlign: 'top'
                },
                {
                    xtype: 'button',
                    text: 'Continue',
                    ui: 'plain',
                    height: 52,
                    width: '100%',
                    margin: '20 0 0 0',

                    style: {
                        background: '#4B3028',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontSize: '16px',
                        fontWeight: '600'
                    },

                    handler: function (button) {
                        var form = button.up('formpanel');
                        var values = form.getValues();

                        if (!form.validate()) {
                            showCappuccinoAlert(
                                'Validation',
                                'Please enter your registered email.'
                            );
                            return;
                        }

                        button.setDisabled(true);

                        fetch('/sample-application/api/auth/forgot-password/questions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            credentials: 'same-origin',
                            body: JSON.stringify({
                                email: values.email
                            })
                        })
                            .then(function (response) {
                                return response.json().then(function (data) {
                                    if (!response.ok) {
                                        throw new Error(
                                            data.message || 'Unable to process request.'
                                        );
                                    }
                                    return data;
                                });
                            })
                            .then(function (questions) {
                                Ext.Viewport.removeAll(true);

                                Ext.Viewport.add({
                                    xtype: 'securityquestionsview',
                                    email: values.email,
                                    questions: questions
                                });
                            })
                            .catch(function (error) {
                                showCappuccinoAlert(
                                    'Forgot Password',
                                    error.message
                                );
                            })
                            .finally(function () {
                                button.setDisabled(false);
                            });
                    }
                },
                {
                    xtype: 'button',
                    text: 'Back to Login',
                    ui: 'plain',
                    margin: '12 0 0 0',
                    style: {
                        background: 'transparent',
                        color: '#9A6748',
                        fontSize: '13px',
                        fontWeight: '600'
                    },
                    handler: function () {
                        Ext.Viewport.removeAll(true);
                        Ext.Viewport.add({
                            xtype: 'loginview'
                        });
                    }
                }
            ]
        }
    ]
});
