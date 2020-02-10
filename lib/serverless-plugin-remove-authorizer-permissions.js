'use strict';

class ServerlessPluginRemoveAuthorizerPermissions {

	constructor(serverless) {

		this.serverless = serverless;

		this.hooks = {
			'after:aws:package:finalize:mergeCustomProviderResources': this.removePermissions.bind(this)
		};
	}

	removePermissions() {

		this.serverless.cli.log('Removing cross-account apigateway lambda permissions...');

		const template = this.serverless.service.provider.compiledCloudFormationTemplate;

		const removedResources = [];

		Object.keys(template.Resources).forEach(resourceName => {

			if(resourceName.match(/AuthorizerLambdaPermissionApiGateway$/)) {
				delete template.Resources[resourceName];
				removedResources.push(resourceName);
			}

		});

		if(removedResources.length)
			this.serverless.cli.log(`${removedResources.length} Resources removed: [${removedResources.join(', ')}]`);

	}
}

module.exports = ServerlessPluginRemoveAuthorizerPermissions;
