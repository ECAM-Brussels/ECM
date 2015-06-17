'use strict';

module.exports = {
	app: {
		title: 'ECM',
		description: 'Exam Copies Manager',
		keywords: 'Exam, copies, manager, ecam, alexis, paques, sébastien, combéfis'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'mean',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/ng-tags-input/ng-tags-input.bootstrap.css',
				'public/lib/ng-tags-input/ng-tags-input.css',
				'public/lib/nya-bootstrap-select/dist/css/nya-bs-select.min.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-animate/angular-animate.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-cookies/angular-cookies.min.js',
				'public/lib/angular-resource/angular-resource.min.js',
				'public/lib/angular-route/angular-route.min.js',
				'public/lib/angular-sanitize/angular-sanitize.min.js',
				'public/lib/angular-touch/angular-touch.min.js',
				'public/lib/angular-translate/angular-translate.min.js',
				'public/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/ng-file-upload/ng-file-upload-all.min.js',
				'public/lib/ng-tags-input/ng-tags-input.min.js',
				'public/lib/nya-bootstrap-select/dist/js/nya-bs-select.min.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
			],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
