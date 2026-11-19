
Ext.define('MusicApp.view.MyPlaylistsView', {
    extend: 'Ext.Container',
    xtype: 'myplaylistsview',

    cls: 'cappuccino-songs-view',
    layout: 'vbox',
    scrollable: true,

    items: [
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            width: '100%',
            margin: '0 0 24 0',

            items: [
                {
                    xtype: 'component',
                    cls: 'songs-page-heading',
                    flex: 1,

                    html: `
                        <div class="songs-title">
                            My Playlists
                        </div>
                        <div class="songs-subtitle">
                            Create and manage your personal music collections
                        </div>
                    `
                },
                {
                    xtype: 'button',
                    text: '+ Create Playlist',
                    cls: 'cappuccino-primary-button',
                    ui: 'plain',
                    width: 170,
                    height: 56,

                    handler: function (button) {
                        var view = button.up('myplaylistsview');
                        view.showCreatePlaylistDialog();
                    }
                }
            ]
        },

        {
            xtype: 'container',
            cls: 'songs-content-panel',
            width: '100%',
            padding: 20,

            items: [
                {
                    xtype: 'component',
                    html: '<div class="songs-title">Your Collections</div>',
                    margin: '0 0 16 0'
                },
                {
                    xtype: 'container',
                    itemId: 'playlistCardsContainer',
                    width: '100%',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'component',
                            itemId: 'playlistLoading',
                            html: 'Loading your playlists...',
                            cls: 'songs-subtitle'
                        }
                    ]
                }
            ]
        }
    ],

    showCreatePlaylistDialog: function () {

        var view = this;

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
                    label: 'Playlist Name',
                    placeholder: 'Enter playlist name',
                    required: true,
                    maxLength: 100
                },
                {
                    name: 'description',
                    label: 'Description',
                    placeholder: 'Enter playlist description',
                    maxLength: 255
                }
            ]
        });

        var dialog = Ext.create('Ext.Dialog', {
            title: 'Create Playlist',
            width: 480,
            maxHeight: '90%',
            scrollable: true,
            closable: true,
            modal: true,
            cls: 'cappuccino-form-dialog',

            items: [form],

            buttons: [
                {
                    text: 'Cancel',
                    ui: 'plain',
                    cls: 'cappuccino-dialog-cancel',

                    handler: function () {
                        dialog.destroy();
                    }
                },
                {
                    text: 'Create Playlist',
                    ui: 'plain',
                    cls: 'cappuccino-dialog-save',

                    handler: function () {

                        var values = form.getValues();

                        values.name = (values.name || '').trim();
                        values.description =
                            (values.description || '').trim();

                        if (!values.name) {
                            Ext.Msg.alert(
                                'Validation',
                                'Please enter a playlist name.'
                            );
                            return;
                        }

                        fetch('/sample-application/api/playlists', {
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
                                        'Could not create playlist. Please try again.'
                                    );
                                }

                                return response.text();
                            })
                            .then(function () {

                                dialog.destroy();

                                Ext.Msg.alert(
                                    'Success',
                                    'Playlist created successfully!',
                                    function () {
                                        view.loadPlaylists();
                                    }
                                );
                            })
                            .catch(function (error) {
                                Ext.Msg.alert('Error', error.message);
                            });
                    }
                }
            ]
        });

        dialog.show();
    },
    loadPlaylists: function () {

        var view = this;
        var container = view.down('#playlistCardsContainer');

        if (!container) {
            return;
        }

        container.removeAll();

        container.add({
            xtype: 'component',
            html: 'Loading your playlists...',
            cls: 'songs-subtitle'
        });

        fetch('/sample-application/api/playlists', {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(function (response) {

                if (!response.ok) {
                    throw new Error('Unable to load playlists.');
                }

                return response.json();
            })

            .then(function (playlists) {

                container.removeAll();

                if (!playlists || playlists.length === 0) {

                    container.add({
                        xtype: 'component',
                        html: `
                <div class="playlist-empty-state">
                    <div class="playlist-empty-icon">♫</div>
                    <div class="playlist-empty-title">
                        No Playlists Yet
                    </div>
                    <div class="playlist-empty-description">
                        Create your first playlist and start
                        organizing your favorite songs.
                    </div>
                </div>
            `
                    });

                    return;
                }

                // Fetch songs for every playlist
                var playlistRequests = playlists.map(function (playlist) {

                    return fetch(
                        '/sample-application/api/playlists/' +
                        playlist.id + '/songs',
                        {
                            method: 'GET',
                            credentials: 'same-origin'
                        }
                    )
                        .then(function (response) {

                            if (!response.ok) {
                                throw new Error(
                                    'Unable to load songs for playlist ' + playlist.name
                                );
                            }

                            return response.json();
                        })
                        .then(function (songs) {

                            return {
                                playlist: playlist,
                                songs: songs || []
                            };
                        })
                        .catch(function (error) {

                            console.error(
                                'Songs loading error for playlist:',
                                playlist.name,
                                error
                            );

                            return {
                                playlist: playlist,
                                songs: []
                            };
                        });
                });

                // Wait until all playlist song requests finish
                Promise.all(playlistRequests)
                    .then(function (playlistData) {

                        container.removeAll();

                        for (var i = 0; i < playlistData.length; i += 2) {

                            var firstData = playlistData[i];
                            var secondData = playlistData[i + 1];

                            var rowItems = [
                                view.createPlaylistCard(
                                    firstData.playlist,
                                    firstData.songs
                                )
                            ];

                            if (secondData) {

                                rowItems.push(
                                    view.createPlaylistCard(
                                        secondData.playlist,
                                        secondData.songs
                                    )
                                );

                            } else {

                                rowItems.push({
                                    xtype: 'component',
                                    flex: 1
                                });
                            }

                            container.add({
                                xtype: 'container',
                                width: '100%',

                                layout: {
                                    type: 'hbox',
                                    align: 'stretch'
                                },

                                margin: '0 0 16 0',
                                items: rowItems
                            });
                        }
                    });
            })

            .catch(function (error) {

                container.removeAll();

                container.add({
                    xtype: 'component',
                    html: 'Unable to load playlists. Please refresh the page.',
                    cls: 'songs-subtitle'
                });

                console.error('Playlist loading error:', error);
            });
    },

    createPlaylistCard: function (playlist, songs) {

        songs = songs || [];

        var safeName = Ext.String.htmlEncode(
            playlist.name || 'Untitled Playlist'
        );

        var safeDescription = Ext.String.htmlEncode(
            playlist.description || 'No description added'
        );

        var songCount = songs.length;

        var countText = songCount === 1
            ? '1 song'
            : songCount + ' songs';

        // Show maximum 3 song titles on the card
        var previewSongs = songs.slice(0, 3);

        var previewHtml = '';

        if (previewSongs.length === 0) {

            previewHtml = `
            <div class="playlist-card-song-preview">
                No songs added yet
            </div>
        `;

        } else {

            previewSongs.forEach(function (song) {

                var safeTitle = Ext.String.htmlEncode(
                    song.title || 'Untitled Song'
                );

                var safeArtist = Ext.String.htmlEncode(
                    song.artist || 'Unknown Artist'
                );

                previewHtml += `
                <div class="playlist-card-song-preview">
                    <span>♫ ${safeTitle}</span>
                    <span class="playlist-card-song-artist">
                        ${safeArtist}
                    </span>
                </div>
            `;
            });
        }

        var remainingSongs = songCount - previewSongs.length;

        if (remainingSongs > 0) {

            previewHtml += `
            <div class="playlist-card-more">
                + ${remainingSongs} more songs
            </div>
        `;
        }

        return Ext.create('Ext.Panel', {

            flex: 1,
            margin: '0 12 0 0',
            minHeight: 210,

            cls: 'cappuccino-playlist-card',

            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            bodyPadding: 18,

            items: [

                {
                    xtype: 'component',
                    html: `
                    <div class="playlist-card-icon">♫</div>
                `
                },

                {
                    xtype: 'component',
                    html: `
                    <div class="playlist-card-title">
                        ${safeName}
                    </div>

                    <div class="playlist-card-description">
                        ${safeDescription}
                    </div>
                `,
                    margin: '12 0'
                },

                {
                    xtype: 'component',
                    html: `
                    <div class="playlist-card-footer">
                        ${countText}
                    </div>
                `,
                    margin: '0 0 10 0'
                },

                {
                    xtype: 'component',
                    html: previewHtml
                }
            ],

            listeners: {
                element: 'element',

                click: function () {

                    var mainLayout =
                        Ext.ComponentQuery.query('mainlayout')[0];

                    if (mainLayout) {
                        mainLayout.showPage(
                            'playlistdetailsview',
                            playlist
                        );
                    }
                }
            }
        });
    },

    initialize: function () {
        this.callParent(arguments);
        this.loadPlaylists();
    }
});
