
Ext.define('MusicApp.view.PlaylistDetailsView', {
    extend: 'Ext.Container',
    xtype: 'playlistdetailsview',

    cls: 'cappuccino-songs-view',
    layout: 'vbox',
    scrollable: true,

    config: {
        playlist: null
    },

    items: [
        {
            xtype: 'container',
            padding: 25,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'component',
                    html: '<div class="songs-heading"><h1>Playlist Details</h1></div>' +
                        '<div class="songs-subheading">Your personal music collection</div>'
                },
                {
                    xtype: 'container',
                    itemId: 'playlistInfo',
                    margin: '20 0',
                    padding: 20,
                    cls: 'cappuccino-playlist-card',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'component',
                            itemId: 'playlistName',
                            html: ''
                        },
                        {
                            xtype: 'component',
                            itemId: 'playlistDescription',
                            html: ''
                        }
                    ]
                },
                {
                    xtype: 'component',
                    html: '<div class="songs-heading">Songs in this Playlist</div>',
                    margin: '10 0'
                },
                {
                    xtype: 'container',
                    itemId: 'playlistSongsContainer',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    }
                }
            ]
        }
    ],

    loadPlaylistSongs: function () {

        var view = this;
        var playlist = this.getPlaylist();
        var container = this.down('#playlistSongsContainer');

        if (!playlist || !container) {
            return;
        }

        container.removeAll();

        fetch('/sample-application/api/playlists/' + playlist.id + '/songs', {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(function (response) {

                if (!response.ok) {
                    throw new Error('Unable to load playlist songs.');
                }

                return response.json();
            })
            .then(function (songs) {

                container.removeAll();

                console.log('Playlist songs:', songs);

                if (!songs || songs.length === 0) {
                    container.add({
                        xtype: 'component',
                        html: '<div class="playlist-empty-description">' +
                            'No songs added to this playlist yet.' +
                            '</div>'
                    });
                    return;
                }

                // We'll add song cards here in the next step.
                // Display all songs in the playlist
                songs.forEach(function (song) {

                    var safeTitle = Ext.String.htmlEncode(
                        song.title || 'Untitled Song'
                    );

                    var safeArtist = Ext.String.htmlEncode(
                        song.artist || 'Unknown Artist'
                    );

                    var safeAlbum = Ext.String.htmlEncode(
                        song.album || 'Unknown Album'
                    );

                    var safeGenre = Ext.String.htmlEncode(
                        song.genre || 'Not specified'
                    );

                    var safeYear = Ext.String.htmlEncode(
                        String(song.year || 'N/A')
                    );

                    container.add({
                        xtype: 'panel',
                        cls: 'playlist-detail-song-card',
                        width: '100%',
                        margin: '0 0 12 0',
                        bodyPadding: 16,

                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },

                        items: [
                            {
                                xtype: 'component',
                                html: `
                    <div class="playlist-detail-song-title">
                        ♫ ${safeTitle}
                    </div>
                `
                            },
                            {
                                xtype: 'component',
                                html: `
                    <div class="playlist-detail-song-info">
                        <span>Artist: ${safeArtist}</span>
                        <span>Album: ${safeAlbum}</span>
                        <span>Genre: ${safeGenre}</span>
                        <span>Year: ${safeYear}</span>
                    </div>
                `,
                                margin: '8 0 0 0'
                            },
                            {
                                xtype: 'button',
                                text: 'Remove Song',
                                ui: 'plain',
                                cls: 'cappuccino-remove-song-button',
                                width: 130,
                                margin: '12 0 0 0',

                                handler: function () {

                                    Ext.Msg.confirm(
                                        'Remove Song',
                                        'Are you sure you want to remove this song from the playlist?',

                                        function (choice) {

                                            if (choice !== 'yes') {
                                                return;
                                            }

                                            fetch(
                                                '/sample-application/api/playlists/' +
                                                playlist.id + '/songs/' + song.id,
                                                {
                                                    method: 'DELETE',
                                                    credentials: 'same-origin'
                                                }
                                            )
                                                .then(function (response) {

                                                    if (!response.ok) {
                                                        throw new Error('Unable to remove song.');
                                                    }

                                                    view.loadPlaylistSongs();

                                                    Ext.Msg.alert(
                                                        'Success',
                                                        'Song removed from playlist successfully!'
                                                    );
                                                })
                                                .catch(function (error) {

                                                    console.error('Remove song error:', error);

                                                    Ext.Msg.alert('Error', error.message);
                                                });
                                        }
                                    );
                                }
                            }
                        ]
                    });
                });
            })
            .catch(function (error) {
                console.error('Playlist songs loading error:', error);
            });
    },

    initialize: function () {
        this.callParent(arguments);

        var playlist = this.getPlaylist();

        console.log('Selected playlist:', playlist);

        if (playlist) {
            this.down('#playlistName').setHtml(
                '<div class="playlist-card-title">' +
                Ext.String.htmlEncode(playlist.name || 'Untitled Playlist') +
                '</div>'
            );

            this.down('#playlistDescription').setHtml(
                '<div class="playlist-card-description">' +
                Ext.String.htmlEncode(playlist.description || 'No description added') +
                '</div>'
            );
        }
        this.loadPlaylistSongs();
    }

});
