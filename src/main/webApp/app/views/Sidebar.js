Ext.define('MusicApp.view.Sidebar', {
    extend: 'Ext.Container',
    xtype: 'appsidebar',

    width: 250,
    cls: 'dashboard-sidebar',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'button',
            text: '⌂   Dashboard',
            cls: 'dashboard-nav-button active',
            margin: '8 0',
            handler: function (button) {
                button.up('mainlayout').showPage('dashboardview');
            }
        },
        {
            xtype: 'button',
            text: '♟   Users',
            cls: 'dashboard-nav-button',
            margin: '8 0',
            handler: function (button) {
                button.up('mainlayout').showPage('usersview');
            }
        },
        {
            xtype: 'button',
            text: '♫   Songs',
            cls: 'dashboard-nav-button',
            margin: '8 0',
            handler: function (button) {
                button.up('mainlayout').showPage('songsview');
            }
        },
        {
            xtype: 'button',
            text: '♙   Profile',
            cls: 'dashboard-nav-button',
            margin: '8 0',
            handler: function(button){
                button.up('mainlayout').showPage('profileview');
            }
        },
        {
            xtype: 'button',
            text: '⇥   Logout',
            cls: 'dashboard-nav-button',
            margin: '8 0',

            handler: function (button) {

                Ext.Msg.confirm(
                    'Logout',
                    'Are you sure you want to logout?',
                    function (choice) {

                        console.log('Confirmation:', choice);

                        if (choice !== 'yes') {
                            return;
                        }

                        fetch('/sample-application/api/auth/logout', {
                            method: 'POST',
                            credentials: 'same-origin'
                        })
                            .then(response => {
                                console.log('Logout API status:', response.status);

                                if (!response.ok) {
                                    throw new Error('Logout API failed');
                                }

                                return response.text();
                            })
                            .then(message => {

                                console.log('Logout response:', message);

                                // Destroy current application screen
                                Ext.Viewport.removeAll(true);

                                // Create Login View
                                const loginView = Ext.create('MusicApp.view.LoginView');

                                Ext.Viewport.add(loginView);

                                console.log('Login page displayed');
                            })
                            .catch(error => {
                                console.error('Logout error:', error);
                                Ext.Msg.alert('Error', 'Logout failed. Please try again.');
                            });
                    }
                );
            }

        }
    ]


});