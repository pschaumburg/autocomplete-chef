'use babel';

// Should distinguish between helpers, helpers-<provider> and dynamics-<pack>
import suggestionsHelpersDsl from '../data/chef-dslhelpers';
// import suggestionsHelpersMetadata from '../data/chef-metadata';
// import suggestionsHelpersProperties from '../data/chef-properties';
// import suggestionsHelpersRecipes from '../data/chef-recipes';

class ChefProvider {
	constructor() {
		this.selector = '.source.chef';
		this.suggestions = this.initSuggestions();
	}

	// TODO: Read all files in data/ as JSON and concatenate
	initSuggestions() {
		let temp = suggestionsHelpersDsl;
		// temp = temp.concat(suggestionsHelpersMetadata);
		// ...
		// temp = temp.concat(suggestionsHelpersProperties);
		// ...
		// temp = temp.concat(suggestionsHelpersRecipes);
		// ...

		return temp;
	}

	// getOptimisticVersion(version) {
	// 	let components = version.split('.')
	// 	let optimistic = components[0] + '.' + components[1]
	// 	return optimistic
	// }

	getSuggestions(options) {
		const { prefix } = options;

		if (prefix.length >= 1) {
			return this.findMatchingSuggestions(prefix);
		}
	}

  // TODO: Implement dynamic-scope + expansion of options
	findMatchingSuggestions(prefix) {
		let prefixLower = prefix.toLowerCase();
		let matchingSuggestions = this.suggestions.filter((suggestion) => {
			let textLower = suggestion.snippet.toLowerCase();
			return textLower.startsWith(prefixLower);
		});

		return matchingSuggestions.map(this.inflateSuggestion);
	}

	// clones a suggestion object to a new object with some shared additions
	// cloning also fixes an issue where selecting a suggestion won't insert it
	inflateSuggestion(suggestion) {
		// TODO: make this dynamic
		let actype = (suggestion.type != 'dynamic') ? 'function': '';

		let replacementPrefix = suggestion.replacementPrefix;

		// TODO: Use detail info from suggestion.parameters and create text
		//    dynamic!(:#{name}, name, options)\n\n#{option[i].name} (#{option[i].type)) #{option[i].description} #{option[i].default}
		let desc = suggestion.description;

		// TODO: make this dynamic (method.pack + ' ~> ' + method.since.split('.')[0:1].implode('.'))
		let pack = suggestion.package;

		return {
			displayText: suggestion.displaytext,
			snippet: suggestion.snippet,
			descriptionMoreURL: suggestion.descriptionMoreURL,
			leftLabel: suggestion.type,
			rightLabel: pack,
			type: actype,
			descriptionMarkdown: desc
		};
	}
}
export default new ChefProvider();
