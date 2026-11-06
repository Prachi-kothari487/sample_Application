// Ext.define('MusicApp.view.ProfileView',{
//     extend:'Ext.Container',
//     xtype:'profileview',
//     cls:'profile-view',
//     padding:25,
//     layout:{
//         type:'vbox',
//         align:'stretch'
//     },
//     items:[
//         {
//             xtype:'container',
//             html:`
//             <h2>My Profile</h2>
//             <p>Account Information</p>
// `
//         },
//         {
//             xtype: 'container',
//             itemId:'profileDetails',
//             cls:'profile-details-card',
//             padding:25,
//             html:'<p>Loading profile....</p>'
//         }
//     ],
//     initialize:function (){
//         this.callParent(arguments);
//         this.loadProfile();
//     },
//     loadProfile:function(){
//         const profileDetails=this.down('#profileDetails');
//
//         fetch('/sample-application/api/auth/profile',{
//             method:'GET',
//             credentials:'same-origin'
//         })
//             .then(response=>{
//                 if(!response.ok){
//                     throw new Error('unable to load profile');
//                 }
//                 return response.json();
//             })
//             .then(data=>{
//                 const encode=value=>Ext.String.htmlEncode(String(value ?? '-'));
//
//                 profileDetails.setHtml(`
//                 <div class="profile-info">
//                 <h3>${encode(data.name)}</h3>
//                 <p><strong>First Name :</strong>${encode(data.firstname)}</p>
//                  <p><strong>Last Name :</strong>${encode(data.lastname)}</p>
//                   <p><strong>Email :</strong>${encode(data.email)}</p>
//                    <p><strong>Role :</strong>${encode(data.role)}</p>
//                     <p><strong>Status :</strong>${encode(data.status)}</p>
//
// </div>
//                 `)
//             })
//             .catch(error=>{
//                 console.error('profile api errors:',error);
//
//                 profileDetails.setHtml('<p>Unable to load profile please load again!</p>');
//             });
//     }
// });



Ext.define('MusicApp.view.ProfileView', {
    extend: 'Ext.Container',
    xtype: 'profileview',

    cls: 'profile-view',
    padding: 25,
    scrollable: true,

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'container',
            html: `
                <div class="profile-page-heading">
                    <h2>My Profile</h2>
                    <p>Manage your personal information and account details</p>
                </div>
            `
        },
        {
            xtype: 'container',
            itemId: 'profileDetails',
            html: `
                <div class="profile-loading">
                    Loading your profile...
                </div>
            `
        }
    ],

    initialize: function () {
        this.callParent(arguments);
        this.loadProfile();
    },

    loadProfile: function () {
        const profileDetails = this.down('#profileDetails');

        fetch('/sample-application/api/auth/profile', {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Unable to load profile');
                }

                return response.json();
            })
            .then(data => {
                const encode = value =>
                    Ext.String.htmlEncode(String(value ?? '-'));

                const firstName = data.firstName || '';
                const lastName = data.lastName || '';
                const fullName = `${firstName} ${lastName}`.trim()
                    || data.name || 'User';

                const initials = fullName
                    .split(/\s+/)
                    .map(part => part.charAt(0))
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();

                const status = String(data.status || 'Unknown');
                const statusClass = status.toLowerCase() === 'active'
                    ? 'profile-status-active'
                    : 'profile-status-inactive';

                profileDetails.setHtml(`
                <div class="profile-content">

                    <div class="profile-hero">
                        <div class="profile-avatar">
                            ${encode(initials)}
                        </div>

                        <div class="profile-hero-info">
                            <h2>${encode(fullName)}</h2>
                            <p>@${encode(data.name)}</p>
                            <span class="profile-role">
                                ${encode(data.role)}
                            </span>
                        </div>

                        <div class="profile-status ${statusClass}">
                            ${encode(status)}
                        </div>
                    </div>

                    <div class="profile-section">
                        <h3>Personal Information</h3>
                        <p class="profile-section-subtitle">
                            Your personal account information
                        </p>

                        <div class="profile-info-grid">

                            <div class="profile-info-item">
                                <span>First Name</span>
                                <strong>${encode(data.firstname)}</strong>
                            </div>

                            <div class="profile-info-item">
                                <span>Last Name</span>
                                <strong>${encode(data.lastname)}</strong>
                            </div>

                            <div class="profile-info-item">
                                <span>Username</span>
                                <strong>${encode(data.name)}</strong>
                            </div>

                            <div class="profile-info-item">
                                <span>Email Address</span>
                                <strong>${encode(data.email)}</strong>
                            </div>

                        </div>
                    </div>

                    <div class="profile-section">
                        <h3>Account Information</h3>
                        <p class="profile-section-subtitle">
                            Your account role and current status
                        </p>

                        <div class="profile-info-grid">

                            <div class="profile-info-item">
                                <span>Account Role</span>
                                <strong>${encode(data.role)}</strong>
                            </div>

                            <div class="profile-info-item">
                                <span>Account Status</span>
                                <strong>${encode(status)}</strong>
                            </div>

                        </div>
                    </div>

                </div>
            `);
            })
            .catch(error => {
                console.error('Profile API error:', error);

                profileDetails.setHtml(`
                <div class="profile-error">
                    Unable to load your profile. Please try again.
                </div>
            `);
            });
    }
});
