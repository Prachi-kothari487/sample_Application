Ext.define('MusicApp.view.LikedSongsView', {
    extend: 'Ext.Container',
    xtype: 'likedsongsview',

    cls: 'cappuccino-songs-view',
    layout: 'vbox',
    scrollable: true,

    items: [
        {
            xtype: 'component',
            cls: 'songs-page-heading',
            margin: '0 0 24 0',
            html: `
                <div class="songs-title">Liked Songs</div>
                <div class="songs-subtitle">
                    All the songs you have added to your favorites
                </div>
            `
        },
        {
            xtype: 'container',
            cls: 'songs-content-panel',
            width: '100%',
            padding: 20,

            items: [
                {
                    xtype: 'component',
                    html: '<div class="songs-title">Your Favorites</div>',
                    margin: '0 0 16 0'
                },
                {
                    xtype: 'grid',
                    itemId: 'likedSongsGrid',
                    cls: 'cappuccino-songs-grid',
                    width: '100%',
                    minHeight: 350,

                    store: {
                        fields: [
                            'id',
                            'title',
                            'artist',
                            'album',
                            'genre',
                            'year'
                        ],
                        data: []
                    },

                    columns: [
                        {
                            text: 'ID',
                            dataIndex: 'id',
                            width: 65
                        },
                        {
                            text: 'Title',
                            dataIndex: 'title',
                            flex: 2
                        },
                        {
                            text: 'Artist',
                            dataIndex: 'artist',
                            flex: 1
                        },
                        {
                            text: 'Album',
                            dataIndex: 'album',
                            flex: 1
                        },
                        {
                            text: 'Genre',
                            dataIndex: 'genre',
                            flex: 1
                        },
                        {
                            text: 'Year',
                            dataIndex: 'year',
                            width: 90
                        }
                    ]
                },
                {
                    xtype: 'component',
                    itemId: 'likedSongsMessage',
                    hidden: true,
                    margin: '16 0 0 0',
                    cls: 'songs-subtitle'
                }
            ]
        }
    ],

    loadLikedSongs: function () {

        var view = this;
        var grid = view.down('#likedSongsGrid');
        var message = view.down('#likedSongsMessage');

        fetch('/sample-application/api/songs/liked', {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(function (response) {

            if (!response.ok) {
                throw new Error('Unable to load your liked songs.');
            }

            return response.json();
        })
        .then(function (data) {

            console.log('Liked songs response:', data);

            // Support either a direct array or a wrapped response.
            var songs = Array.isArray(data)
                ? data
                : (data.songs || data.data || []);

            grid.getStore().setData(songs);

            if (songs.length === 0) {
                message.setHtml(
                    'You have not liked any songs yet. Visit Songs and tap the heart icon!'
                );
                message.show();
            } else {
                message.hide();
            }
        })
        .catch(function (error) {

            console.error('Liked songs loading error:', error);

            message.setHtml(
                'Unable to load liked songs. Please refresh the page.'
            );
            message.show();
        });
    },

    initialize: function () {
        this.callParent(arguments);
        this.loadLikedSongs();
    }
});