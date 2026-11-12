
Ext.define('MusicApp.view.SecurityQuestionSetupView', {
    extend: 'Ext.Container',
    xtype: 'securityquestionsetupview',

    cls: 'security-setup-screen',

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'start'
    },

    scrollable: true,

    items: [
        {
            xtype: 'container',
            width: '100%',
            maxWidth: 650,
            padding: 32,
            cls: 'security-setup-card',

            items: [
                {
                    xtype: 'component',
                    cls: 'security-setup-header',
                    html: `
                        <div class="security-setup-brand">
                            MUSICVAULT
                        </div>

                        <h2 class="security-setup-title">
                            Secure Your Account
                        </h2>

                        <p class="security-setup-description">
                            Select any 3 security questions and provide
                            answers to help recover your account if you
                            forget your password.
                        </p>

                        <div class="security-setup-divider"></div>
                    `
                },

                {
                    xtype: 'component',
                    itemId: 'loadingMessage',
                    cls: 'security-setup-loading',
                    html: 'Loading security questions...'
                },

                {
                    xtype: 'formpanel',
                    itemId: 'securityForm',
                    hidden: true,
                    width: '100%',
                    cls: 'security-setup-form',

                    items: [
                        {
                            xtype: 'component',
                            cls: 'security-setup-instruction',
                            html: 'Choose exactly 3 different questions.'
                        }
                    ]
                },

                {
                    xtype: 'button',
                    itemId: 'submitButton',
                    text: 'Save Security Questions',
                    hidden: true,
                    width: '100%',
                    height: 48,
                    margin: '22 0 0 0',
                    cls: 'security-setup-button',

                    handler: function (button) {
                        button.up('securityquestionsetupview')
                            .saveSecurityQuestions();
                    }
                }
            ]
        }
    ],

    initialize: function () {
        this.callParent(arguments);
        this.loadSecurityQuestions();
    },

    loadSecurityQuestions: function () {
        var me = this;

        fetch('/sample-application/api/auth/security-questions', {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Unable to load security questions.');
                }

                return response.json();
            })
            .then(function (questions) {

                if (!Array.isArray(questions) || questions.length < 3) {
                    throw new Error('Security questions are not available.');
                }

                me.questions = questions;

                me.down('#loadingMessage').hide();

                var form = me.down('#securityForm');

                var options = questions.map(function (question) {
                    return {
                        text: question.question,
                        value: question.id
                    };
                });

                for (var i = 1; i <= 3; i++) {

                    form.add({
                        xtype: 'component',
                        cls: 'security-question-heading',
                        html: 'Security Question ' + i
                    });

                    form.add({
                        xtype: 'selectfield',
                        name: 'question' + i,
                        label: 'Select Question',
                        labelAlign: 'top',
                        placeholder: 'Choose a security question',
                        required: true,
                        options: options,
                        width: '100%',
                        margin: '0 0 15px',
                        cls: 'security-setup-field'
                    });

                    form.add({
                        xtype: 'textfield',
                        name: 'answer' + i,
                        label: 'Your Answer',
                        labelAlign: 'top',
                        placeholder: 'Enter your answer',
                        required: true,
                        clearable: true,
                        width: '100%',
                        margin: '0 0 15px',
                        cls: 'security-setup-field'
                    });
                }

                form.show();
                me.down('#submitButton').show();

            })
            .catch(function (error) {
                me.down('#loadingMessage').setHtml(
                    '<div class="security-setup-error">' +
                    error.message +
                    '</div>'
                );
            });
    },

    saveSecurityQuestions: function () {
        var me = this;
        var form = me.down('#securityForm');
        var values = form.getValues();

        var answers = [];
        var selectedIds = [];

        for (var i = 1; i <= 3; i++) {

            var questionId = values['question' + i];
            var answer = values['answer' + i];

            if (!questionId || !answer || !answer.trim()) {
                showCappuccinoAlert(
                    'Validation',
                    'Please select all 3 questions and enter their answers.'
                );
                return;
            }

            if (selectedIds.indexOf(String(questionId)) !== -1) {
                showCappuccinoAlert(
                    'Duplicate Question',
                    'Please select 3 different security questions.'
                );
                return;
            }

            selectedIds.push(String(questionId));

            answers.push({
                questionId: parseInt(questionId, 10),
                answer: answer.trim()
            });
        }

        var button = me.down('#submitButton');

        button.setDisabled(true);
        button.setText('Saving...');

        fetch('/sample-application/api/auth/security-questions', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                answers: answers
            })
        })
            .then(function (response) {
                return response.text().then(function (message) {

                    if (!response.ok) {
                        throw new Error(
                            message || 'Unable to save security questions.'
                        );
                    }

                    return message;
                });
            })
            .then(function () {

                showCappuccinoAlert(
                    'Setup Completed',
                    'Your security questions have been saved successfully.'
                );

                Ext.Viewport.removeAll(true);

                Ext.Viewport.add({
                    xtype: 'mainlayout'
                });

            })
            .catch(function (error) {

                showCappuccinoAlert(
                    'Setup Failed',
                    error.message
                );

                button.setDisabled(false);
                button.setText('Save Security Questions');
            });
    }
});
