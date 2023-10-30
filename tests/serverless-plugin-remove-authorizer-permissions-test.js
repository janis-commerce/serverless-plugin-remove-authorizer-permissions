'use strict';

const assert = require('assert');

const cloneDeep = require('lodash.clonedeep');

const ServerlessPluginRemoveAuthorizerPermissions = require('../');

describe('ServerlessPluginRemoveAuthorizerPermissions', () => {

	const serverless = {
		cli: {
			log: () => {}
		},
		service: {
			provider: {
				compiledCloudFormationTemplate: {
					Resources: {
						SomeResource: {},
						SomeOtherResource: {},
						RandomLambdaPermissionApiGateway: {}
					}
				}
			}
		}
	};

	it('Should set the proper hooks', () => {

		const serverlessPluginRemoveAuthorizerPermissions = new ServerlessPluginRemoveAuthorizerPermissions(serverless);
		const hooks = Object.keys(serverlessPluginRemoveAuthorizerPermissions.hooks);

		assert.deepStrictEqual(hooks, ['after:aws:package:finalize:mergeCustomProviderResources']);
	});

	it('Should not remove anything if no permissions are matched', () => {

		const testConfig = cloneDeep(serverless);

		const serverlessPluginRemoveAuthorizerPermissions = new ServerlessPluginRemoveAuthorizerPermissions(testConfig);
		serverlessPluginRemoveAuthorizerPermissions.removePermissions();

		assert.deepStrictEqual(testConfig, serverless);
	});

	it('Should remove any resource that matches the authorizers permissions', () => {

		const testConfig = cloneDeep(serverless);
		testConfig.service.provider.compiledCloudFormationTemplate.Resources.MyAuthorizerLambdaPermissionApiGateway = {};
		testConfig.service.provider.compiledCloudFormationTemplate.Resources.SomeOtherAuthorizerLambdaPermissionApiGateway = {};
		testConfig.service.provider.compiledCloudFormationTemplate.Resources.SomeOtherAuthorizerLambdaPermissionWebsockets = {};

		const serverlessPluginRemoveAuthorizerPermissions = new ServerlessPluginRemoveAuthorizerPermissions(testConfig);
		serverlessPluginRemoveAuthorizerPermissions.removePermissions();

		assert.deepStrictEqual(testConfig, serverless);
	});

});
