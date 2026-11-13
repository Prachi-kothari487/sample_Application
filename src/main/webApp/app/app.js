
Ext.application({
    name: 'MusicApp',

    launch: function () {

        var params = new URLSearchParams(window.location.search);
        var resetToken = params.get('resetToken');

        if (resetToken) {
            Ext.Viewport.add({
                xtype: 'resetpasswordview',
                token: resetToken
            });
            return;
        }
        fetch('/sample-application/api/auth/session', {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(function (response) {

                if (response.status === 401) {
                    return false;
                }

                if (!response.ok) {
                    throw new Error('Unable to check login session.');
                }

                return true;
            })
            .then(function (isLoggedIn) {

                if (!isLoggedIn) {
                    Ext.Viewport.add({
                        xtype: 'loginview'
                    });
                    return;
                }

                return fetch(
                    '/sample-application/api/auth/security-questions/status',
                    {
                        method: 'GET',
                        credentials: 'same-origin'
                    }
                )
                    .then(function (response) {

                        if (!response.ok) {
                            throw new Error('Unable to check security question setup.');
                        }

                        return response.json();
                    })
                    .then(function (isSetupCompleted) {

                        if (isSetupCompleted === false) {
                            Ext.Viewport.add({
                                xtype: 'securityquestionsetupview'
                            });
                        } else {
                            Ext.Viewport.add({
                                xtype: 'mainlayout'
                            });
                        }
                    });
            })
            .catch(function (error) {
                console.error('Application startup error:', error);

                Ext.Msg.alert(
                    'Application Error',
                    'Unable to restore your session. Please refresh the page.'
                );
            });
    }
});
