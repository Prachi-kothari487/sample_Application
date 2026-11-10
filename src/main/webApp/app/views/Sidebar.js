
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
            itemId: 'usersNavButton',
            text: '♟   Users',
            cls: 'dashboard-nav-button',
            margin: '8 0',
            hidden: true,
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
            handler: function (button) {
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

                        if (choice !== 'yes') {
                            return;
                        }

                        fetch('/sample-application/api/auth/logout', {
                            method: 'POST',
                            credentials: 'same-origin'
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Logout API failed');
                                }
                                return response.text();
                            })
                            .then(message => {
                                console.log('Logout response:', message);

                                Ext.Viewport.removeAll(true);

                                const loginView =
                                    Ext.create('MusicApp.view.LoginView');

                                Ext.Viewport.add(loginView);
                            })
                            .catch(error => {
                                console.error('Logout error:', error);
                                Ext.Msg.alert(
                                    'Error',
                                    'Logout failed. Please try again.'
                                );
                            });
                    }
                );
            }
        }
    ],

    initialize: function () {
        this.callParent(arguments);

        const usersButton = this.down('#usersNavButton');

        fetch('/sample-application/api/auth/role', {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Unable to fetch user role');
                }
                return response.json();
            })
            .then(data => {
                const role = (data.role || '').trim().toUpperCase();

                usersButton.setHidden(role !== 'ADMIN');

                console.log('Logged-in role:', role);
            })
            .catch(error => {
                usersButton.setHidden(true);
                console.error('Role fetch error:', error);
            });
    }
});
