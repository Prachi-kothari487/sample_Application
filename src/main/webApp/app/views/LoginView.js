function showCappuccinoAlert(title, message) {
    Ext.Msg.alert(title, message);
}

Ext.define('MusicApp.view.LoginView', {
    extend: 'Ext.Container',
    xtype: 'loginview',
    cls:'loginview',

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    style: {
        backgroundColor: '#F5EBDD',
        backgroundImage: "url('/sample-application/resources/images/music-doodle.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    },

    items: [
        {

            flex: 1
        },
        {

            flex: 1,
            layout: {
                type: 'vbox',
                pack: 'center',
                align: 'center'
            },
            padding: 24,

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
                                    <div style="
                                        font-size:36px;
                                        margin-bottom:12px;
                                    ">♫</div>

                                    <h2 style="
                                        margin:0 0 10px;
                                        font-size:30px;
                                        font-weight:700;
                                    ">Welcome Back</h2>

                                    <p style="
                                        margin:0 0 24px;
                                        font-size:15px;
                                        color:#80634F;
                                    ">
                                        Sign in to continue your musical journey
                                    </p>
                                </div>
                            `
                        },
                        {
                            xtype: 'textfield',
                            name: 'name',
                            label: 'Username',
                            placeholder: 'Enter your username',
                            required: true,
                            clearable: true,
                            labelAlign: 'top'
                        },

                        {
                            xtype: 'passwordfield',
                            name: 'password',
                            label: 'Password',
                            placeholder: 'Enter your password',
                            required: true,
                            revealable: true,
                            labelAlign: 'top',

                            listeners: {
                                action: function (field) {

                                    var form = field.up('formpanel');
                                    var signInButton = form.down('#signInButton');

                                    if (signInButton && !signInButton.getDisabled()) {
                                        var handler = signInButton.getHandler();

                                        if (handler) {
                                            handler.call(signInButton, signInButton);
                                        }
                                    }
                                }
                            }
                        },




                        {
                            xtype: 'button',
                            text: 'Sign In',
                            ui: 'plain',
                            itemId: 'signInButton',
                            cls: 'music-signin-button',
                            height: 56,
                            width: '100%',
                            margin: '16 0 0 0',

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
                                        'Please enter username and password.'
                                    );
                                    return;
                                }

                                button.setDisabled(true);

                                fetch('/sample-application/api/auth/login', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    credentials: 'same-origin',
                                    body: JSON.stringify({
                                        name: values.name,
                                        password: values.password
                                    })
                                })
                                    .then(function (response) {
                                        if (response.ok) {
                                            return response.text();
                                        }

                                        return response.text().then(function (message) {
                                            throw new Error(
                                                message || 'Invalid username or password'
                                            );
                                        });
                                    })

                                    .then(function () {

                                        return fetch(
                                            '/sample-application/api/auth/security-questions/status',
                                            {
                                                method: 'GET',
                                                credentials: 'same-origin'
                                            }
                                        );
                                    })
                                    .then(function (response) {

                                        if (!response.ok) {
                                            throw new Error('Unable to check security question setup.');
                                        }

                                        return response.json();
                                    })
                                    .then(function (isSetupCompleted) {

                                        Ext.Viewport.removeAll(true);

                                        if (isSetupCompleted === false) {

                                            Ext.Viewport.add({
                                                xtype: 'securityquestionsetupview'
                                            });

                                        } else {

                                            Ext.Viewport.add({
                                                xtype: 'mainlayout'
                                            });
                                        }
                                    })

                                    .catch(function (error) {
                                        showCappuccinoAlert(
                                            'Login Failed',
                                            error.message || 'Invalid username or password.'
                                        );
                                    })
                                    .finally(function () {
                                        button.setDisabled(false);
                                    });
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Forgot Password?',
                            ui: 'plain',
                            width: '100%',
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
                                    xtype: 'forgotpasswordview'
                                });
                            }
                        },
                        {
                            xtype: 'component',
                            html: `
                                <div style="
                                    text-align:center;
                                    margin-top:22px;
                                    color:#80634F;
                                    font-size:13px;
                                ">
                                    Play &bull; Learn &bull; Enjoy
                                </div>
                            `
                        }
                    ]
                }
            ]
        }
    ]
})

